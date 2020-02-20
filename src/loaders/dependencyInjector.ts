import { Container } from 'typedi';
import LoggerInstance from './logger';
import { SuccessResponse, Utils } from '../utils';
import mysql from './MysqlTemplate';

export default ({ /*mongoConnection*/ models }: { /*mongoConnection;*/ models: { name: string; model: any }[] }) => {
  try {
    models.forEach(m => {
      Container.set(m.name, m.model);
    });

    Container.set('logger', LoggerInstance);
    Container.set('utils', new Utils());
    Container.set('success', SuccessResponse);
    Container.set('mysql', mysql);

  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
