import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
};
