import { NextFunction } from 'express';

interface Response {
  resultData: any;
  sucCode: number;
  params: object;
  next: NextFunction;
}

export default Response;
