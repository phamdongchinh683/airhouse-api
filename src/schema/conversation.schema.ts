import { boolean, index, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from 'src/helpers/columns.helper';
import { user } from './user.schema';

export const conversation = pgTable(
  'conversations',
  {
    id: uuid().primaryKey(),
    conversation_name: varchar({ length: 256 }).notNull(),
    user_id: uuid()
      .references(() => user.id)
      .notNull(),
    is_group: boolean(),
    ...timestamps,
  },
  (table) => {
    return {
      idIdx: index('conversation_id_idx').on(table.id),
      userIdIdx: index('conversation_user_id_idx').on(table.user_id),
      isGroupIx: index('conversation_is_group_idx').on(table.is_group),
      createdAtIdx: index('conversation_id_created_at_idx').on(
        table.created_at,
      ),
    };
  },
);
