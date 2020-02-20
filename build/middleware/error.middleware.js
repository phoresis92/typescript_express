"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const query_1 = require("../query");
const config_1 = __importDefault(require("../config"));
// import {getRepository} from 'typeorm';
const errorMiddleware = async (error, request, response, next) => {
    // const logErrRepository = getRepository(LogErr);
    const logger = typedi_1.Container.get('logger');
    const mysql = typedi_1.Container.get('mysql');
    const logErrQuery = new query_1.LogErrQuery();
    try {
        const recordSet = await mysql.exec(logErrQuery.create(), [
            error.status,
            config_1.default.server,
            1,
            request.method,
            request.path,
            JSON.stringify(request.headers),
            JSON.stringify(error.params),
            JSON.stringify(request.query),
            JSON.stringify(request.body),
            JSON.stringify(error.stack)
        ]);
        //     const newLog = logErrRepository.create({
        //                                                status_code: error.status,
        //                                                server: 1,
        //                                                id: 1,
        //                                                method: request.method,
        //                                                path: request.path,
        //                                                header: JSON.stringify(request.headers),
        //                                                params: JSON.stringify(request.params),
        //                                                query: JSON.stringify(request.query),
        //                                                payload: JSON.stringify(request.body),
        //                                                response: JSON.stringify(error.stack),
        //                                                reg_date: new Date(),
        //                                            });
        //     await logErrRepository.save(newLog);
    }
    catch (e) {
        logger.error(e);
    }
    logger.error(`[${error.status}|${request.method}|${request.path}]${JSON.stringify(error.stack)}`);
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    response
        .status(status)
        .send({
        message,
        status,
    });
};
exports.default = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map