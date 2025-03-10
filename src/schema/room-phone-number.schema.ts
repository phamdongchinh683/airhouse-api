import { index, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from 'src/helpers/columns.helper';
import { room } from './room.schema';

export const roomPhoneNumber = pgTable(
  'room_phone_numbers',
  {
    id: uuid().primaryKey(),
    room_id: uuid()
      .references(() => room.id, { onDelete: 'cascade' })
      .notNull(),
    owner_room: varchar({ length: 40 }),
    phone_number: varchar({ length: 13 }),
    image_url: text(),
    ...timestamps,
  },
  (table) => {
    return {
      idIdx: index('room_id_idx').on(table.id),
      roomIdIdx: index('room_id_idx').on(table.room_id),
      createAtIdx: index('room_image_create_at_idx').on(table.created_at),
    };
  },
);
