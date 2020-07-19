import ConfigClass from '../config/config.dto';

import {Logger} from 'winston';
import LoggerClass from '../utils/logger';

import dependencyInjectorLoader from './dependencyInjector';
import validateEnv from './validateEnv';
import MysqlTemplate from '../utils/database/MysqlTemplate';

import redis from 'redis';
import {Container} from 'typedi';


export default async () => {

    let logger: Logger = LoggerClass.getInstance();

    try {

        /**
         * WTF is going on here?
         *
         * We are injecting the mongoose models into the DI container.
         * I know this is controversial but will provide a lot of flexibility at the time
         * of writing unit tests, just go and check how beautiful they are!
         */
        await dependencyInjectorLoader(/*{
                                           // mongoConnection,
                                           models: [
                                               // userModel,
                                               // salaryModel,
                                               // whateverModel
                                           ],
                                       }*/)

        logger.info('✌️ Dependency Injector loaded');


        /**
         * ValidateEnv
         */
        await validateEnv();
        logger.info('✌️ Validate Env loaded');

        /**
         * When you use MongoDB
         */
        // const mongoConnection = await mongooseLoader();

        /**
         * When you use RDB
         */
        const mysqlTemp: MysqlTemplate = Container.get('mysql');
        const serverInfoRecord = await mysqlTemp.query(`SELECT * FROM t_nf_server_info WHERE server_type = ?`, [ConfigClass.server]);
        const serverInfo = serverInfoRecord[0];

        if(!serverInfo){
            throw new Error('Not exist server info');
        }

        ConfigClass.port = serverInfo.port;
        ConfigClass.serverId = serverInfo.server_id;

        Object.freeze(ConfigClass);

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

        // const userModel = {
        //   name: 'userModel',
        //   // Notice the require syntax and the '.default'
        //   model: require('../models/user').default,
        // };

        // It returns the agenda instance because it's needed in the subsequent loaders
        /*const { agenda } = */



        // await jobsLoader({ agenda });
        // console.log('✌️ Jobs loaded');
        // logger.info('✌️ Jobs loaded');



        /**
         * When you use Redis
         */
        const redisClient = redis.createClient();
        redisClient.on('error', (err)=>{
            throw new Error('Redis Setup Error');
        });

        Container.set('redis', redisClient);

        logger.info('✌️ Redis loaded');

    }catch (err) {
        logger.error(`🔥 Error on loader index:\n\t${err.message}`);
        throw err;
    }

};
