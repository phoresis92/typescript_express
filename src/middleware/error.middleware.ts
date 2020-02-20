import {NextFunction, Request, Response} from 'express';
import {Container} from 'typedi';
// import LogErr from '../entity/log/log_error.entity';
import HttpException from '../exceptions/HttpException';
import {LogErrQuery} from '../query';
import Mysql from 'mysql';
import Config from '../config';
import {Logger} from "winston";

// import {getRepository} from 'typeorm';

const errorMiddleware = async (error: HttpException, request: Request, response: Response, next: NextFunction) => {
    // const logErrRepository = getRepository(LogErr);

    const logger: Logger = Container.get('logger');
    const mysql: Mysql = Container.get('mysql');
    const logErrQuery = new LogErrQuery();

    const status = error.status || 400;
    const message = error.message || 'Something went wrong';
    const params = error.params || {};

    try {
        const recordSet = await mysql.exec(logErrQuery.create(),
            [
                status,
                Config.server,
                1,
                request.method,
                request.path,
                JSON.stringify(request.headers),
                JSON.stringify(params),
                JSON.stringify(request.query),
                JSON.stringify(request.body),
                JSON.stringify(message)
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
    } catch (e) {
        logger.error(e);

    }

    logger.error(`[${error.status}|${request.method}|${request.path}]${JSON.stringify(error.stack)}`);

    response
        .status(status)
        .send({
            message,
            status,
        });
};

export default errorMiddleware;
