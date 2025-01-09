import { boolean, index, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from 'src/helpers/columns.helper';
import { user } from './user.schema';

export const token = pgTable(
  'tokens',
  {
    id: uuid().primaryKey(),
    user_id: uuid()
      .references(() => user.id)
      .notNull(),
    token: varchar({ length: 256 }).notNull(),
    status: boolean().notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      idIdx: index('token_id_idx').on(table.id),
      userTokenIdIdx: index('token_user_id_idx').on(table.user_id),
      createAtIdx: index('token_create_at_idx').on(table.create_at),
    };
  },
);
