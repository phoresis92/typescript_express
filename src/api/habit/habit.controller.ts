import * as express from 'express';
import moment from 'moment';
import {Container, Inject} from 'typedi';
import ConfigClass from '../../config/config.dto';

import middleware from '../../middleware';
import ErrorResponse from '../../utils/response/ErrorResponse';
import dto from './dto';
import Response from '../../utils/response';

import Controller from '../../interfaces/controller.interface';
import JwtValidClass from '../../middleware/jwtValid.middleware';

import HttpException from '../../exceptions/HttpException';

import HabitServiceClass from './habit.service';

class HabitController implements Controller {
    public path = '/habit';
    public router = express.Router();

    // private Config: ConfigClass = Container.get('Config');

    private JwtValid: JwtValidClass;

    constructor() {
        this.JwtValid = new middleware.JwtValid();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .post(`/habit`
                , this.JwtValid.decodeToken()
                , new middleware.defaultValue()
                      .setDate(['startDate', 'endDate'])
                      .setNumber(['habitCategory', 'maxJoinCnt'])
                      .setDefault0(['profileFileSeq', 'sampleFileSeq', 'habitSeq'])
                      // .setDefault1([])
                      .makeArray(['certType', 'pictureType'])
                      .handle()
                , middleware.validation(dto.makeHabit, false)
                , this.makeRoomCtrl);

        this.router
            .post(`/habit/list`
                , this.JwtValid.decodeToken()
                , new middleware.defaultValue()
                      // .setDate(['startDate', 'endDate'])
                      // .setNumber([])
                      .setDefault0(['habitCategory'])
                      .setDefault1(['page'])
                      // .makeArray(['certType', 'pictureType'])
                      .handle()
                , middleware.validation(dto.habitList, false)
                , this.roomListCtrl);

        this.router
            .get(`/habit/category`
                , this.JwtValid.decodeToken()
                , this.getCategoryCtrl);

        this.router
            .get(`/habit/:seq`
                , this.JwtValid.decodeToken()
                , this.roomDetailCtrl);

        this.router
            .put(`/habit`
                , this.JwtValid.decodeToken()
                , new middleware.defaultValue()
                     .setDate(['startDate', 'endDate'])
                     .setNumber(['habitCategory', 'maxJoinCnt', 'habitSeq'])
                     .setDefault0(['profileFileSeq', 'sampleFileSeq'])
                     // .setDefault1([])
                     .makeArray(['certType', 'pictureType'])
                     .handle()
                , middleware.validation(dto.makeHabit, false)
                , this.updateRoomCtrl);

        this.router
            .delete(`/habit/:seq`
                , this.JwtValid.decodeToken()
                , this.deleteRoomCtrl);

    }

    private makeRoomCtrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const HabitService: HabitServiceClass = Container.get(HabitServiceClass);
            let result = await HabitService.makeRoomService(request.body.DtoClass, request.cookies.token);

            response.send(new Response.success(request, request.params, next).make({}, '01', 'Success Sign In'));
        } catch (e) {
            if (e.errorCode) {
                response.status(e.status).send(new Response.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }

            next(new HttpException(e.status, e.message, request.params));
        }

    };

    private roomListCtrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const HabitService: HabitServiceClass = Container.get(HabitServiceClass);
            let [habitList, count] = await HabitService.roomListService(request.cookies.token, request.body.DtoClass);

            response.send(new Response.success(request, request.params, next).make({
                habitList,
                count,
                page: request.body.DtoClass.page,
                itemPerPageCnt: ConfigClass.itemPerPageCnt,
                pageCount: ConfigClass.pageCount
            }, '01'));
        } catch (e) {
            if (e.errorCode) {
                response.status(e.status).send(new Response.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }

            next(new HttpException(e.status, e.message, request.params));
        }

    };

    private roomDetailCtrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const habitSeq = parseInt(request.params.seq);
            if (isNaN(habitSeq)) {
                throw new ErrorResponse(400, '@isNaN habitSeq', '400');
            }

            const HabitService: HabitServiceClass = Container.get(HabitServiceClass);
            let [roomData, getJoin] = await HabitService.roomDetailService(habitSeq, request.cookies.token);

            response.send(new Response.success(request, request.params, next).make({roomData, getJoin}, '01'));
        } catch (e) {
            if (e.errorCode) {
                response.status(e.status).send(new Response.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }

            next(new HttpException(e.status, e.message, request.params));
        }

    };

    private updateRoomCtrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const HabitService: HabitServiceClass = Container.get(HabitServiceClass);
            let result = await HabitService.updateRoomService(request.body.DtoClass, request.cookies.token);

            response.send(new Response.success(request, request.params, next).make({}, '01'));
        } catch (e) {
            if (e.errorCode) {
                response.status(e.status).send(new Response.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }

            next(new HttpException(e.status, e.message, request.params));
        }

    };

    private deleteRoomCtrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const habitSeq: number = parseInt(request.params.seq);
            if (isNaN(habitSeq)) {
                throw new ErrorResponse(400, '@isNaN habitSeq', '400');
            }

            const HabitService: HabitServiceClass = Container.get(HabitServiceClass);
            let result = await HabitService.deleteRoomService(habitSeq, request.cookies.token);

            response.send(new Response.success(request, request.params, next).make({}, '01'));
        } catch (e) {
            if (e.errorCode) {
                response.status(e.status).send(new Response.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }

            next(new HttpException(e.status, e.message, request.params));
        }

    };

    // ========================================================================================================================

    private getCategoryCtrl = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const HabitService: HabitServiceClass = Container.get(HabitServiceClass);
            let categoryList = await HabitService.getCategoryService();

            response.send(new Response.success(request, request.params, next).make({categoryList}, '01'));
        } catch (e) {
            if (e.errorCode) {
                response.status(e.status).send(new Response.fail(request, request.params, next).make({}, e.errorCode, e.message));
                return;
            }

            next(new HttpException(e.status, e.message, request.params));
        }

    };

}

export default HabitController;

