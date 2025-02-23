import { index, inet, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from 'src/helpers/columns.helper';
import { user } from './user.schema';

export const loginRecord = pgTable(
  'login_records',
  {
    id: uuid().primaryKey(),
    user_id: uuid()
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    ip: inet(),
    device_info: varchar({ length: 255 }).notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      idIdx: index('login_record_id_idx').on(table.id),
      userIdIdx: index('login_record_user_id_idx').on(table.user_id),
      createdAtIdx: index('login_record_created_at_idx').on(table.created_at),
    };
  },
);
