import 'dotenv/config';
import 'reflect-metadata';
import App from './app';

import cluster from 'cluster';
import os from 'os';
import uuid, { v4 } from 'uuid';

const instanceId = v4();

// import VersionController from './api/version/version.controller';
import AuthController from './api/auth/auth.controller';
import HabitController from './api/habit/habit.controller';

import loaders from './loaders';

(async () => {
    await loaders();
    const app = new App(
        [
            // new VersionController(),
            new AuthController(),
            new HabitController(),
        ],
    );

    app.listen();
})();
