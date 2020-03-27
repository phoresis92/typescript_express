import * as express from 'express';
import HttpException from '../exceptions/HttpException';
import FailResponse from '../utils/FailResponse';
import SuccessResponse from '../utils/SuccessResponse';

class responseFormatMiddleware {

    constructor(private sr: SuccessResponse){
    }

    public handle (): express.RequestHandler{
        return (req, res, next) => {

            this.sr.request = req;
            this.sr.params = req.params;
            this.sr.next = next;

            req.body.SuccessResponse = this.sr;
            req.body.FailResponse = new FailResponse(req, req.params, next);

            next();

        }
    }
}

export default responseFormatMiddleware;
