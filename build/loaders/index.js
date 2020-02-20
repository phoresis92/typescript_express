"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dependencyInjector_1 = __importDefault(require("./dependencyInjector"));
// import mongooseLoader from './mongoose';
// import jobsLoader from './jobs';
const logger_1 = __importDefault(require("./logger"));
const validateEnv_1 = __importDefault(require("./validateEnv"));
// import {createConnection} from 'typeorm';
// import {Container} from 'typedi';
// import ormConfig from './ormconfig';
exports.default = async () => {
    /**
     * ValidateEnv
     */
    validateEnv_1.default();
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
    await dependencyInjector_1.default({
        // mongoConnection,
        models: [
        // userModel,
        // salaryModel,
        // whateverModel
        ],
    });
    logger_1.default.info('✌️ Dependency Injector loaded');
    // await jobsLoader({ agenda });
    logger_1.default.info('✌️ Jobs loaded');
};
//# sourceMappingURL=index.js.map