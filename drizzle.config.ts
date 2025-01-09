import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
dotenv.config({ debug: false });

export default defineConfig({
  out: './drizzle',
  schema: './src/schema/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
console.log('Connected database', process.env.DATABASE_URL);
