import dependencyInjectorLoader from './dependencyInjector';
import logger from './logger';
import validateEnv from './validateEnv';

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
  // try {
  //   const connection = await createConnection(ormConfig);
  //   await connection.runMigrations();
  // } catch (e) {
  //   console.log(e)
  //   logger.error('🔥 Error with Connection RDB: %o', e);
  //   process.exit(1);
  // }
  // logger.info('✌️ DB loaded and connected!');


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
