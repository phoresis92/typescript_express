import {Request, Response, NextFunction} from 'express';
import {Container} from 'typedi';
// import LogErr from '../entity/log/log_error.entity';
// import LogErr from '../entity/log/log_error.entity';
// import HttpException from '../exceptions/HttpException';
import ConfigClass from '../config/config.dto';
import {LogErrQuery} from '../query';
import ResponseInterface from '../interfaces/response.interface';

import {getRepository} from 'typeorm';
import {Logger} from "winston";
import Mysql from '../loaders/MysqlTemplate';


const dbLogMiddleware = async (nextData: ResponseInterface | Error, request: Request, response: Response, next: NextFunction) => {
    if (nextData instanceof Error) {
        next(nextData);
        return;
    }

    const logger: Logger = Container.get('logger');
    const Config: ConfigClass = Container.get('Config');

    // const mysql: Mysql = Container.get('mysql');
    const logErrQuery = new LogErrQuery();

    try {
        const recordSet = await Mysql.exec(logErrQuery.create(),
                   [
                       response.statusCode,
                       Config.server,
                       1,
                       request.method,
                       request.path,
                       JSON.stringify(request.headers),
                       JSON.stringify(nextData.params),
                       JSON.stringify(request.query),
                       JSON.stringify(request.body),
                       JSON.stringify(request.body.toClientResponseObj)
                   ]);
        // const newLog = logErrRepository.create
        // ({
        //      status_code: response.statusCode,
        //      server: 1,
        //      id: 1,
        //      method: request.method,
        //      path: request.path,
        //      header: JSON.stringify(request.headers),
        //      params: JSON.stringify(nextData.params),
        //      query: JSON.stringify(request.query),
        //      payload: JSON.stringify(request.body),
        //      response: JSON.stringify(nextData.resultData),
        //      reg_date: new Date(),
        //  });
        // await logErrRepository.save(newLog);
        logger.info(`[${response.statusCode}|${request.method}|${request.path}]${JSON.stringify(nextData.resultData)}`);

    } catch (e) {
        logger.error(e);
    }

};

export default dbLogMiddleware;
