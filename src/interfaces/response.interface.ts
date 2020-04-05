import { NextFunction } from 'index.d.ts';

interface Response {
  resultData: any;
  responseCode: string;
  params: object;
  next: NextFunction;
}

export default Response;
