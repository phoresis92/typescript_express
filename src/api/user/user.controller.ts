import * as express from 'express';
import moment from 'moment';
import {Container, Inject} from 'typedi';

import middleware from '../../middleware';
import dto from './dto';
import Response from '../../utils/response';

import Controller from '../../interfaces/controller.interface';
import JwtValidClass from '../../middleware/jwtValid.middleware';

import HttpException from '../../exceptions/HttpException';

import UserServiceClass from './user.service';

class UserController implements Controller {
    public path = '/auth';
    public router = express.Router();

    private JwtValid: JwtValidClass;

    constructor() {
        this.JwtValid = new middleware.JwtValid();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .put(`/user/profile`
                , this.JwtValid.decodeToken()
                , new middleware.defaultValue()
                     // .setDate([])
                     // .setNumber([])
                     .setDefault0(['fileSeq'])
                     // .setDefault1([])
                     // .makeArray([])
                     .handle()
                , middleware.validation(dto.profile, false)
                , this.updateProfileCtrl)

    }

    private updateProfileCtrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const UserService: UserServiceClass = Container.get(UserServiceClass);
            let result = await UserService.updateProfileService(request.body.DtoClass, request.cookies.token);

            response.send(new Response.success(request, request.params, next).make({}, '01', 'Success Sign In'));
        } catch (e) {
            if (e.errorCode) {
                response.status(e.status).send(new Response.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }

            next(new HttpException(e.status, e.message, request.params));
        }

    };

}

export default UserController;

