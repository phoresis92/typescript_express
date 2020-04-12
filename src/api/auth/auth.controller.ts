import * as express from 'express';
import moment from 'moment';
import {Container, Inject} from 'typedi';

import middleware from '../../middleware';
import dto from './dto';
import Response from '../../utils/response';

import Controller from '../../interfaces/controller.interface';
import JwtValidClass from '../../middleware/jwtValid.middleware';

import HttpException from '../../exceptions/HttpException';

import AuthServiceClass from './auth.service';

class AuthController implements Controller {
    public path = '/auth';
    public router = express.Router();

    private JwtValid: JwtValidClass;

    constructor() {
        this.JwtValid = new middleware.JwtValid();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .post(`/auth/signin`
                , new middleware.defaultValue()
                      .setDefault0(['loginForce'])
                      .setDefault1([])
                      .handle()
                , middleware.validation(dto.signin, false)
                , this.signinCtrl)

            .post(`/auth/signup`
                , new middleware.defaultValue()
                      .setDefault0(['agreeUse', 'agreePersonalInfo', 'fileSeq'])
                      .setDefault1([])
                      .handle()
                , middleware.validation(dto.signup, false)
                , this.signupCtrl)

            .delete(`/auth/logout`
                , this.JwtValid.decodeToken()
                , this.logoutCtrl)

            .post(`/auth/valid`
                , this.JwtValid.decodeToken()
                , this.validToken)

            .put(`/auth/refresh`
                , this.JwtValid.decodeToken()
                , this.refreshToken);

    }

    private signinCtrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const AuthService: AuthServiceClass = Container.get(AuthServiceClass);
            let {accessToken, refreshToken, userData} = await AuthService.signinService(request.body.DtoClass);

            response.send(new Response.success(request, request.params, next).make({accessToken, refreshToken, userData}, '01', 'Success Sign In'));
        } catch (e) {
            if (e.errorCode) {
                response.status(e.status).send(new Response.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }

            next(new HttpException(e.status, e.message, request.params));
        }

    };

    private signupCtrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const AuthService: AuthServiceClass = Container.get(AuthServiceClass);
            let {uuid, user_id} = await AuthService.signupService(request.body.DtoClass);

            response.send(new Response.success(request, request.params, next).make({}, '01', 'Success Sign Up'));
        } catch (e) {
            if (e.errorCode) {
                response.status(e.status).send(new Response.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }

            next(new HttpException(e.status, e.message, request.params));
        }

    };

    private logoutCtrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const AuthService: AuthServiceClass = Container.get(AuthServiceClass);
            let result = await AuthService.logoutService(request.cookies.token);

            response.send(new Response.success(request, request.params, next).make({}, '01', 'Success Logout'));
        } catch (e) {
            if (e.errorCode) {
                response.status(e.status).send(new Response.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }

            next(new HttpException(e.status, e.message, request.params));
        }

    };

    private validToken = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            request.cookies.token.iat_format = moment.unix(request.cookies.token.iat).format('YYYY-MM-DD HH:mm:ss');
            request.cookies.token.exp_format = moment.unix(request.cookies.token.exp).format('YYYY-MM-DD HH:mm:ss');

            delete request.cookies.token.userId;
            delete request.cookies.token.refreshToken;
            response.send(new Response.success(request, request.params, next).make({token: request.cookies.token}, '01'));
        } catch (e) {
            if (e.errorCode) {
                response.status(e.status).send(new Response.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }

            next(new HttpException(e.status, e.message, request.params));
        }

    };

    private refreshToken = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const AuthService: AuthServiceClass = Container.get(AuthServiceClass);
            let accessToken = await AuthService.refreshTokenService(request.cookies.token, request);

            response.send(new Response.success(request, request.params, next).make({accessToken}, '01'));
        } catch (e) {
            if (e.errorCode) {
                response.status(e.status).send(new Response.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }

            next(new HttpException(e.status, e.message, request.params));
        }

    };

}

export default AuthController;

