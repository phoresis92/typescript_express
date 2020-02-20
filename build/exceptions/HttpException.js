"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    constructor(status, message, params) {
        super(message);
        this.status = status;
        this.message = message;
        this.params = params;
    }
}
exports.default = HttpException;
//# sourceMappingURL=HttpException.js.map