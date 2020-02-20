import {NextFunction, Request} from 'express';
import { Container } from 'typedi';
import ResponseInterface from '../interfaces/response.interface';

class SuccessResponse implements ResponseInterface{
    private logger = Container.get('logger');
    private config = Container.get('config');
    constructor(public request: Request, private next: NextFunction, public resultData: any, private sucCode: number, private message?: string){
        this.callNext();
    };

    private callNext() {
        this.next(this);
    };

    public make(){
        return {
            result: true,
            path: `${this.request.path}/${this.sucCode}`,
            resultData: this.resultData,
            message: (this.config.nodeEnv == 'development' ? this.message : null)
        }
    }

};

export default SuccessResponse;
