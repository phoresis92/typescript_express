import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import HttpException from '../exceptions/HttpException';
import {Multer} from 'multer';

function validationMiddleware<T>(type: any, skipMissingProperties = false, fileParams: Array<{name:string, maxcount:number}>): express.RequestHandler {
  return (req, res, next) => {
      req.body.dtoClass = plainToClass(type, req.body);
    validate(req.body.dtoClass, { skipMissingProperties })
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
            // @ts-ignore
            const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
          next(new HttpException(400, message));
        } else {
            if(req.file){

            }else if(req.files){
                    let fileObjectType: {[key:string]: Multer.File[]} = {};
                for(let fileParam of fileParams){
                    // @ts-ignore
                    fileObjectType[fileParam.name] = Multer.File[];
                }
                fileParams
                // @ts-ignore
                let fileObject: fileObjectType/*{fileData: Multer.File[], thumbData: Multer.File[]}*/ = req.files;

            }
          next();
        }
      });
  };
}

export default validationMiddleware;
