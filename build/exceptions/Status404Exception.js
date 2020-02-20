"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = __importDefault(require("./HttpException"));
class Status404Exception extends HttpException_1.default {
    constructor(params) {
        super(404, 'Invalid Address', params);
    }
}
exports.default = Status404Exception;
//# sourceMappingURL=Status404Exception.js.map