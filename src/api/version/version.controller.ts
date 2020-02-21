import * as express from 'express';
import HttpException from '../../exceptions/HttpException';
// import {getRepository, createConnection} from 'typeorm';
// import Contents from '../entity/contents/contents.entity';
// import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../../interfaces/controller.interface';
// import RequestWithUser from '../interfaces/requestWithUser.interface';
// import authMiddleware from '../middleware/auth.middleware';
// import validationMiddleware from '../middleware/validation.middleware';
// import CreatePostDto from './post.dto';
// import Post from './post.entity';

import SuccessResponse from '../../utils/SuccessResponse';

import {celebrate, Joi} from 'celebrate';

import {Container, Inject} from 'typedi';
import VersionService from './version.service';
import {Logger} from "winston";
import ErrorResponse from "../../exceptions/ErrorResponse";
import FailResponse from "../../utils/FailResponse";


class VersionController implements Controller {
    public path = '/version';
    public router = express.Router();

    @Inject('logger')
    private logger: Logger;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .get(`${this.path}/:type`,
                celebrate({
                    params: Joi.object({
                        type: Joi.string().required()
                    })
                }), this.recentVersion)
    }

    private recentVersion = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const type: string = request.params.type;

        try {
            const versionService = Container.get(VersionService);
            const {versionData} = await versionService.getRecent(type);

            response.send(new SuccessResponse(request, request.params, next).make({versionData}, 1));
        } catch (e) {
            if (e instanceof ErrorResponse) {
                response.status(e.status).send(new FailResponse(request, request.params, next).make({}, e.errorCode, e.message));
            }
            next(new HttpException(e.status, e.message, request.params));
        }

    };

}

export default VersionController;

