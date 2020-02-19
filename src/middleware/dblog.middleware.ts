import { Request, Response, NextFunction } from 'express';
import {Container} from 'typedi';
import LogErr from '../entity/log_error.entity';
import HttpException from '../exceptions/HttpException';

import { getRepository } from 'typeorm';

const dbLogMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    const logErrRepository = getRepository(LogErr);

    const logger = Container.get('logger');
    const config = Container.get('config');

    console.log(response)


    response.on('finish', () => {
        console.log('what?')
        console.log('what?')
        console.log('what?')
        console.log('what?')
        console.log('what?')
        console.log('what?')
        console.log('what?')
        console.log('what?')
    })

    next()

    try {
        const newLog = logErrRepository.create({
                                                   status_code: response.statusCode,
                                                   server: 1,
                                                   id: 1,
                                                   method: request.method,
                                                   path: request.path,
                                                   header: JSON.stringify(request.headers),
                                                   params: JSON.stringify(request.params),
                                                   query: JSON.stringify(request.query),
                                                   payload: JSON.stringify(request.body),
                                                   response: JSON.stringify(response.body),
                                                   reg_date: new Date(),
                                               });
        await logErrRepository.save(newLog);
    } catch (e) {
        logger.error(e);

    }

    logger.info(`[${error.status}]${JSON.stringify(error.stack)}`);
}

export default dbLogMiddleware;
