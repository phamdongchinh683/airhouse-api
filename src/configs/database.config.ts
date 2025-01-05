import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const database = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/entities/*.model{.ts,.js}'],
  synchronize: true,
  logging: true, // show query
});
