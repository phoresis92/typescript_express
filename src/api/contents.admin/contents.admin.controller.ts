import * as express from 'express';
import ErrorResponse from '../../exceptions/ErrorResponse';
import HttpException from '../../exceptions/HttpException';
// import {getRepository, createConnection} from 'typeorm';
// import Contents from '../entity/contents/contents.entity';
// import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../../interfaces/controller.interface';
import FailResponse from '../../utils/FailResponse';
// import RequestWithUser from '../interfaces/requestWithUser.interface';
// import authMiddleware from '../middleware/auth.middleware';
// import validationMiddleware from '../middleware/validation.middleware';
// import CreatePostDto from './post.dto';
// import Post from './post.entity';

import success from '../../utils/SuccessResponse';

import {celebrate, Joi} from 'celebrate';

import {Container, Inject} from 'typedi';
import ContentsAdminService from './contents.admin.service';
import SuccessResponse from "../../utils/SuccessResponse";
import ContentsService from "../contents/contents.service";
import PushSender from "../../utils/PushSender";


class ContentsController implements Controller {
    public path = '/admin/contents';
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

        try {
            const contentsService = Container.get(ContentsAdminService);
            const {recordSet} = await contentsService.createNoticeService(serialNumber, contents);

            response.send(new SuccessResponse(request, request.params, next).make({}, 1));

            new PushSender()
                .setPosition('NOTICE')
                .setSender(serialNumber)
                .setTargetType('NOTICE')
                .setTargetKey(recordSet.insertId)
                .pushAllUser();

        } catch (e) {
            if (e instanceof ErrorResponse) {
                response.status(e.status).send(new FailResponse(request, request.params, next).make({}, e.errorCode, e.message));
            }
            next(new HttpException(e.status, e.message, request.params));
        }

    };

    private getContents = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const page = request.body.page;
        const keyword = request.body.keyword;

        try {
            const contentsService = Container.get(ContentsAdminService);
            const {contents, imgFile} = await contentsService.getAll(page, keyword);

            response.send(new SuccessResponse(request, request.params, next).make({contents, imgFile}, 1));
        } catch (e) {
            if (e instanceof ErrorResponse) {
                response.status(e.status).send(new FailResponse(request, request.params, next).make({}, e.errorCode, e.message));
            }
            next(new HttpException(e.status, e.message, request.params));
        }

    };


    private deleteContents = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const contentsSeqs = request.body.contentsSeqs;

        try{
            const contentsService = Container.get(ContentsAdminService);
            const {recordSet, updateResult} = await contentsService.delete(contentsSeqs, next);

            response.send(new SuccessResponse(request, request.params, next).make({}, 1));
        } catch (e) {
            if (e instanceof ErrorResponse) {
                response.status(e.status).send(new FailResponse(request, request.params, next).make({}, e.errorCode, e.message));
            }
            next(new HttpException(e.status, e.message, request.params));
        }

    };
}

export default ContentsController;

