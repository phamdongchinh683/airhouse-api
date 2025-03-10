import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { timestamps } from 'src/helpers/columns.helper';
import { building } from './building.schema';

export const room = pgTable(
  'rooms',
  {
    id: uuid().primaryKey(),
    room_code: varchar({ length: 10 }).unique(),
    room_type: varchar({ length: 30 }).unique(),
    price: integer().unique(),
    address: text().unique(),
    commission: text().unique(),
    available_date: timestamp().unique(),
    future_available_date: timestamp().unique(),
    room_amenities: text().unique(),
    room_area: integer().unique(),
    costs: text().unique(),
    floor: integer().unique(),
    content: text().unique(),
    room_review: text().unique(),
    status: boolean(),
    room_building_id: uuid()
      .references(() => building.id, { onDelete: 'cascade' })
      .notNull(),

    ...timestamps,
  },
  (table) => {
    return {
      idIdx: index('room_id_idx').on(table.id),
      roomCodeIdx: index('room_project_code_idx').on(table.room_code),
      roomTypeIdx: index('room_type_idx').on(table.room_type),
      createAtIdx: index('room_create_at_idx').on(table.created_at),
    };
  },
);
