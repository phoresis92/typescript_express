import { Container } from 'typedi';
import FileHandler from '../utils/file/fileHandler.class';

import LoggerInstance from './logger';
import ConfigClass from '../config/config.dto';
import { Utils } from '../utils';
import mysql from './MysqlTemplate';

// import config from '../config/index.ts';

export default ({ /*mongoConnection*/ models }: { /*mongoConnection;*/ models: { name: string; model: any }[] }) => {
  try {
    models.forEach(m => {
      Container.set(m.name, m.model);
    });

    const Config: ConfigClass = Container.get('Config');

    Container.set('logger', LoggerInstance);
    Container.set('utils', new Utils());
    Container.set('mysql', mysql);

    Container.set('FileHandler', new FileHandler());

    return LoggerInstance

  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
