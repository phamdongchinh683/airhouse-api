import { index, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from 'src/helpers/columns.helper';
import { building } from './building.schema';

export const buildingPhoneNumber = pgTable(
  'building_phone_numbers',
  {
    id: uuid().primaryKey(),
    building_id: uuid()
      .references(() => building.id, { onDelete: 'cascade' })
      .notNull(),
    phone_number: varchar({ length: 14 }).notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      idIdx: index('building_phone_number_id_idx').on(table.id),
      buildingIdIdx: index('building_phone_number_building_id_idx').on(
        table.building_id,
      ),
      phone_number: index('building_phone_number_idx').on(table.phone_number),
      createAtIdx: index('building_phone_number_created_at_idx').on(
        table.created_at,
      ),
    };
  },
);
