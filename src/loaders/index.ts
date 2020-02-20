import dependencyInjectorLoader from './dependencyInjector';
// import mongooseLoader from './mongoose';
// import jobsLoader from './jobs';
import logger from './logger';
import validateEnv from './validateEnv';

import {createConnection} from 'typeorm';
import {Container} from 'typedi';
import ormConfig from './ormconfig';

export default async () => {

  /**
   * ValidateEnv
   */
  validateEnv();

  /**
   * When you use MongoDB
   */
  // const mongoConnection = await mongooseLoader();

  /**
   * When you use RDB
   * Check your ormConfig
   */
  let connection;
  try {
    connection = await createConnection(ormConfig);
    await connection.runMigrations();
  } catch (e) {
    logger.error('🔥 Error with Connection RDB: %o', e);
    process.exit(1);
  }
  Container.set('ormConnect', connection);
  logger.info('✌️ DB loaded and connected!');


  /**
   * WTF is going on here?
   *
   * We are injecting the mongoose models into the DI container.
   * I know this is controversial but will provide a lot of flexibility at the time
   * of writing unit tests, just go and check how beautiful they are!
   */

  // const userModel = {
  //   name: 'userModel',
  //   // Notice the require syntax and the '.default'
  //   model: require('../models/user').default,
  // };

  // It returns the agenda instance because it's needed in the subsequent loaders
  /*const { agenda } = */
  await dependencyInjectorLoader({
                                   // mongoConnection,
  models: [
                                     // userModel,
                                     // salaryModel,
                                     // whateverModel
    ],
  });
  logger.info('✌️ Dependency Injector loaded');

  // await jobsLoader({ agenda });
  logger.info('✌️ Jobs loaded');

};
