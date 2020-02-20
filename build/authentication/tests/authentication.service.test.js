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
const typeorm = __importStar(require("typeorm"));
const UserWithThatEmailAlreadyExistsException_1 = __importDefault(require("../../exceptions/UserWithThatEmailAlreadyExistsException"));
const authentication_service_1 = __importDefault(require("../authentication.service"));
typeorm.getRepository = jest.fn();
describe('The AuthenticationService', () => {
    describe('when creating a cookie', () => {
        it('should return a string', () => {
            const tokenData = {
                token: '',
                expiresIn: 1,
            };
            typeorm.getRepository.mockReturnValue({});
            const authenticationService = new authentication_service_1.default();
            expect(typeof authenticationService.createCookie(tokenData))
                .toEqual('string');
        });
    });
    describe('when registering a user', () => {
        describe('if the email is already taken', () => {
            it('should throw an error', async () => {
                const userData = {
                    fullName: 'John Smith',
                    email: 'john@smith.com',
                    password: 'strongPassword123',
                };
                typeorm.getRepository.mockReturnValue({
                    findOne: () => Promise.resolve(userData),
                });
                const authenticationService = new authentication_service_1.default();
                await expect(authenticationService.register(userData))
                    .rejects.toMatchObject(new UserWithThatEmailAlreadyExistsException_1.default(userData.email));
            });
        });
        describe('if the email is not taken', () => {
            it('should not throw an error', async () => {
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
                const authenticationService = new authentication_service_1.default();
                await expect(authenticationService.register(userData))
                    .resolves.toBeDefined();
            });
        });
    });
});
//# sourceMappingURL=authentication.service.test.js.map