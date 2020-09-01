import 'reflect-metadata';
import {Container} from 'typedi';
import {Logger} from 'winston';
import {SERVERTYPE} from './config/constant.dto';

Container.set('server', SERVERTYPE.DFS);

import App from './app';

import FileController from './api/file/file.controller';

import loaders from './loaders';
import LoggerClass from './utils/logger';

(async () => {

  const logger: Logger = LoggerClass.getInstance();

  try {

    await loaders();

    const app = new App(
      [
        new FileController()
      ],
    );

    app.listen();

  }catch (err) {
    logger.error(`🔥 Error on ${Container.get('server')}:\n\t${err.message}`);
    process.exit(1);
  }

})();
