import { SetMetadata } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};
export const tokenLife: string = process.env.JWT_EXPIRES;
export const IS_PUBLIC_KEY: string = process.env.IS_PUBLIC_KEY;
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const accessKeyAws: string = process.env.AWS_ACCESS_KEY;
export const secretKeyAws: string = process.env.AWS_SECRET_KEY;
export const bucketName: string = process.env.AWS_BUCKET_NAME;
export const mailHost: string = process.env.MAIL_HOST;
export const mailUser: string = process.env.MAIL_USER;
export const mailPass: string = process.env.MAIL_PASS;
export const mailPort: string = process.env.MAIL_PORT;
