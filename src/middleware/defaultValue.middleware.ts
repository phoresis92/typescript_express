import * as express from 'express';
import HttpException from '../exceptions/HttpException';
import FailResponse from '../utils/response/FailResponse';
import SuccessResponse from '../utils/response/SuccessResponse';

class defaultValueMiddleware {

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

            if(req.method === 'GET'){
                for (let key of this.dateArr) {
                    req.query[key] = new Date(req.query[key]);
                }
                for (let key of this.numberArr) {
                    req.query[key] = parseInt(req.query[key]);
                }
                for (let key of this.zeroArr) {
                    if (req.query[key] === '') {
                        req.query[key] = 0;
                    }else{
                        req.query[key] = parseInt(req.query[key]);
                    }
                }
                for (let key of this.oneArr) {
                    if (req.query[key] === '') {
                        req.query[key] = 1;
                    }else{
                        req.query[key] = parseInt(req.query[key]);
                    }
                }
                for (let key of this.makeArr) {
                    if (typeof req.query[key] === 'string') {
                        const rowArr = (req.query[key]).split(',');
                        req.query[key] = rowArr.filter((val: string) => val !== '');
                    }
                }

            }else {
                for (let key of this.dateArr) {
                    req.body[key] = new Date(req.body[key]);
                }
                for (let key of this.numberArr) {
                    req.body[key] = parseInt(req.body[key]);
                }
                for (let key of this.zeroArr) {
                    if (req.body[key] === '' || req.body[key] === undefined) {
                        req.body[key] = 0;
                    }else{
                        req.body[key] = parseInt(req.body[key]);
                    }
                }
                for (let key of this.oneArr) {
                    if (req.body[key] === '' || req.body[key] === undefined) {
                        req.body[key] = 1;
                    }else{
                        req.body[key] = parseInt(req.body[key]);
                    }
                }
                for (let key of this.makeArr) {
                    if (typeof req.body[key] === 'string') {
                        const rowArr = (req.body[key]).split(',');
                        req.body[key] = rowArr.filter((val: string) => val !== '');
                    }
                }

            }

            next();

        }
    }
}

export default defaultValueMiddleware;
