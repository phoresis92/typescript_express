import {NextFunction, Request} from 'express';
import { Container } from 'typedi';
import ResponseInterface from '../interfaces/response.interface';

class SuccessResponse implements ResponseInterface{
    private logger = Container.get('logger');
    private config = Container.get('config');

    public resultData;
    private sucCode;
    private message;
    constructor(public request: Request, public params: object, private next: NextFunction){};

    private callNext() {
        this.next(this);
    };

    public make(resultData: any, sucCode: number, message?: string){
        this.resultData = resultData;
        this.sucCode = sucCode;
        this.message = message;

        this.callNext();

        return {
            result: true,
            path: `${this.request.path}/${this.sucCode}`,
            resultData: this.resultData,
            message: (this.config.nodeEnv == 'development' ? this.message : null)
        }
    }

};

export default SuccessResponse;
