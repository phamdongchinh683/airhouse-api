import {
  index,
  integer,
  pgTable,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { timestamps } from 'src/helpers/columns.helper';

export const building = pgTable(
  'buildings',
  {
    id: uuid().primaryKey(),
    project_code: varchar({ length: 20 }).unique().notNull(),
    building_image: varchar({ length: 255 }).notNull(),
    address: varchar({ length: 255 }).notNull(),
    room_quantity: integer().notNull(),
    room_available: integer().notNull(),
    shared_facilities: text().notNull(),
    commission: varchar({ length: 50 }).notNull(),
    costs: varchar({ length: 255 }).notNull(),
    source: varchar({ length: 50 }).notNull(),
    note: text().notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      idIdx: index('building_id_idx').on(table.id),
      projectCodeIdx: index('building_project_code_idx').on(table.project_code),
      createAtIdx: index('building_created_at_idx').on(table.created_at),
      updateAtIdx: index('building_updated_at_idx').on(table.updated_at),
    };
  },
);
