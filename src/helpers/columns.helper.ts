import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
  create_at: timestamp().defaultNow(),
  update_at: timestamp().defaultNow(),
};
