import {Request, Response, NextFunction} from 'express';
import {Container} from 'typedi';
import LogErr from '../entity/log/log_error.entity';
import HttpException from '../exceptions/HttpException';
import { SuccessResponse } from '../utils';

import {getRepository} from 'typeorm';

const dbLogMiddleware = async (nextData: SuccessResponse|HttpException, request: Request, response: Response, next: NextFunction) => {
    if (nextData instanceof HttpException) {
        next(nextData);
        return;
    }
    
    const logErrRepository = getRepository(LogErr);

    const logger = Container.get('logger');
    const config = Container.get('config');

    try {
        const newLog = logErrRepository.create
        ({
             status_code: response.statusCode,
             server: 1,
             id: 1,
             method: request.method,
             path: request.path,
             header: JSON.stringify(request.headers),
             params: JSON.stringify(nextData.params),
             query: JSON.stringify(request.query),
             payload: JSON.stringify(request.body),
             response: JSON.stringify(nextData.resultData),
             reg_date: new Date(),
         });
        await logErrRepository.save(newLog);
        logger.info(`[${response.statusCode}]${JSON.stringify(nextData.resultData)}`);

    } catch (e) {
        logger.error(e);
    }

};

export default dbLogMiddleware;
