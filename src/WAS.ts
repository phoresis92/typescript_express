import 'dotenv/config';
import 'reflect-metadata';
import App from './app';

import ContentsController from './contents/contents.controller';

import loaders from './loaders';

(async () => {
  await loaders();
  const app = new App(
    [
      new ContentsController(),
    ],
  );

  app.listen();
})();
