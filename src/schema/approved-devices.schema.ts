import { index, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from 'src/helpers/columns.helper';
import { statusEnum } from 'src/helpers/enum.helper';
import { user } from './user.schema';

export const approvedDevice = pgTable(
  'approved_devices',
  {
    id: uuid('id').primaryKey(),
    user_id: uuid()
      .references(() => user.id)
      .notNull()
      .notNull(),
    device_info: varchar({ length: 255 }).notNull(),
    status: statusEnum.notNull(),
    approved_by: uuid().references(() => user.id),
    ...timestamps,
  },
  (table) => {
    return {
      idIdx: index('approved_device_id_idx').on(table.id),
      userIdIdx: index('approved_device_user_id_idx').on(table.user_id),
      approveIdIdx: index('approve_id_idx').on(table.approved_by),
      statusIdx: index('approved_device_status_idx').on(table.status),
      createdAtIdx: index('approved_device_created_at_idx').on(
        table.created_at,
      ),
    };
  },
);
