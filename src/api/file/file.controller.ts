import {Router, Request, Response, NextFunction} from 'express';
import {Container, Inject} from 'typedi';

import Controller from '../../interfaces/controller.interface';
import ConfigClass from '../../config/config.dto';

import HttpException from '../../exceptions/HttpException';
import JwtValidClass from '../../middleware/jwtValid.middleware';

import middleware from '../../middleware';
import ResponseClass from '../../utils/response';

import FileServiceClass, {FileResponseClass} from './file.service';
import FileDto, {fileParam, fileParamType} from './file.dto';
import multer = require('multer');
import FileHandleClass from '../../utils/file/fileHandler.class';


/*const upload = multer({
                          storage: multerS3({
                                                s3: new AWS.S3(), bucket: 'react-nodebird', key(req, file, cb) {
                                  cb(null, `original/${+new Date()}${path.basename(file.originalname)}`);
                              },
                                            }), limits: {fileSize: 20 * 1024 * 1024},
                      });*/

class FileController implements Controller {
    public path = '/file';
    public router = Router();

    // private Config: ConfigClass = Container.get('Config');
    private FileHandler: FileHandleClass = Container.get('FileHandler');

    private uploads = multer({
                                 storage: multer.memoryStorage(),
                                 limits: { fileSize: 20 * 1024 * 1024 },
    }/*{dest: this.Config.basePath + this.Config.uploadPath}*/);

    private JwtValid: JwtValidClass;

    constructor() {
        this.JwtValid = new middleware.JwtValid();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .get(`/download/:filePath/:fileDate/:fileName`
                , this.downloadFile)

            .post(`/file/img`
                , this.JwtValid.decodeToken()
                , this.uploads.fields(fileParam)
                , new middleware.defaultValue()
                      .setDefault0(['thumbWidth', 'thumbHeight', 'encodeFps'])
                      .setDefault1(['useUniqueFileName', 'useDateFolder', 'makeThumb', 'thumbOption'])
                      .handle()
                , middleware.validation(FileDto, false)
                , this.uploadImages)

            .post(`/file/mov`
                , this.uploads.fields(fileParam)
                , new middleware.defaultValue()
                      .setDefault0(['thumbWidth', 'thumbHeight', 'encodeFps'])
                      .setDefault1(['useUniqueFileName', 'useDateFolder', 'makeThumb', 'thumbOption'])
                      .handle()
                , middleware.validation(FileDto, false)
                , this.uploadVideos);

    }

    private downloadFile = async (request: Request, response: Response, next: NextFunction) => {
        try {

            const filePath: string = decodeURI(request.params.filePath);
            const fileDate: string = decodeURI(request.params.fileDate);
            const fileName: string = decodeURI(request.params.fileName);

            const path = `${ConfigClass.basePath}${ConfigClass.uploadPath}/${filePath}/${fileDate}/${fileName}`;

            const stats = await this.FileHandler.getStat(path);

            if(!stats){
                response.status(404).send(new ResponseClass.fail(request, request.params, next).make({}, '01', 'Not Exist File'));
                return;
            }

            new ResponseClass.success(request, request.params, next).make({stats}, '01');
            response.sendFile(path);

        } catch (e) {
            if (e.errorCode) {
                response.status(e.status).send(new ResponseClass.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }

            next(new HttpException(e.status, e.message, request.params));

        }

    };

    private uploadImages = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const FileService: FileServiceClass = Container.get(FileServiceClass);
            let responseObj: FileResponseClass = await FileService.uploadImageService(request.body.DtoClass, request.cookies.token);

            delete responseObj.userId;
            delete request.body.DtoClass;
            response.send(new ResponseClass.success(request, request.params, next).make(responseObj, responseObj.code));

        } catch (e) {
            delete request.body.DtoClass;

            if (e.errorCode) {
                response.status(e.status).send(new ResponseClass.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }
            console.log(e);

            next(new HttpException(e.status, e.message, request.params));

        }

    };

    private uploadVideos = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const FileService: FileServiceClass = Container.get(FileServiceClass);
            let responseObj: FileResponseClass = await FileService.uploadVideoService(request.body.DtoClass, request.body.token);

            delete request.body.DtoClass;
            response.send(new ResponseClass.success(request, request.params, next).make(responseObj, responseObj.code));

        } catch (e) {
            delete request.body.DtoClass;

            if (e.errorCode) {
                response.status(e.status).send(new ResponseClass.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }
            console.log(e);

            next(new HttpException(e.status, e.message, request.params));

        }

    };

}

export default FileController;

