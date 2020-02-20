import 'dotenv/config';
import 'reflect-metadata';
import App from './app';

import ContentsAdminController from './contents.admin/contents.admin.controller';

import loaders from './loaders';

(async () => {
  await loaders();
  const app = new App(
    [
      new ContentsAdminController(),
    ],
  );

  app.listen();
})();
