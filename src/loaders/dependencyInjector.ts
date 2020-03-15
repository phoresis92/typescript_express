import { Container } from 'typedi';
import FileHandler from '../utils/fileHandler.class';
import LoggerInstance from './logger';
import { SuccessResponse, Utils } from '../utils';
import mysql from './MysqlTemplate';
// import config from '../config/index.ts';

export default ({ /*mongoConnection*/ models }: { /*mongoConnection;*/ models: { name: string; model: any }[] }) => {
  try {
    models.forEach(m => {
      Container.set(m.name, m.model);
    });

    Container.set('logger', LoggerInstance);
    Container.set('utils', new Utils());
    Container.set('success', SuccessResponse);
    Container.set('mysql', mysql);
    Container.set('FileHandler', new FileHandler());

    return LoggerInstance

  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
