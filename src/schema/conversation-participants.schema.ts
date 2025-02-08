import { index, pgTable, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from 'src/helpers/columns.helper';
import { conversation } from './conversation.schema';
import { user } from './user.schema';

export const conversationParticipant = pgTable(
  'conversation_participants',
  {
    id: uuid().primaryKey(),
    user_id: uuid()
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    conversation_id: uuid()
      .references(() => conversation.id, { onDelete: 'cascade' })
      .notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      idIdx: index('conversation_participant_id_idx').on(table.id),
      conversationParticipantUserIdIdx: index(
        'conversation_participant_user_id_idx',
      ).on(table.user_id),
      conversationParticipantConversationIdIdx: index(
        'conversation_participant_conversation__id_idx',
      ).on(table.conversation_id),
      createdAtIdx: index('conversation_participant_created_at_idx').on(
        table.created_at,
      ),
    };
  },
);
