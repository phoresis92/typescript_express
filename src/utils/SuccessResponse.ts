import {NextFunction, Request} from 'express';
import { Container } from 'typedi';
import ResponseInterface from '../interfaces/response.interface';
import Config from '../config'

class SuccessResponse implements ResponseInterface{
    private logger = Container.get('logger');
    // private config: Config = Container.get('config');

    // public request;
    // public params;
    // public next;
    public resultData;
    public sucCode;
    private message;

    constructor(public request: Request, public params: object, public next: NextFunction){};

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
            message: (Config.nodeEnv == 'development' ? this.message : null)
        }
    }

};

export default SuccessResponse;
