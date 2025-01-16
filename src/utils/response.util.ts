import { Response } from 'express';

export function responseStatus(
  res: Response,
  statusCode: number,
  message: string,
) {
  return res.status(statusCode).json({ message: message });
}
