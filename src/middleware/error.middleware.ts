import {NextFunction, Request, Response} from 'express';
import {Container} from 'typedi';
import LogErr from '../entity/log/log_error.entity';
import HttpException from '../exceptions/HttpException';

import {getRepository} from 'typeorm';

const errorMiddleware = async (error: HttpException, request: Request, response: Response, next: NextFunction) => {
    const logErrRepository = getRepository(LogErr);

    const logger = Container.get('logger');
    const config = Container.get('config');

    try {
        const newLog = logErrRepository.create({
                                                   status_code: error.status,
                                                   server: 1,
                                                   id: 1,
                                                   method: request.method,
                                                   path: request.path,
                                                   header: JSON.stringify(request.headers),
                                                   params: JSON.stringify(request.params),
                                                   query: JSON.stringify(request.query),
                                                   payload: JSON.stringify(request.body),
                                                   response: JSON.stringify(error.stack),
                                                   reg_date: new Date(),
                                               });
        await logErrRepository.save(newLog);
    } catch (e) {
        logger.error(e);

    }

    logger.error(`[${error.status}]${JSON.stringify(error.stack)}`);

    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    response
        .status(status)
        .send({
                  message,
                  status,
              });
};

export default errorMiddleware;
