import { NextFunction } from 'express';

interface Response {
  resultData: any;
  responseCode: string;
  params: object;
  next: NextFunction;
}

export default Response;
