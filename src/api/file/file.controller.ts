import * as express from 'express';
import {promises} from 'fs';
import {Container, Inject} from 'typedi';
import {extname} from 'path';

import Controller from '../../interfaces/controller.interface';
import ConfigClass from '../../config/config.dto';

import HttpException from '../../exceptions/HttpException';
import ErrorResponse from '../../exceptions/ErrorResponse';
import SuccessResponse from '../../utils/SuccessResponse';
import FailResponse from '../../utils/FailResponse';

import defaultValueMiddleware from "../../middleware/defaultValue.middleware";
import validationMiddleware from '../../middleware/validation.middleware';

import FileServiceClass, {FileResponseClass} from './file.service';
import FileDto, {fileParam, fileParamType} from './file.dto';
import multer = require('multer');
import FileHandleClass from '../../utils/fileHandler.class';

const storage = multer.memoryStorage();

class FileController implements Controller {
    public path = '/file';
    public router = express.Router();

    private Config: ConfigClass = Container.get('Config');
    private FileHandler: FileHandleClass = Container.get('FileHandler');

    private uploads = multer({storage: storage}/*{dest: this.Config.basePath + this.Config.uploadPath}*/);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .get(`/download/:filePath/:fileDate/:fileName`
                , this.downloadFile)

            .post(`/file/img`
                , this.uploads.fields(fileParam)
                , new defaultValueMiddleware()
                      .setDefault0(['thumbWidth', 'thumbHeight', 'encodeFps'])
                      .setDefault1(['useUniqueFileName', 'useDateFolder', 'makeThumb', 'thumbOption'])
                      .handle()
                , validationMiddleware(FileDto, false)
                , this.uploadImages)

            .post(`/file/mov`
                , this.uploads.fields(fileParam)
                , new defaultValueMiddleware()
                      .setDefault0(['thumbWidth', 'thumbHeight', 'encodeFps'])
                      .setDefault1(['useUniqueFileName', 'useDateFolder', 'makeThumb', 'thumbOption'])
                      .handle()
                , validationMiddleware(FileDto, false)
                , this.uploadVideos);

    }

    private uploadImages = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const FileService: FileServiceClass = Container.get(FileServiceClass);
            // @ts-ignore
            let responseObj: FileResponseClass = await FileService.uploadImageService(request.body.DtoClass);

            delete request.body.DtoClass;
            response.send(new SuccessResponse(request, request.params, next).make(responseObj, responseObj.code));

        } catch (e) {
            if (e instanceof ErrorResponse) {
                response.status(e.status).send(new FailResponse(request, request.params, next).make({}, e.errorCode, e.message));
            }
            console.log(e);

            next(new HttpException(e.status, e.message, request.params));

        }

    };

    private downloadFile = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {

            const filePath: string = decodeURI(request.params.filePath);
            const fileDate: string = decodeURI(request.params.fileDate);
            const fileName: string = decodeURI(request.params.fileName);

            const path = `${this.Config.basePath}${this.Config.uploadPath}/${filePath}/${fileDate}/${fileName}`;

            const stats = await this.FileHandler.getStat(path);

            if(!stats){
                response.status(404).send(new FailResponse(request, request.params, next).make({}, '01', 'Not Exist File'));
                return;
            }

            new SuccessResponse(request, request.params, next).make({stats}, '01');
            response.sendFile(path);

        } catch (e) {
            if (e instanceof ErrorResponse) {
                response.status(e.status).send(new FailResponse(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }

            next(new HttpException(e.status, e.message, request.params));

        }

    };

    private uploadVideos = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const FileService: FileServiceClass = Container.get(FileServiceClass);
            // @ts-ignore
            let responseObj: FileResponseClass = await FileService.uploadVideoService(request.body.DtoClass);

            delete request.body.DtoClass;
            response.send(new SuccessResponse(request, request.params, next).make(responseObj, responseObj.code));

        } catch (e) {
            if (e instanceof ErrorResponse) {
                response.status(e.status).send(new FailResponse(request, request.params, next).make({}, e.errorCode, e.message));
            }
            console.log(e);

            next(new HttpException(e.status, e.message, request.params));

        }

    };

}

export default FileController;

