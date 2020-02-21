import 'dotenv/config';
import 'reflect-metadata';
import App from './app';

import ContentsController from './api/contents/contents.controller';
import ContentsAdminController from './api/contents.admin/contents.admin.controller';
import VersionController from './api/version/version.controller';
import LoginController from './api/login/login.controller';

import loaders from './loaders';

(async () => {
    await loaders();
    const app = new App(
        [
            new ContentsController(),
            new ContentsAdminController(),
            new VersionController(),
            new LoginController(),
        ],
    );

    app.listen();
})();
