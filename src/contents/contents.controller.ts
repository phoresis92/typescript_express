import * as express from 'express';
import {getRepository, createConnection} from 'typeorm';
import Contents from '../entity/contents/contents.entity';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';
import Post from './post.entity';

import success from '../utils/SuccessResponse';

import {celebrate, Joi} from 'celebrate';

import { Container } from 'typedi';
import ContentsService from './contents.service';


class ContentsController implements Controller {
    public path = '/contents';
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/mine`,
                        celebrate({
                            body: Joi.object({
                                serialNumber: Joi.string().required(),
                                page: Joi.number().integer()
                            }),
                        }), this.getContentsBySerial);
        // this.router.get(this.path, this.getAllPosts);
        // this.router.get(`${this.path}/:id`, this.getPostById);
        // this.router
        //   .all(`${this.path}/*`, authMiddleware)
        //   .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
        //   .delete(`${this.path}/:id`, this.deletePost)
        //   .post(this.path, /*authMiddleware,*/ validationMiddleware(CreatePostDto), this.createPost);
    }

    private getContentsBySerial = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        console.log(request.body);
        console.log(request.params);
        console.log(request.query);
        const serialNumber = request.body.serialNumber;
        const page = request.body.page;

        const contentsService = Container.get(ContentsService);
        const contents = await contentsService.getContentsBySerial(serialNumber, page);

        if (!contents) {
            next(new PostNotFoundException(serialNumber));
            return;
        }

        response.send(new success(request.params, next, contents, 1, `here?`).make());

    };

}

export default ContentsController;

