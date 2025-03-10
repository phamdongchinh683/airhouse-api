import { index, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from 'src/helpers/columns.helper';
import { room } from './room.schema';

export const roomImage = pgTable(
  'room_images',
  {
    id: uuid().primaryKey(),
    room_id: uuid()
      .references(() => room.id, { onDelete: 'cascade' })
      .notNull(),
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
