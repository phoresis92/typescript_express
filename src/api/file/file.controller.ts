import {celebrate, Joi} from 'celebrate';
import * as fs from 'fs';
// import {Multer} from 'multer';
import {Container, Inject} from 'typedi';
import {Logger} from 'winston';
import ErrorResponse from '../../exceptions/ErrorResponse';
import HttpException from '../../exceptions/HttpException';
import Controller from '../../interfaces/controller.interface';
import validationMiddleware from '../../middleware/validation.middleware';
import FailResponse from '../../utils/FailResponse';
import * as express from 'express';
import ContentsService from '../contents/contents.service';
import ConfigClass from '../../config/config.dto';

import {Validator} from "class-validator";

// Validation methods
const validator = new Validator();

import FileDto, { fileParam, fileParamType } from './file.dto';

class FileController implements Controller {
    public path = '/file';
    public router = express.Router();

    private Config: ConfigClass = Container.get('Config');

    private multer = require('multer');
    private uploads = this.multer({dest: this.Config.basePath + this.Config.uploadPath});


    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .post(`${this.path}/img`, this.uploads.fields(fileParam), validationMiddleware(FileDto, false), this.uploadImages);
        this.router
            .delete(`${this.path}/img`, this.uploads.single('fileData'), validationMiddleware(FileDto, false), this.uploadImages);
    }

    private uploadImages = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {

            const dtoClass = request.body.dtoClass;
            console.log(dtoClass);


            response.send(`${dtoClass.fullName}\n${dtoClass.email}\n${dtoClass.password}\n${dtoClass.fileData}`);

        } catch (e) {
            if (e instanceof ErrorResponse) {
                response.status(e.status).send(new FailResponse(request, request.params, next).make({}, e.errorCode, e.message));
            }
            next(new HttpException(e.status, e.message, request.params));
        }

    };

}

export default FileController;

