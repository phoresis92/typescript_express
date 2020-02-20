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
const express = __importStar(require("express"));
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
const user_dto_1 = __importDefault(require("../user/user.dto"));
const authentication_service_1 = __importDefault(require("./authentication.service"));
class AuthenticationController {
    constructor() {
        this.path = '/auth';
        this.router = express.Router();
        this.authenticationService = new authentication_service_1.default();
        this.registration = async (request, response, next) => {
            const userData = request.body;
            try {
                const { cookie, user, } = await this.authenticationService.register(userData);
                response.setHeader('Set-Cookie', [cookie]);
                response.send(user);
            }
            catch (error) {
                next(error);
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/register`, validation_middleware_1.default(user_dto_1.default), this.registration);
    }
}
exports.default = AuthenticationController;
//# sourceMappingURL=authentication.controller.js.map