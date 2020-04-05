import 'dotenv/config';
import 'reflect-metadata';
import App from './app';

import cluster from 'cluster';
import os from 'os';
import uuid, { v4 } from 'uuid';

const instanceId = v4();

// import ContentsController from './api/contents/contents.controller';
// import ContentsAdminController from './api/contents.admin/contents.admin.controller';
// import VersionController from './api/version/version.controller';
import AuthController from './api/auth/auth.controller';

import loaders from './loaders';

(async () => {
    await loaders();
    const app = new App(
        [
            // new ContentsController(),
            // new ContentsAdminController(),
            // new VersionController(),
            new AuthController(),
        ],
    );

    app.listen();
})();
