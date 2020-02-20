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
const jwt = __importStar(require("jsonwebtoken"));
const typeorm_1 = require("typeorm");
const AuthenticationTokenMissingException_1 = __importDefault(require("../exceptions/AuthenticationTokenMissingException"));
const WrongAuthenticationTokenException_1 = __importDefault(require("../exceptions/WrongAuthenticationTokenException"));
const user_entity_1 = __importDefault(require("../user/user.entity"));
async function authMiddleware(request, response, next) {
    const cookies = request.cookies;
    const userRepository = typeorm_1.getRepository(user_entity_1.default);
    if (cookies && cookies.Authorization) {
        const secret = process.env.JWT_SECRET;
        try {
            const verificationResponse = jwt.verify(cookies.Authorization, secret);
            const id = verificationResponse.id;
            const user = await userRepository.findOne(id);
            if (user) {
                request.user = user;
                next();
            }
            else {
                next(new WrongAuthenticationTokenException_1.default());
            }
        }
        catch (error) {
            next(new WrongAuthenticationTokenException_1.default());
        }
    }
    else {
        next(new AuthenticationTokenMissingException_1.default());
    }
}
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map