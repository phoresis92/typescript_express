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
const request = __importStar(require("supertest"));
const typeorm = __importStar(require("typeorm"));
const app_1 = __importDefault(require("../../app"));
const authentication_controller_1 = __importDefault(require("../authentication.controller"));
typeorm.getRepository = jest.fn();
describe('The AuthenticationController', () => {
    describe('POST /auth/register', () => {
        describe('if the email is not taken', () => {
            it('response should have the Set-Cookie header with the Authorization token', () => {
                const userData = {
                    fullName: 'John Smith',
                    email: 'john@smith.com',
                    password: 'strongPassword123',
                };
                process.env.JWT_SECRET = 'jwt_secret';
                typeorm.getRepository.mockReturnValue({
                    findOne: () => Promise.resolve(undefined),
                    create: () => (Object.assign(Object.assign({}, userData), { id: 0 })),
                    save: () => Promise.resolve(),
                });
                const authenticationController = new authentication_controller_1.default();
                const app = new app_1.default([
                    authenticationController,
                ]);
                return request(app.getServer())
                    .post(`${authenticationController.path}/register`)
                    .send(userData)
                    .expect('Set-Cookie', /^Authorization=.+/);
            });
        });
    });
});
//# sourceMappingURL=authentication.controller.test.js.map