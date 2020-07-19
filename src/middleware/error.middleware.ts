import {NextFunction, Request, Response} from 'express';
import {Container, Service} from 'typedi';
// import LogErr from '../entity/log/log_error.entity';
import HttpException from '../exceptions/HttpException';
import {LogErrQuery} from '../query';
import * as Mysql from '../loaders/MysqlTemplate';
import ConfigClass from '../config/config.dto';
import {Logger} from "winston";

// import {getRepository} from 'typeorm';

// @Service()
const errorMiddleware = async (error: HttpException, request: Request, response: Response, next: NextFunction) => {
    // const logErrRepository = getRepository(LogErr);
    const logger: Logger = Container.get('logger');
    const logErrQuery = new LogErrQuery();

    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    const params = error.params || {};

    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

    try {
        const recordSet = await Mysql.exec(logErrQuery.create(),
            [
                status,
                ConfigClass.server,
                ip,
                request.method,
                request.path,
                JSON.stringify(request.headers),
                JSON.stringify(params),
                JSON.stringify(request.query),
                JSON.stringify(request.body),
                JSON.stringify(message)
            ]
        );
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

    console.log(error);
    logger.error(`🔥[${error.status}|${request.method}|${request.path}]${JSON.stringify(error.message)}`);

    if (!response.finished) {
        response
            .status(status)
            .send({
                result: false,
                message,
                status,
            });

    }
};

export default errorMiddleware;
