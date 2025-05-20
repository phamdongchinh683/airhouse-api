import { Response } from 'express';

export function responseStatus(
  res: Response,
  statusCode: number,
  status: 'success' | 'failed',
  message: string,
) {
  return res.status(statusCode).json({ status: status, data: message });
}

export function responseSocket(
  socket: any,
  listen: string,
  status: 'success' | 'failed',
  data: any,
) {
  if (status === 'failed') {
    socket.emit(`${listen}`, {
      status: status,
      message: data,
    });
  } else {
    socket.emit(`${listen}`, {
      status: status,
      data: data,
    });
  }
}
