import {plainToClass} from 'class-transformer';
import {validate, ValidationError} from 'class-validator';
import * as express from 'express';
import {Container} from 'typedi';
import HttpException from '../exceptions/HttpException';
import FileDto, {fileParam, fileParamType} from '../api/file/file.dto';

function validationMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
    return (req, res, next) => {

        if (req.file) {
            req.body[req.file.fieldname] = 'Essential';

        } else if (req.files) {
            let keys = Object.keys(req.files);

            for (let key of keys) {
                req.body[key] = 'Essential';

            }

        }

        req.body.DtoClass = plainToClass(type, req.body);

        validate(req.body.DtoClass, {skipMissingProperties})
            .then((errors: ValidationError[]) => {
                if (errors.length > 0) {
                    // @ts-ignore
                    const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
                    next(new HttpException(400, message));
                    return;
                }

                if (req.file) {

                    req.body.DtoClass[req.file.fieldname] = req.file;

                } else if (req.files) {

                    // @ts-ignore
                    let fileObject: fileParamType = req.files;

                    let keys = Object.keys(req.files);
                    for (let param of fileParam) {

                        // @ts-ignore
                        if (fileObject[param.name] && fileObject[param.name][0]) {
                            // @ts-ignore
                            req.body.DtoClass[param.name] = fileObject[param.name][0];
                        }

                    }

                }

                next();

            });
    };
}

export default validationMiddleware;
