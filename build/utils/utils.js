"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    constructor() { }
    ;
    makeArray(origin, split) {
        let arr = origin.split(split);
        arr.filter((val, idx) => {
            return val !== '';
        });
        return arr;
    }
}
exports.default = Utils;
//# sourceMappingURL=utils.js.map