import * as express from 'express';

class defaultValueMiddleware {

    private zeroArr: string[];
    private oneArr: string[];

    constructor(){
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
            for (let key of this.zeroArr) {
                if (req.body[key] === '') {
                    req.body[key] = 0;
                }else{
                    req.body[key] = parseInt(req.body[key])
                }
            }
            for (let key of this.oneArr) {
                if (req.body[key] === '') {
                    req.body[key] = 1;
                }else{
                    req.body[key] = parseInt(req.body[key])
                }
            }

            next();

        }
    }
}

export default defaultValueMiddleware;


 // function defaultValueDFSMiddleware<T>(...rest: any[]): express.RequestHandler {
 //    return (req, res, next) => {
 //        let defaultValueMap = new Map();
 //
 //
 //
 //        defaultValueMap.set('TEMP', ['targetType', 'targetKey']);
 //
 //        for(let [key, targetList] of defaultValueMap){
 //            for(let target of targetList) {
 //                if(req.body[target] === ''){
 //                    req.body[target] = key;
 //                }
 //
 //            }
 //        }
 //        const tempList = [];
 //
 //        for(let key of tempList){
 //            if(req.body[key] === ''){
 //                req.body[key] = 'TEMP';
 //            }
 //        }
 //
 //        const zeroList = ['thumbWidth', 'thumbHeight']
 //        const zeroList = ['useUniqueFileName', 'useDateFolder', 'makeThumb', 'thumbOption']
 //
 //    };
// }

