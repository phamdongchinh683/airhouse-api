import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { DrizzleAsyncProvider } from 'src/providers/drizzle.provider';
import * as schemas from '../../schema/schema';
import { UserConversation } from './dto/user-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject(DrizzleAsyncProvider)
    private database: NodePgDatabase<typeof schemas>,
  ) {}

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
