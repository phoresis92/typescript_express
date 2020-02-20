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
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const typeorm_1 = require("typeorm");
const UserWithThatEmailAlreadyExistsException_1 = __importDefault(require("../exceptions/UserWithThatEmailAlreadyExistsException"));
const user_entity_1 = __importDefault(require("../user/user.entity"));
class AuthenticationService {
    constructor() {
        this.userRepository = typeorm_1.getRepository(user_entity_1.default);
    }
    async register(userData) {
        if (await this.userRepository.findOne({ email: userData.email })) {
            throw new UserWithThatEmailAlreadyExistsException_1.default(userData.email);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = this.userRepository.create(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
        await this.userRepository.save(user);
        user.password = undefined;
        const tokenData = this.createToken(user);
        const cookie = this.createCookie(tokenData);
        return {
            cookie,
            user,
        };
    }
    createCookie(tokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
    createToken(user) {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken = {
            id: user.id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }
}
exports.default = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map