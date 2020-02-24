import * as express from 'express';
import HttpException from '../../exceptions/HttpException';
import Controller from '../../interfaces/controller.interface';
import SuccessResponse from '../../utils/SuccessResponse';

import {celebrate, Joi} from 'celebrate';

import {Container, Inject} from 'typedi';
import LoginService from './login.service';
import {Logger} from "winston";
import ErrorResponse from "../../exceptions/ErrorResponse";
import FailResponse from "../../utils/FailResponse";

class LoginController implements Controller {
    public path = '/admin/auth';
    public router = express.Router();

    @Inject('logger')
    private logger: Logger;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .post(`${this.path}`, celebrate({
                                                body: Joi.object({
                                                                     loginId: Joi.string().required(),
                                                                     password: Joi.string().required(),
                                                                     sessionId: Joi.string().required(),
                                                                     osType: Joi.string().required(),
                                                                     osVersion: Joi.string().required(),
                                                                     appVersion: Joi.string().required(),
                                                                     deviceName: Joi.string().required(),
                                                                     pushKey: Joi.string().required(),
                                                                     forceLogin: Joi.number().default(0).allow(''),
                                                                 }),
                                            }), this.loginCtrl)
            .put(`${this.path}`, celebrate({
                                               body: Joi.object({
                                                                    sessionId: Joi.string().required()
                                                                })
                                           }), this.logoutCtrl);
    }

    private loginCtrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const {loginId, password, sessionId, osType, osVersion, deviceName, pushKey, forceLogin, appVersion} = request.body;

        try {
            const loginService = Container.get(LoginService);
            const insertData = await loginService.loginService(loginId, password, sessionId, osType, osVersion, appVersion, deviceName, pushKey, forceLogin);

            response.send(new SuccessResponse(request, request.params, next).make({}, 1));
        } catch (e) {
            console.log(e);
            if (e instanceof ErrorResponse) {
                response.status(e.status).send(new FailResponse(request, request.params, next).make({}, e.errorCode, e.message));
            }
            next(new HttpException(e.status, e.message, request.params));
        }

    };

    private logoutCtrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
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

    }

}

export default LoginController;

