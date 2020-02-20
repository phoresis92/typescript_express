import * as express from 'express';
import HttpException from '../exceptions/HttpException';
// import {getRepository, createConnection} from 'typeorm';
// import Contents from '../entity/contents/contents.entity';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../interfaces/controller.interface';
// import RequestWithUser from '../interfaces/requestWithUser.interface';
// import authMiddleware from '../middleware/auth.middleware';
// import validationMiddleware from '../middleware/validation.middleware';
// import CreatePostDto from './post.dto';
// import Post from './post.entity';

import success from '../utils/SuccessResponse';

import {celebrate, Joi} from 'celebrate';

import {Container, Inject} from 'typedi';
import ContentsService from './contents.service';


class ContentsController implements Controller {
    public path = '/contents';
    public router = express.Router();

    constructor(
        @Inject('logger')
        private logger
    ) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/mine`,
                        celebrate({
                            body: Joi.object({
                                serialNumber: Joi.string().required(),
                                page: Joi.number().integer()
                            }),
                        }), this.getContentsBySerial)
            .get(`${this.path}/notice/:test`, this.getNotice)
            .post(`${this.path}`,
                  celebrate({
                      body: Joi.object({
                          serialNumber: Joi.string().required(),
                          phoneNumber: Joi.string().required(),
                          fileSeqs: Joi.string().required(),
                      })
                  }), this.createContents)
        // this.router.get(this.path, this.getAllPosts);
        // this.router.get(`${this.path}/:id`, this.getPostById);
        // this.router
        //   .all(`${this.path}/*`, authMiddleware)
        //   .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
        //   .delete(`${this.path}/:id`, this.deletePost)
        //   .post(this.path, /*authMiddleware,*/ validationMiddleware(CreatePostDto), this.createPost);
    }

    private createContents = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const serialNumber = request.body.serialNumber;
        const phoneNumber = request.body.phoneNumber;
        const fileSeqs = request.body.fileSeqs;

        try{
            const contentsService = Container.get(ContentsService);
            const {recordSet, updateResult} = await contentsService.create(serialNumber, phoneNumber, fileSeqs, next);

            response.send(new success(request, request.params, next).make({}, 1));
        }catch(e){
            this.logger.error(e.stack());
            next(new HttpException(500, e.message, request.params));
        }

    };

    private getContentsBySerial = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const serialNumber = request.body.serialNumber;
        const page = request.body.page;

        try{
            const contentsService = Container.get(ContentsService);
            const {contents, imgFile} = await contentsService.getBySerial(serialNumber, page);

            response.send(new success(request, request.params, next).make({contents, imgFile}, 1));
            if (!contents) {
                next(new PostNotFoundException(serialNumber));
                return;
            }
        }catch(e){
            this.logger.error(e.stack());
            next(new HttpException(500, e.message, request.params))
        }

    };

    private getNotice = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try{
            const contentsService = Container.get(ContentsService);
            const {notice, imgFile} = await contentsService.getNotice();
            next(new HttpException(500, 'wrwerwr', request.params))

            // response.send(new success(request, request.params, next).make({notice, imgFile}, 1));
        }catch(e){
            this.logger.error(e.stack());
            next(new HttpException(500, e.message, request.params))
        }
    };

}

export default ContentsController;

