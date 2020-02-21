import 'dotenv/config';
import 'reflect-metadata';
import App from './app';

import ContentsController from './contents/contents.controller';
import ContentsAdminController from './contents.admin/contents.admin.controller';

import loaders from './loaders';

(async () => {
    await loaders();
    const app = new App(
        [
            new ContentsController(),
            new ContentsAdminController(),
        ],
    );

    app.listen();
})();
