import 'dotenv/config';
import 'reflect-metadata';
import App from './app';


// import VersionController from './api/version/version.controller';
import AuthController from './api/auth/auth.controller';
import HabitController from './api/habit/habit.controller';
import UserController from './api/user/user.controller';
import HabitJoinController from './api/habitJoin/habitJoin.controller';

import loaders from './loaders';

(async () => {
    await loaders();
    const app = new App(
        [
            // new VersionController(),
            new AuthController(),
            new HabitController(),
            new UserController(),
            new HabitJoinController(),
        ],
    );

    app.listen();
})();
