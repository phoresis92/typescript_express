import * as express from 'express';
import HttpException from '../exceptions/HttpException';
// import {getRepository, createConnection} from 'typeorm';
// import Contents from '../entity/contents/contents.entity';
// import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../interfaces/controller.interface';
// import RequestWithUser from '../interfaces/requestWithUser.interface';
// import authMiddleware from '../middleware/auth.middleware';
// import validationMiddleware from '../middleware/validation.middleware';
// import CreatePostDto from './post.dto';
// import Post from './post.entity';

import success from '../utils/SuccessResponse';

import {celebrate, Joi} from 'celebrate';

import {Container, Inject} from 'typedi';
import ContentsAdminService from './contents.admin.service';
import SuccessResponse from "../utils/SuccessResponse";
import ContentsService from "../contents/contents.service";


class ContentsController implements Controller {
    public path = '/contents';
    public router = express.Router();

    @Inject('logger')
    private logger;
    @Inject('success')
    private success: SuccessResponse;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .post(`${this.path}/list`,
                celebrate({
                    body: Joi.object({
                        page: Joi.number().integer().required(),
                        keyword: Joi.string().allow(''),
                    }),
                }), this.getContents)
            .post(`${this.path}/notice`,
                celebrate({
                    body: Joi.object({
                        serialNumber: Joi.string().required(),
                        contents: Joi.string().required()
                    }),
                }), this.createNotice)
            .delete(`${this.path}`,
                celebrate({
                    body: Joi.object({
                        contentsSeqs: Joi.string().required()
                    }),
                }), this.deleteContents)
    }

    private createNotice = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const serialNumber = request.body.serialNumber;
        const contents = request.body.contents;
        console.log(serialNumber)
        console.log(contents)
        try {
            const contentsService = Container.get(ContentsAdminService);
            const {recordSet} = await contentsService.createNoticeService(serialNumber, contents);

            response.send(new success(request, request.params, next).make({}, 1));
        } catch (e) {
            console.log(e)
            this.logger.error(e.message);
            next(new HttpException(500, e.message, request.params));
        }

    };

    private getContents = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const page = request.body.page;
        const keyword = request.body.keyword;

        try {
            const contentsService = Container.get(ContentsAdminService);
            const {contents, imgFile} = await contentsService.getAll(page, keyword);

            response.send(new SuccessResponse(request, request.params, next).make({contents, imgFile}, 1));
            if (!contents) {
                // next(new PostNotFoundException(serialNumber));
                return;
            }
        } catch (e) {
            console.log(e)
            this.logger.error(e.stack());
            next(new HttpException(500, e.message, request.params))
        }

    };


    private deleteContents = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const contentsSeqs = request.body.contentsSeqs;

        try{
            const contentsService = Container.get(ContentsAdminService);
            const {recordSet, updateResult} = await contentsService.delete(contentsSeqs, next);

            response.send(new success(request, request.params, next).make({recordSet, updateResult}, 1));
        }catch(e){
            console.log(e);
            // this.logger.error(e.message);
            next(new HttpException(500, e.message, request.params))
        }
    };
}

export default ContentsController;

