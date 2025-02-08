import { index, json, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from 'src/helpers/columns.helper';
import { actionEnum } from 'src/helpers/enum.helper';
import { user } from './user.schema';

export const history = pgTable(
  'histories',
  {
    id: uuid().primaryKey(),
    entity_id: uuid().notNull(),
    detail: text().notNull(),
    user_id: uuid()
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    data: json().notNull(),
    action: actionEnum.notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      idIdx: index('history_id_idx').on(table.id),
      entityIdIdx: index('history_entity_id_idx').on(table.entity_id),
      createAtIdx: index('history_created_at_idx').on(table.created_at),
      updateAtIdx: index('history_updated_at_idx').on(table.updated_at),
    };
  },
);
