import 'dotenv/config';
import 'reflect-metadata';
import App from './app';

import AddressController from './address/address.controller';
import AuthenticationController from './authentication/authentication.controller';
import CategoryController from './category/category.controller';
import PostController from './post/post.controller';
import ContentsController from './contents.admin/contents.admin.controller';

import loaders from './loaders';

(async () => {
  await loaders();
  const app = new App(
    [
      // new PostController(),
      // new AuthenticationController(),
      // new AddressController(),
      // new CategoryController(),
      new ContentsController(),
    ],
  );

  app.listen();
})();
