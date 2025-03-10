import { index, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from 'src/helpers/columns.helper';
import { user } from './user.schema';

export const token = pgTable(
  'tokens',
  {
    id: uuid().primaryKey(),
    user_id: uuid()
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    token: text().notNull().unique(),
    ...timestamps,
  },
  (table) => {
    return {
      idIdx: index('token_id_idx').on(table.id),
      userTokenIdIdx: index('token_user_id_idx').on(table.user_id),
      tokenIdx: index('token_idx').on(table.token),
      createAtIdx: index('token_create_at_idx').on(table.created_at),
    };
  },
);
