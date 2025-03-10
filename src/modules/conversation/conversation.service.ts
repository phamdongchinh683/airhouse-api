import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
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
    return await this.database.transaction(async () => {
      try {
        const usersChat = params.userIds.split(','); // example: "1,2,3,4" -> [1,2,3,4]

        const dataConversation = {
          id: uuidv4(),
          conversation_name: params.conversationName, // get email user from client with input email user receive message example: chinhchinh@gmail.com
          user_id: usersChat[0], // get first element create conversation when init chat,
          is_group: params.isGroup, // true -> group , false - private 1 - 1 user
        };

        const createConversation = await this.database
          .insert(schemas.conversation)
          .values(dataConversation)
          .returning({ id: schemas.conversation.id });

        if (createConversation.length === 0) {
          throw new Error('Cannot create conversation');
        }

        const conversationId = createConversation[0].id;

        const dataConversationParticipants = usersChat.map((user) => ({
          id: uuidv4(),
          user_id: user,
          conversation_id: conversationId,
        }));

        const insertUsersChat = await this.database
          .insert(schemas.conversationParticipant)
          .values(dataConversationParticipants);

        if (insertUsersChat.rowCount === 0) {
          throw new Error(
            `Cannot insert users into conversation ${conversationId}`,
          );
        }

        const message = {
          id: uuidv4(),
          user_id: usersChat[0],
          conversation_id: conversationId,
          message_text: params.message,
        };

        const createMessage = await this.database
          .insert(schemas.message)
          .values(message);

        if (createMessage.rowCount === 0) {
          throw new Error('Not receive message start conversation');
        }

        return {
          conversationId,
          users: usersChat,
        };
      } catch (error) {
        throw error;
      }
    });
  }

  async getConversationsByUser(userId: string): Promise<any> {
    const conversationData = await this.database
      .select({
        conversationId: schemas.conversation.id,
        conversationName: schemas.conversation.conversation_name,
      })
      .from(schemas.conversation)
      .leftJoin(
        schemas.conversationParticipant,
        eq(
          schemas.conversation.id,
          schemas.conversationParticipant.conversation_id,
        ),
      )
      .where(eq(schemas.conversationParticipant.user_id, userId))
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

  async findConversationById(id: string): Promise<
    {
      id: string;
    }[]
  > {
    return this.database
      .select({ id: schemas.conversation.id })
      .from(schemas.conversation)
      .where(eq(schemas.conversation.id, id));
  }
}
