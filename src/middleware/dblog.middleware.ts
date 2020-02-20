import {Request, Response, NextFunction} from 'express';
import {Container} from 'typedi';
import LogErr from '../entity/log/log_error.entity';
// import LogErr from '../entity/log/log_error.entity';
// import HttpException from '../exceptions/HttpException';
import {SuccessResponse} from '../utils';
import {LogErrQuery} from '../query';

import {getRepository} from 'typeorm';

const dbLogMiddleware = async (nextData: SuccessResponse | Error, request: Request, response: Response, next: NextFunction) => {
    if (nextData instanceof Error) {
        next(nextData);
        return;
    }

    // const logErrRepository = getRepository(LogErr);

    const logger = Container.get('logger');
    const config = Container.get('config');
    const mysql = Container.get('mysql');
    const logErrQuery = new LogErrQuery();

    try {
        const recordSet = await mysql.exec(logErrQuery.create(),
                   [
                       response.statusCode,
                       config.server,
                       1,
                       request.method,
                       request.path,
                       JSON.stringify(request.headers),
                       JSON.stringify(nextData.params),
                       JSON.stringify(request.query),
                       JSON.stringify(request.body),
                       JSON.stringify(nextData.resultData)
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
        logger.info(`[${response.statusCode}]${JSON.stringify(nextData.resultData)}`);

    } catch (e) {
        logger.error(e);
    }

};

export default dbLogMiddleware;
