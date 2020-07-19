import { Container } from 'typedi';
import {Logger} from 'winston';
import ConfigClass from '../config/config.dto';
import MysqlTemplate from '../utils/database/MysqlTemplate';

import FileHandler from '../utils/file/fileHandler.class';

import LoggerClass from '../utils/logger';
import { Utils } from '../utils';

// import config from '../config/index.ts';

export default (/*{ /!*mongoConnection*!/ models }: { /!*mongoConnection;*!/ models: { name: string; model: any }[] }*/) => {

  const logger: Logger = LoggerClass.getInstance();

  try {


    /*models.forEach(m => {
      Container.set(m.name, m.model);
    });*/

    Container.set('utils', new Utils());
    Container.set('logger', logger);
    Container.set('mysql', MysqlTemplate.getInstance());
    Container.set('FileHandler', new FileHandler());

  } catch (err) {
      logger.error(`🔥 Error on dependency injector loader:\n\t${err.message}`);
      throw err;
  }
};
