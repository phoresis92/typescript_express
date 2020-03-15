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
import SuccessResponse from '../../utils/SuccessResponse';
import ContentsService from '../contents/contents.service';
import ConfigClass from '../../config/config.dto';

import {Validator} from "class-validator";

import defaultValueMiddleware from "../../middleware/defaultValue.middleware";

// Validation methods
const validator = new Validator();

import FileDto, { fileParam, fileParamType } from './file.dto';
import multer = require('multer');
const storage = multer.memoryStorage();

import FileHanderClass from '../../utils/fileHandler.class';
import FileServiceClass, {FileResponseClass} from './file.service';


class FileController implements Controller {
    public path = '/file';
    public router = express.Router();

    private Config: ConfigClass = Container.get('Config');

    private uploads = multer({storage: storage}/*{dest: this.Config.basePath + this.Config.uploadPath}*/);


    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .post(`/file/img`
                , this.uploads.fields(fileParam)
                , new defaultValueMiddleware()
                      .setDefault0(['thumbWidth', 'thumbHeight'])
                      .setDefault1(['useUniqueFileName', 'useDateFolder', 'makeThumb', 'thumbOption'])
                      .handle()
                , validationMiddleware(FileDto, false)
                , this.uploadImages);
        this.router
            .delete(`${this.path}/img`, this.uploads.single('fileData'), validationMiddleware(FileDto, false), this.uploadImages);
    }

    private uploadImages = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {

            const DtoClass = request.body.DtoClass;
            console.log(DtoClass);

            const FileService: FileServiceClass = Container.get(FileServiceClass);
            // @ts-ignore
            let responseObj: FileResponseClass = await FileService.uploadImageService(DtoClass);

            response.send(new SuccessResponse(request, request.params, next).make(responseObj, responseObj.code));
        } catch (e) {
            if (e instanceof ErrorResponse) {
                response.status(e.status).send(new FailResponse(request, request.params, next).make({}, e.errorCode, e.message));
            }
            console.log(e)
            next(new HttpException(e.status, e.message, request.params));
        }

    };

}

export default FileController;

