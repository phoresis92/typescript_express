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

import defaultValueMiddleware from "../../middleware/defaultValue.middleware";

// Validation methods
const validator = new Validator();

import FileDto, { fileParam, fileParamType } from './file.dto';
import multer = require('multer');
const storage = multer.memoryStorage();

import FileHanderClass from '../../utils/fileHandler.class';


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

            const dtoClass = request.body.dtoClass;
            console.log(dtoClass);

            await new FileHanderClass()
                .uploadFileByBuffer(`${this.Config.basePath}${this.Config.uploadPath}`, `${dtoClass.fileData.originalname}`, dtoClass.fileData.buffer, 1);

            // await new FileHanderClass()
            //     .deleteFile(`${this.Config.basePath}${this.Config.uploadPath}`, `${dtoClass.fileData.originalname}`);

            console.log(123);

            // const buff = new Buffer(dtoClass.fileData.buffer.length);
            // let char = '';
            // for(let i = 0 ; i < dtoClass.fileData.buffer.length ; i++){
            //     buff[i] = dtoClass.fileData.buffer[i];
            //     char += ` ${dtoClass.fileData.buffer[i]}`
            // }
            //
            // const result = fs.writeFileSync(`${this.Config.basePath}${this.Config.uploadPath}/${dtoClass.fileData.originalname}`, char, 'binary');
            // console.log(result);

            // const fileStream = fs.createWriteStream(`${this.Config.basePath}${this.Config.uploadPath}/${dtoClass.fileData.originalname}`);
            // fileStream.on('error', (err)=>{
            //     throw new Error(err);
            // });
            //
            // dtoClass.fileData.pipe(fileStream);
            //
            // fileStream.on('end', (err)=>{
            //     if(err){
            //         throw new Error(err);
            //         return;
            //     }
            //
            // });

            /*fs.existsSync(filePath, function (exists) {
                if (exists === false) {
                    mkdirp.sync(filePath);
                }

                var fileStream = fs.createWriteStream(filePath + fileName);
                fileStream.on('error', function (err) {
                    LogErrorDao.error('FILE_UPLOAD_STREAM', err);
                });

                fileData.pipe(fileStream);

                fileData.on('end', function (err) {
                    if (err) {
                        LogErrorDao.error('FILE_UPLOAD_WRITE', err);
                        next(err);
                    } else {
                        next(null);
                    }
                });
            });*/

            // response.send(`${dtoClass.fullName}\n${dtoClass.email}\n${dtoClass.password}\n${dtoClass.fileData}`);
            response.sendFile()
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

