import { NextFunction } from 'express';
import { Container } from 'typedi';
import responseInterface from '../interfaces/response.interface';

class SuccessResponse implements responseInterface{
    private logger = Container.get('logger');
    private config = Container.get('config');
    constructor(public params: object, private next: NextFunction, public resultData: any, private sucCode: number, private message?: string){
        this.callNext();
    };

    private callNext() {
        this.next(this);
    };

    public resultObj(){
        return {
            result: true,
            sucCode: this.sucCode,
            resultData: this.resultData,
            message: (this.config.nodeEnv == 'development' ? this.message : null)
        }
    }


};

export default SuccessResponse;
