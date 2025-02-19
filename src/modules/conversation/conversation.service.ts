import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { DrizzleAsyncProvider } from 'src/providers/drizzle.provider';
import { v4 as uuidv4 } from 'uuid';
import * as schemas from '../../schema/schema';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UserConversation } from './dto/user-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private database: NodePgDatabase<typeof schemas>,
  ) {}

  async initChat(params: CreateConversationDto) {
    return await this.database.transaction(async (tx) => {
      const usersChat = params.userIds.split(','); // example: 1,2,3,4 // id user -> [1,2,3,4]

      const dataConversation = {
        id: uuidv4(),
        conversation_name: 'Couple chat',
        user_id: usersChat[0],
        is_group: params.isGroup,
      };

      const createConversation = await this.database
        .insert(schemas.conversation)
        .values(dataConversation)
        .returning({ id: schemas.conversation.id });

      if (createConversation.length === 0) return 'Cannot create conversation';

      const dataConversationParticipants = usersChat.map((user) => ({
        id: uuidv4(),
        user_id: user,
        conversation_id: createConversation[0].id,
      }));

      const insertUsersChat = await this.database
        .insert(schemas.conversationParticipant)
        .values(dataConversationParticipants);

      if (insertUsersChat.rowCount === 0)
        return `Cannot insert user in to conversation ${createConversation[0].id}`;

      const message = {
        id: uuidv4(),
        user_id: usersChat[0],
        conversation_id: createConversation[0].id,
        message_text: params.message,
      };
      const createMessage = await this.database
        .insert(schemas.message)
        .values(message);

      if (createMessage.rowCount === 0) {
        tx.rollback();
      }
    });
  }

  async getConversationsByUser(userId: string): Promise<any> {
    const conversationData = await this.database
      .select({
        conversationId: schemas.conversation.id,
        conversationName: schemas.conversation.conversation_name,
        isGroup: schemas.conversation.is_group,
      })
      .from(schemas.conversationParticipant)
      .innerJoin(
        schemas.conversation,
        eq(
          schemas.conversationParticipant.conversation_id,
          schemas.conversation.id,
        ),
      )
      .where(and(eq(schemas.conversationParticipant.user_id, userId)))
      .execute();

    return conversationData;
  }

  async findAllUserInConversation(
    conversationId: string,
  ): Promise<UserConversation[]> {
    const usersConversation = await this.database
      .select({
        userId: schemas.conversationParticipant.user_id,
        userEmail: schemas.user.email,
      })
      .from(schemas.conversationParticipant)
      .innerJoin(
        schemas.user,
        eq(schemas.user.id, schemas.conversationParticipant.user_id),
      )
      .where(
        eq(schemas.conversationParticipant.conversation_id, conversationId),
      )
      .execute();

    return usersConversation;
  }
}
