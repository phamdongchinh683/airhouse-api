import { index, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from 'src/helpers/columns.helper';
import { conversation } from './conversation.schema';
import { user } from './user.schema';

export const message = pgTable(
  'messages',
  {
    id: uuid().primaryKey(),
    user_id: uuid()
      .references(() => user.id)
      .notNull(),
    conversation_id: uuid()
      .references(() => conversation.id)
      .notNull(),
    message_text: varchar({ length: 255 }).notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      idIdx: index('message_id_idx').on(table.id),
      messageUserIdIdx: index('message_user_id_idx').on(table.user_id),
      messageConversationIdIdx: index('message_conversation_id_idx').on(
        table.conversation_id,
      ),
      createdAtIdx: index('message_created_at_idx').on(table.created_at),
    };
  },
);
