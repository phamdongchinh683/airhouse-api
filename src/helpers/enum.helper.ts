import { varchar } from 'drizzle-orm/pg-core';

export const roleEnum = varchar('role', {
  enum: ['sale', 'admin', 'user', 'project_management', 'ctv'],
});
