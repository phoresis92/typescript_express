import 'dotenv/config';
import 'reflect-metadata';
import FileController from './api/file/file.controller';
import App from './app';


import loaders from './loaders';

(async () => {
  await loaders();
  const app = new App(
    [
      new FileController()
    ],
  );

  app.listen();
})();
