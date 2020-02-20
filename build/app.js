"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = __importStar(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const multer_1 = __importDefault(require("multer"));
const express_1 = __importDefault(require("express"));
const typedi_1 = require("typedi");
const Status404Exception_1 = __importDefault(require("./exceptions/Status404Exception"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const dblog_middleware_1 = __importDefault(require("./middleware/dblog.middleware"));
const index_1 = __importDefault(require("./config/index"));
class App {
    constructor(controllers) {
        this.logger = typedi_1.Container.get('logger');
        this.app = express_1.default();
        this.getPort();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.InvalidAddress404();
        this.initializeErrorHandling();
    }
    listen() {
        this.app.listen(this.port, () => {
            this.logger.info(`
      ################################################
      🛡 Server listening on port: ${this.port} 🛡️ 
      ################################################
    `);
        });
    }
    getServer() {
        return this.app;
    }
    getPort() {
        switch (index_1.default.server) {
            case index_1.default.serverType.WAS:
                this.port = index_1.default.wasPort;
                break;
            case index_1.default.serverType.PTMS:
                this.port = index_1.default.ptmsPort;
                break;
            case index_1.default.serverType.DFS:
                this.port = index_1.default.dfsPort;
                break;
        }
    }
    initializeMiddlewares() {
        this.app.use(bodyParser.json()); // for parsing application/json
        this.app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
        this.app.use(multer_1.default().array()); // for parsing multipart/form-data
        this.app.use(cookie_parser_1.default());
    }
    initializeErrorHandling() {
        this.app.use(dblog_middleware_1.default);
        this.app.use(error_middleware_1.default);
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            console.log(controller);
            this.app.use(index_1.default.api.prefix, controller.router);
        });
    }
    InvalidAddress404() {
        this.app.get('*', async (request, response, next) => {
            next(new Status404Exception_1.default(request.params));
        })
            .post('*', async (request, response, next) => {
            next(new Status404Exception_1.default(request.params));
        })
            .delete('*', async (request, response, next) => {
            next(new Status404Exception_1.default(request.params));
        })
            .put('*', async (request, response, next) => {
            next(new Status404Exception_1.default(request.params));
        })
            .patch('*', async (request, response, next) => {
            next(new Status404Exception_1.default(request.params));
        })
            .head('*', async (request, response, next) => {
            next(new Status404Exception_1.default(request.params));
        })
            .options('*', async (request, response, next) => {
            next(new Status404Exception_1.default(request.params));
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map