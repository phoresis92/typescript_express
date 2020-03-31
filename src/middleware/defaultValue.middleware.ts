import * as express from 'express';
import HttpException from '../exceptions/HttpException';
import FailResponse from '../utils/response/FailResponse';
import SuccessResponse from '../utils/response/SuccessResponse';

class defaultValueMiddleware {

    private zeroArr: string[];
    private oneArr: string[];

    constructor(){
        this.zeroArr = [];
        this.oneArr = [];
    }

    public setDefault0(zeroArr: string[]){
        this.zeroArr = zeroArr;
        return this;
    }

    public setDefault1(oneArr: string[]){
        this.oneArr = oneArr;
        return this;
    }

    public handle (): express.RequestHandler{
        return (req, res, next) => {
            let NaNArr: string[] = [];

            if(req.method === 'GET'){
                for (let key of this.zeroArr) {
                    if (req.query[key] === '') {
                        req.query[key] = 0;
                    }else{
                        req.query[key] = parseInt(req.query[key]);
                        if(isNaN(req.query[key])){
                            NaNArr.push(key);
                        }
                    }
                }
                for (let key of this.oneArr) {
                    if (req.query[key] === '') {
                        req.query[key] = 1;
                    }else{
                        req.query[key] = parseInt(req.query[key]);
                        if(isNaN(req.query[key])){
                            NaNArr.push(key);
                        }
                    }
                }

            }else {
                for (let key of this.zeroArr) {
                    if (req.body[key] === '' || req.body[key] === undefined) {
                        req.body[key] = 0;
                    }else{
                        req.body[key] = parseInt(req.body[key]);
                        if(isNaN(req.body[key])){
                            NaNArr.push(key);
                        }
                    }
                }
                for (let key of this.oneArr) {
                    if (req.body[key] === '' || req.body[key] === undefined) {
                        req.body[key] = 1;
                    }else{
                        req.body[key] = parseInt(req.body[key]);
                        if(isNaN(req.body[key])){
                            NaNArr.push(key);
                        }
                    }
                }

            }

            if(NaNArr.length !== 0){
                throw new HttpException(400, `${NaNArr.join(',')} is NaN`);

            }

            next();

        }
    }
}

export default defaultValueMiddleware;
