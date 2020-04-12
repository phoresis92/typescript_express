import * as express from 'express';
import moment from 'moment';
import {Container, Inject} from 'typedi';
import ConfigClass from '../../config/config.dto';

import middleware from '../../middleware';
import defaultValueMiddleware from '../../middleware/defaultValue.middleware';
import ErrorResponse from '../../utils/response/ErrorResponse';
import dto from './dto';
import Response from '../../utils/response';

import Controller from '../../interfaces/controller.interface';
import JwtValidClass from '../../middleware/jwtValid.middleware';

import HttpException from '../../exceptions/HttpException';

import HabitJoinServiceClass from './habitJoin.service';

class HabitJoinController implements Controller {
    public path = '/habit';
    public router = express.Router();

    private Config: ConfigClass = Container.get('Config');

    private JwtValid: JwtValidClass;

    constructor() {
        this.JwtValid = new middleware.JwtValid();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .post(`/habit/:seq/join`
                , this.JwtValid.decodeToken()
                , this.habitJoinCtrl);

        this.router
            .put(`/habit/:seq/join`
                , this.JwtValid.decodeToken()
                , this.habitJoinCancelCtrl);

        this.router
            .delete(`/habit/:seq/join`
                , this.JwtValid.decodeToken()
                , this.withdrawHabitCtrl);

        // ===================================================

        this.router
            .get(`/habit/:seq/member`
                 , new defaultValueMiddleware()
                     .setDefault1(['listType', 'page'])
                     .handle()
                , this.JwtValid.decodeToken()
                , this.memberListCtrl);

        this.router
            .put(`/habit/member`
                , this.JwtValid.decodeToken()
                , new defaultValueMiddleware()
                     .setNumber(['habitSeq'])
                     .handle()
                , middleware.validation(dto.memberStatus, false)
                , this.memberStatusCtrl);

        // this.router
        //     .post(`/habit/list`
        //         , this.JwtValid.decodeToken()
        //         , new middleware.defaultValue()
        //               // .setDate(['startDate', 'endDate'])
        //               // .setNumber([])
        //               .setDefault0(['habitCategory'])
        //               .setDefault1(['page'])
        //               // .makeArray(['certType', 'pictureType'])
        //               .handle()
        //         , middleware.validation(dto.habitList, false)
        //         , this.roomListCtrl);

    }

    private habitJoinCtrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const habitSeq = parseInt(request.params.seq);
            if (isNaN(habitSeq)) {
                throw new ErrorResponse(400, '@isNaN habitSeq', '400');
            }

            const HabitJoinService: HabitJoinServiceClass = Container.get(HabitJoinServiceClass);
            let result = await HabitJoinService.habitJoinService(habitSeq, request.cookies.token);

            response.send(new Response.success(request, request.params, next).make({}, '01', 'Request Join Success'));
        } catch (e) {
            if (e.errorCode) {
                response.status(e.status).send(new Response.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }

            next(new HttpException(e.status, e.message, request.params));
        }

    };

    private habitJoinCancelCtrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const habitSeq = parseInt(request.params.seq);
            if (isNaN(habitSeq)) {
                throw new ErrorResponse(400, '@isNaN habitSeq', '400');
            }

            const HabitJoinService: HabitJoinServiceClass = Container.get(HabitJoinServiceClass);
            let result = await HabitJoinService.habitJoinCancelService(habitSeq, request.cookies.token);

            response.send(new Response.success(request, request.params, next).make({}, '01', 'Cancel Join Success'));
        } catch (e) {
            if (e.errorCode) {
                response.status(e.status).send(new Response.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }

            next(new HttpException(e.status, e.message, request.params));
        }

    };

    private withdrawHabitCtrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const habitSeq = parseInt(request.params.seq);
            if (isNaN(habitSeq)) {
                throw new ErrorResponse(400, '@isNaN habitSeq', '400');
            }

            const HabitJoinService: HabitJoinServiceClass = Container.get(HabitJoinServiceClass);
            let result = await HabitJoinService.withdrawHabitService(habitSeq, request.cookies.token);

            response.send(new Response.success(request, request.params, next).make({}, '01', 'Withdraw Join Success'));
        } catch (e) {
            if (e.errorCode) {
                response.status(e.status).send(new Response.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }

            next(new HttpException(e.status, e.message, request.params));
        }

    };

    // ========================================================================================================================

    private memberListCtrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const habitSeq = parseInt(request.params.seq);
            if (isNaN(habitSeq)) {
                throw new ErrorResponse(400, '@isNaN habitSeq', '400');
            }

            const page = parseInt(request.query.page);
            if (isNaN(page)) {
                throw new ErrorResponse(400, '@isNaN page', '400');
            }

            const HabitJoinService: HabitJoinServiceClass = Container.get(HabitJoinServiceClass);
            let [memberList, count] = await HabitJoinService.memberListService(habitSeq, request.cookies.token, page, request.query.listType);

            response.send(new Response.success(request, request.params, next)
                              .make({memberList, count, page, itemPerPageCnt: this.Config.itemPerPageCnt, pageCount:this.Config.pageCount}, '01')
            );

        } catch (e) {
            if (e.errorCode) {
                response.status(e.status).send(new Response.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }

            next(new HttpException(e.status, e.message, request.params));
        }

    };

    private memberStatusCtrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const HabitJoinService: HabitJoinServiceClass = Container.get(HabitJoinServiceClass);
            let result = await HabitJoinService.memberStatusService(request.body.DtoClass, request.cookies.token);

            response.send(new Response.success(request, request.params, next).make({}, '01'));

        } catch (e) {
            if (e.errorCode) {
                response.status(e.status).send(new Response.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }

            next(new HttpException(e.status, e.message, request.params));
        }

    };

}

export default HabitJoinController;

