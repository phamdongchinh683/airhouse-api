import { varchar } from 'drizzle-orm/pg-core';

export const roleEnum = varchar('role', {
  enum: ['sale', 'admin', 'user', 'project_management', 'ctv'],
});

export const statusEnum = varchar('status', {
  enum: ['pending', 'accept', 'refuse'],
});

export const actionEnum = varchar('action', {
  enum: ['create', 'update', 'remove'],
});
