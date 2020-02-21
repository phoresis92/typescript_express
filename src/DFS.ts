import 'dotenv/config';
import 'reflect-metadata';
import App from './app';


import loaders from './loaders';

(async () => {
  await loaders();
  const app = new App(
    [
    ],
  );

  app.listen();
})();
