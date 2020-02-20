"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const logger_1 = __importDefault(require("./logger"));
// import agendaFactory from './agenda';
const config_1 = __importDefault(require("../config"));
const utils_1 = require("../utils");
const MysqlTemplate_1 = __importDefault(require("./MysqlTemplate"));
// import mailgun from 'mailgun-js';
exports.default = ({ /*mongoConnection*/ models }) => {
    try {
        models.forEach(m => {
            typedi_1.Container.set(m.name, m.model);
        });
        // const agendaInstance = agendaFactory({ mongoConnection });
        // Container.set('agendaInstance', agendaInstance);
        typedi_1.Container.set('logger', logger_1.default);
        typedi_1.Container.set('config', config_1.default);
        typedi_1.Container.set('utils', utils_1.Utils);
        typedi_1.Container.set('success', utils_1.SuccessResponse);
        typedi_1.Container.set('mysql', MysqlTemplate_1.default);
        // Container.set('emailClient', mailgun({ apiKey: config.emails.apiKey, domain: config.emails.domain }));
        // LoggerInstance.info('✌️ Agenda injected into container');
        // return { agenda: agendaInstance };
    }
    catch (e) {
        logger_1.default.error('🔥 Error on dependency injector loader: %o', e);
        throw e;
    }
};
//# sourceMappingURL=dependencyInjector.js.map