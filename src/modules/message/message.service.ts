import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';

import { DrizzleAsyncProvider } from 'src/providers/drizzle.provider';
import * as schemas from '../../schema/schema';
import { MessageCreationDto } from './dto/message.creation.dto';
import { MessageHistoryDto } from './dto/message.history.dto';

@Injectable()
export class MessageService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private database: NodePgDatabase<typeof schemas>,
  ) {}

  async insertMessages(data: MessageCreationDto): Promise<QueryResult<never>> {
    const messages = data.messages.map((message) => ({
      id: uuidv4(),
      user_id: data.userId,
      conversation_id: message.conversationId,
      message_text: message.messageText,
    }));

    return await this.database.insert(schemas.message).values(messages);
  }

  async getMessages(conversationId: string): Promise<MessageHistoryDto[]> {
    return await this.database
      .select({
        id: schemas.message.id,
        userEmail: schemas.user.email,
        messageText: schemas.message.message_text,
        createdAt: schemas.message.created_at,
      })
      .from(schemas.message)
      .leftJoin(schemas.user, eq(schemas.user.id, schemas.message.user_id))
      .where(eq(schemas.message.conversation_id, conversationId))
      .orderBy(schemas.message.created_at);
  }
}
