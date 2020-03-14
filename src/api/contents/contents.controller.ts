import * as express from 'express';
import ErrorResponse from '../../exceptions/ErrorResponse';
import HttpException from '../../exceptions/HttpException';
import Controller from '../../interfaces/controller.interface';
import FailResponse from '../../utils/FailResponse';

import SuccessResponse from '../../utils/SuccessResponse';

import {celebrate, Joi} from 'celebrate';

import {Container, Inject} from 'typedi';
import ContentsService from './contents.service';
import {Logger} from "winston";

import PushSender from '../../utils/PushSender';


class ContentsController implements Controller {
    public path = '/contents';
    public router = express.Router();

    @Inject('logger')
    private logger: Logger;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .get(`${this.path}/notice`, this.getNotice)
            .post(`${this.path}/mine`, celebrate({
                    body: Joi.object({
                        serialNumber: Joi.string().required(),
                        page: Joi.number().integer().required(),
                        keyword: Joi.string().allow(''),
                    }),
                }), this.getContentsBySerial)
            .post(`${this.path}`, celebrate({
                    body: Joi.object({
                        serialNumber: Joi.string().required(),
                        phoneNumber: Joi.string().required(),
                        fileSeqs: Joi.string().required(),
                    })
                }), this.createContents)
            .delete(`${this.path}`, celebrate({
                    body: Joi.object({
                        serialNumber: Joi.string().required(),
                        contentsSeqs: Joi.string().required()
                    }),
                }), this.deleteContents)
    }

    private createContents = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const serialNumber = request.body.serialNumber;
        const phoneNumber = request.body.phoneNumber;
        const fileSeqs = request.body.fileSeqs;

        try {
            const contentsService = Container.get(ContentsService);
            const {recordSet, updateResult} = await contentsService.create(serialNumber, phoneNumber, fileSeqs, next);
            let insertId = recordSet.insertId;

            response.send(new SuccessResponse(request, request.params, next).make({insertId}, 1));

            new PushSender()
                .setPosition('CONTENTS')
                .setSender(serialNumber)
                .setTargetType('CONTENTS')
                .setTargetKey(insertId)
                .setOpt1(phoneNumber)
                .setOpt2(fileSeqs.split(',').length)
                .pushAdmin();
                // .setOpt3()
                // .setOpt4()
                // .setOpt5()


        } catch (e) {
            if (e instanceof ErrorResponse) {
                response.status(e.status).send(new FailResponse(request, request.params, next).make({}, e.errorCode, e.message));
            }
            next(new HttpException(e.status, e.message, request.params));
        }

    };

    private getContentsBySerial = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const serialNumber = request.body.serialNumber;
        const keyword = request.body.keyword;
        const page = request.body.page;

        try {
            const contentsService = Container.get(ContentsService);
            const {contents, imgFile} = await contentsService.getBySerial(serialNumber, keyword, page);

            response.send(new SuccessResponse(request, request.params, next).make({contents, imgFile}, 1));
        } catch (e) {
            if (e instanceof ErrorResponse) {
                response.status(e.status).send(new FailResponse(request, request.params, next).make({}, e.errorCode, e.message));
            }
            next(new HttpException(e.status, e.message, request.params));
        }

    };

    private getNotice = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const contentsService = Container.get(ContentsService);
            const {notice, imgFile} = await contentsService.getNotice();

            response.send(new SuccessResponse(request, request.params, next).make({notice, imgFile}, 1));
        } catch (e) {
            if (e instanceof ErrorResponse) {
                response.status(e.status).send(new FailResponse(request, request.params, next).make({}, e.errorCode, e.message));
            }
            next(new HttpException(e.status, e.message, request.params));
        }

    };

    private deleteContents = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const serialNumber = request.body.serialNumber;
        const contentsSeqs = request.body.contentsSeqs;
        try {
            const contentsService = Container.get(ContentsService);
            const {recordSet, updateResult} = await contentsService.delete(serialNumber, contentsSeqs, next);

            response.send(new SuccessResponse(request, request.params, next).make({recordSet, updateResult}, 1));
        } catch (e) {
            if (e instanceof ErrorResponse) {
                response.status(e.status).send(new FailResponse(request, request.params, next).make({}, e.errorCode, e.message));
            }
            next(new HttpException(e.status, e.message, request.params));
        }

    };

}

export default ContentsController;

