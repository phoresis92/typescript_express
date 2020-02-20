"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const config_1 = __importDefault(require("../config"));
const query_1 = require("../query");
const dbLogMiddleware = async (nextData, request, response, next) => {
    if (nextData instanceof Error) {
        next(nextData);
        return;
    }
    // const logErrRepository = getRepository(LogErr);
    const logger = typedi_1.Container.get('logger');
    // const config = Container.get('config');
    const mysql = typedi_1.Container.get('mysql');
    const logErrQuery = new query_1.LogErrQuery();
    try {
        const recordSet = await mysql.exec(logErrQuery.create(), [
            response.statusCode,
            config_1.default.server,
            1,
            request.method,
            request.path,
            JSON.stringify(request.headers),
            JSON.stringify(nextData.params),
            JSON.stringify(request.query),
            JSON.stringify(request.body),
            JSON.stringify(nextData.resultData)
        ]);
        // const newLog = logErrRepository.create
        // ({
        //      status_code: response.statusCode,
        //      server: 1,
        //      id: 1,
        //      method: request.method,
        //      path: request.path,
        //      header: JSON.stringify(request.headers),
        //      params: JSON.stringify(nextData.params),
        //      query: JSON.stringify(request.query),
        //      payload: JSON.stringify(request.body),
        //      response: JSON.stringify(nextData.resultData),
        //      reg_date: new Date(),
        //  });
        // await logErrRepository.save(newLog);
        logger.info(`[${response.statusCode}|${request.method}|${request.path}]${JSON.stringify(nextData.resultData)}`);
    }
    catch (e) {
        logger.error(e);
    }
};
exports.default = dbLogMiddleware;
//# sourceMappingURL=dblog.middleware.js.map