"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const app_1 = __importDefault(require("./app"));
// import AddressController from './address/address.controller';
// import AuthenticationController from './authentication/authentication.controller';
// import CategoryController from './category/category.controller';
// import PostController from './post/post.controller';
const contents_controller_1 = __importDefault(require("./contents/contents.controller"));
const loaders_1 = __importDefault(require("./loaders"));
(async () => {
    await loaders_1.default();
    const app = new app_1.default([
        // new PostController(),
        // new AuthenticationController(),
        // new AddressController(),
        // new CategoryController(),
        new contents_controller_1.default(),
    ]);
    app.listen();
})();
//# sourceMappingURL=WAS.js.map