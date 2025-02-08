import {
  index,
  integer,
  pgTable,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { timestamps } from 'src/helpers/columns.helper';
import { roleEnum } from 'src/helpers/enum.helper';

export const user = pgTable(
  'users',
  {
    id: uuid().primaryKey(),
    email: varchar({ length: 100 }).unique().notNull(),
    password: varchar({ length: 256 }).notNull(),
    phone_number: varchar({ length: 14 }).unique().notNull(),
    image: varchar({ length: 256 }),
    role: roleEnum.notNull(),
    download_count: integer(),
    copy_count: integer(),
    employee_code: varchar({ length: 20 }),
    ...timestamps,
  },
  (table) => {
    return {
      idIdx: index('id_idx').on(table.id),
      emailIdx: uniqueIndex('email_idx').on(table.email),
      phoneNumberIdx: uniqueIndex('phone_number_idx').on(table.phone_number),
      roleIdx: index('role_idx').on(table.role),
      createAtIdx: index('user_create_at_idx').on(table.created_at),
    };
  },
);
