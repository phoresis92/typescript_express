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
import Config from '../../config/config.dto';

import {Validator} from "class-validator";

// Validation methods
const validator = new Validator();

import FileDto from './file.dto';
import File from './fileData';

class FileController implements Controller {
    public path = '/file';
    public router = express.Router();

    private Config: Config = Container.get('Config');

    private multer = require('multer');
    private uploads = this.multer({dest: this.Config.basePath + this.Config.uploadPath});
    private fileParams = [
        {name: 'fileData', maxCount: 1},
        {name: 'thumbData', maxCount: 1}
    ];

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .post(`${this.path}/img`, this.uploads.fields(this.fileParams), validationMiddleware(FileDto, false, this.fileParams), this.uploadImages);
    }

    private uploadImages = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        // console.log(validator.isString(request.body.fullName))
        // console.log(validator.isEmail(request.bod.email))
        // const serialNumber = request.body.serialNumber;
        // const keyword = request.body.keyword;
        console.log(request.body.payloadClass);
        console.log(request.files);
        // const page = request.body.page;
const payload: FileDto = request.body;

// payload.setFileData(request.files.fileData)
        // @ts-ignore
let fileObject: {fileData: Multer.File[], thumbData: Multer.File[]} = request.files;
        console.log('fileObject', fileObject)
        console.log('fileObject', typeof fileObject)
        console.log('fileObject', );
        console.log('fileObject', fileObject.thumbData[0]);

        payload.fileData = fileObject.fileData[0];
        payload.thumbData = fileObject.thumbData[0];
        request.body.payloadClass.setFileData(fileObject.fileData[0])
        request.body.payloadClass.setThumbData(fileObject.thumbData[0])
        console.log('payload',payload);
        console.log('payloadClass',request.body.payloadClass);
        // let keys = Object.keys(fileObject);
        // for(let key of keys){
        //     console.log('key', key);
        //     console.log('fileObject.key', fileObject[key]);
        //
        // }

        //     fileData.setFileData(request.files.fileData).setThumbData(request.files.thumbData);
    //     fileData.fileData = fileData.fileData;
    //     fileData.thumbData = fileData.thumbData;
        // const files = request.files;
        // console.log(fileData);
        // console.log(files.thumbData);
        // console.log(request.body);

        // response.send('upload!!! ' + fileData);
        try {

        } catch (e) {
            if (e instanceof ErrorResponse) {
                response.status(e.status).send(new FailResponse(request, request.params, next).make({}, e.errorCode, e.message));
            }
            next(new HttpException(e.status, e.message, request.params));
        }

    };

}

export default FileController;

