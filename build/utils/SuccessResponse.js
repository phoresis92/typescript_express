"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const config_1 = __importDefault(require("../config"));
class SuccessResponse {
    constructor(request, params, next) {
        this.request = request;
        this.params = params;
        this.next = next;
        this.logger = typedi_1.Container.get('logger');
    }
    ;
    callNext() {
        this.next(this);
    }
    ;
    make(resultData, sucCode, message) {
        this.resultData = resultData;
        this.sucCode = sucCode;
        this.message = message;
        this.callNext();
        return {
            result: true,
            path: `${this.request.path}/${this.sucCode}`,
            resultData: this.resultData,
            message: (config_1.default.nodeEnv == 'development' ? this.message : null)
        };
    }
}
;
exports.default = SuccessResponse;
//# sourceMappingURL=SuccessResponse.js.map