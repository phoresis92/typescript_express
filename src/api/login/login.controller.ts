import * as express from 'express';
import HttpException from '../../exceptions/HttpException';
import Controller from '../../interfaces/controller.interface';
import defaultValueMiddleware from '../../middleware/defaultValue.middleware';
import validationMiddleware from '../../middleware/validation.middleware';
import SuccessResponse from '../../utils/response/SuccessResponse';
import { Authorized, JsonController, OnUndefined, Post } from 'routing-controllers';

import {celebrate, Joi} from 'celebrate';

import {Container, Inject} from 'typedi';
import LoginDto from './login.dto';
import LoginServiceClass, { LoginResponseClass } from './login.service';
import ErrorResponse from "../../exceptions/ErrorResponse";
import FailResponse from "../../utils/response/FailResponse";

@JsonController()
class LoginController implements Controller {
    public path = '/auth';
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router

            .post(`/auth/login`
                , new defaultValueMiddleware()
                      .setDefault0(['loginForce'])
                      .setDefault1([])
                      .handle()
                , validationMiddleware(LoginDto, false)
                , this.loginCtrl)

    }

    @Authorized()
    private loginCtrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const LoginService: LoginServiceClass = Container.get(LoginServiceClass);
            let responseObj: LoginResponseClass = await LoginService.loginService(request.body.DtoClass);

            response.send(new SuccessResponse(request, request.params, next).make({}, '01'));
        } catch (e) {
            if (e instanceof ErrorResponse) {
                response.status(e.status).send(new FailResponse(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }
            next(new HttpException(e.status, e.message, request.params));
        }

    };

    /*private logoutCtrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const {sessionId} = request.body;

        try {
            const loginService = Container.get(LoginService);
            const deleteResult = await loginService.logoutService(sessionId);

            response.send(new SuccessResponse(request, request.params, next).make({}, 1));
        } catch (e) {
            if (e instanceof ErrorResponse) {
                response.status(e.status).send(new FailResponse(request, request.params, next).make({}, e.errorCode, e.message));
            }
            next(new HttpException(e.status, e.message, request.params));
        }

    }*/

}

export default LoginController;

