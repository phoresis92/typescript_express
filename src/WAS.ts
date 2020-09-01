import 'reflect-metadata';
import {Container} from 'typedi';
import {Logger} from 'winston';
import {SERVERTYPE} from './config/constant.dto';

Container.set('server', SERVERTYPE.WAS);

import App from './app';

import VersionController from './api/version/version.controller';
import AuthController from './api/auth/auth.controller';
import HabitController from './api/habit/habit.controller';
import UserController from './api/user/user.controller';
import HabitJoinController from './api/habitJoin/habitJoin.controller';

import loaders from './loaders';
import LoggerClass from './utils/logger';

(async () => {

    const logger: Logger = LoggerClass.getInstance();

    try {

        await loaders();

        const app = new App(
            [
                new VersionController(),
                new AuthController(),
                new HabitController(),
                new UserController(),
                new HabitJoinController(),
            ],
        );

        app.listen();

    }catch (err) {
        logger.error(`🔥 Error on ${Container.get('server')}:\n\t${err.message}`);
        process.exit(1);
    }

})();
