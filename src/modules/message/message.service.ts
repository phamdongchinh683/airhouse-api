import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';

import { DrizzleAsyncProvider } from 'src/providers/drizzle.provider';
import * as schemas from '../../schema/schema';
import { MessageCreationDto } from './dto/message.creation.dto';
import { MessageDeleteDto } from './dto/message.delete.dto';
import { MessageHistoryDto } from './dto/message.history.dto';
import { MessageUpdateDto } from './dto/message.update.dto';

@Injectable()
export class MessageService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private database: NodePgDatabase<typeof schemas>,
  ) {}

  async insertMessages(message: MessageCreationDto): Promise<{ id: string }[]> {
    const messageData = {
      id: uuidv4(),
      user_id: message.userId,
      conversation_id: message.conversationId,
      message_text: message.messageText,
    };

    return await this.database
      .insert(schemas.message)
      .values(messageData)
      .returning({
        id: schemas.message.id,
      });
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

  async updateMessage(data: MessageUpdateDto): Promise<QueryResult<never>> {
    return await this.database
      .update(schemas.message)
      .set({
        message_text: data.message_text,
      })
      .where(eq(schemas.message.id, data.id));
  }

  async deleteMessage(data: MessageDeleteDto): Promise<QueryResult<never>> {
    return await this.database
      .delete(schemas.message)
      .where(
        and(
          eq(schemas.message.id, data.id),
          eq(schemas.message.conversation_id, data.conversationId),
        ),
      );
  }
}
