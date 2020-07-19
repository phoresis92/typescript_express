import {NextFunction, Request} from 'express';
import { Container } from 'typedi';
import Response from '../../interfaces/Response';
import ConfigClass from '../../config/config.dto'
import LoggerClass from '../logger';

class FailResponse implements Response{
    private logger = LoggerClass.getInstance();

    // public request;
    // public params;
    // public next;
    public resultData: any;
    public responseCode: string;
    private message: string;

    constructor(public request: Request, public params: object, public next: NextFunction){};

    private callNext() {
        this.next(this);
    };

    public make(resultData: any, responseCode: string, message?: string){
        if(message === undefined){
            message = '';
        }
        this.resultData = resultData;
        this.responseCode = responseCode;
        this.message = message;

        const toClientResponseObj = {
            result: false,
            path: `${this.request.path}/${this.responseCode}`,
            resultData: this.resultData,
            message: (ConfigClass.nodeEnv == 'development' ? this.message : null)
        };

        this.request.body.toClientResponseObj = toClientResponseObj;

        this.callNext();

        return toClientResponseObj;

    }

};

export default FailResponse;
