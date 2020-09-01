import * as express from 'express';
import HttpException from '../exceptions/HttpException';
import FailResponse from '../utils/response/FailResponse';
import SuccessResponse from '../utils/response/SuccessResponse';

class DefaultValueMiddleware {

    private dateArr: string[];
    private numberArr: string[];
    private zeroArr: string[];
    private oneArr: string[];
    private makeArr: string[];

    constructor(){
        this.dateArr = [];
        this.numberArr = [];
        this.zeroArr = [];
        this.oneArr = [];
        this.makeArr = [];
    }

    public setDate(dateArr: string[]){
        this.dateArr = dateArr;
        return this;
    }

    public setNumber(numberArr: string[]){
        this.numberArr = numberArr;
        return this;
    }

    public setDefault0(zeroArr: string[]){
        this.zeroArr = zeroArr;
        return this;
    }

    public setDefault1(oneArr: string[]){
        this.oneArr = oneArr;
        return this;
    }

    public makeArray(makeArr: string[]){
        this.makeArr = makeArr;
        return this;
    }

    public handle (): express.RequestHandler{
        return (req, res, next) => {

            let target;
            if(req.method === 'GET'){
                target = req.query;
            }else{
                target = req.body;
            }


            for (let key of this.dateArr) {
                target[key] = new Date(target[key]);
            }
            for (let key of this.numberArr) {
                target[key] = parseInt(target[key]);
            }
            for (let key of this.zeroArr) {
                if (target[key] === '' || target[key] === undefined) {
                    target[key] = 0;
                }else{
                    target[key] = parseInt(target[key]);
                }
            }
            for (let key of this.oneArr) {
                if (target[key] === '' || target[key] === undefined) {
                    target[key] = 1;
                }else{
                    target[key] = parseInt(target[key]);
                }
            }
            for (let key of this.makeArr) {
                if (typeof target[key] === 'string') {
                    const rowArr = (target[key]).split(',');
                    target[key] = rowArr.filter((val: string) => val !== '');
                }
            }


            next();

        }
    }
}

export default DefaultValueMiddleware;
