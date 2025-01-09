import { boolean, index, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from 'src/helpers/columns.helper';
import { user } from './user.schema';

export const approvedDevices = pgTable(
  'approved_devices',
  {
    id: uuid('id').primaryKey(),
    user_id: uuid()
      .references(() => user.id)
      .notNull()
      .notNull(),
    device_info: varchar({ length: 255 }).notNull(),
    status: boolean().notNull(),
    approved_by: uuid()
      .references(() => user.id)
      .notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      idIdx: index('approved_device_id_idx').on(table.id),
      userIdIdx: index('approved_device_user_id_idx').on(table.user_id),
      approveIdIdx: index('approve_id_idx').on(table.approved_by),
      statusIdx: index('approved_device_status_idx').on(table.status),
      createAtIdx: index('approved_device_created_at_idx').on(table.create_at),
    };
  },
);
