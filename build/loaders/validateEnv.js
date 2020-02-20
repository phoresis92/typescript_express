"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
function validateEnv() {
    envalid_1.cleanEnv(process.env, {
        JWT_SECRET: envalid_1.str(),
        RDB_HOST: envalid_1.str(),
        RDB_PORT: envalid_1.port(),
        RDB_USER: envalid_1.str(),
        RDB_PASSWORD: envalid_1.str(),
        RDB_DB: envalid_1.str(),
        WAS_PORT: envalid_1.port(),
        PTMS_PORT: envalid_1.port(),
        SERVER: envalid_1.str(),
    });
}
exports.default = validateEnv;
//# sourceMappingURL=validateEnv.js.map