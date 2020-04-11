import {NextFunction, Request} from 'express';
import { Container } from 'typedi';
import ResponseInterface from '../../interfaces/response.interface';
import Config from '../../config/config.dto'

class SuccessResponse implements ResponseInterface{
    private logger = Container.get('logger');
    private Config: Config = Container.get('Config');
    // private config: Config = Container.get('config');

    // public request: Request;
    // public params: object;
    // public next: NextFunction;
    public resultData: any;
    public responseCode: string;
    private message: string | undefined;

    constructor(public request: Request, public params: object, public next: NextFunction){};

    private callNext() {
        this.next(this);
    };

    public make(resultData: any, responseCode: string, message?: string){
        // if(message === undefined){
        //     message = '';
        // }
        this.resultData = resultData;
        this.responseCode = responseCode;
        this.message = message;

        this.callNext();

        return {
            result: true,
            path: `${this.request.path}/${this.responseCode}`,
            resultData: this.resultData,
            message: (this.Config.nodeEnv == 'development' ? this.message : null)
        }
    }

};

export default SuccessResponse;
