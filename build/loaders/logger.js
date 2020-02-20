"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const config_1 = __importDefault(require("../config"));
const { combine, timestamp, label, printf, prettyPrint } = winston_1.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`; // log 출력 포맷 정의
});
function makeOption(server) {
    return {
        // log파일
        file: {
            level: 'info',
            filename: `${__dirname}/../../logs/${config_1.default.serviceName}_${server}.log`,
            handleExceptions: true,
            json: false,
            maxsize: 5242880,
            maxFiles: 5,
            colorize: false,
            format: combine(label({ label: `${config_1.default.serviceName}` }), timestamp(), myFormat),
        },
        // 개발 시 console에 출력
        console: {
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            format: combine(label({ label: `${config_1.default.serviceName}_${server}` }), timestamp(), myFormat),
        },
    };
}
// const options = {
//   // log파일
//   file: {
//     level: 'info',
//     filename: `${__dirname}/../../logs/${config.serviceName}_was.log`, // 로그파일을 남길 경로
//     handleExceptions: true,
//     json: false,
//     maxsize: 5242880, // 5MB
//     maxFiles: 5,
//     colorize: false,
//     format: combine(
//       label({ label: `${config.serviceName}` }),
//       timestamp(),
//       myFormat,    // log 출력 포맷
//     ),
//   },
//   // 개발 시 console에 출력
//   console: {
//     level: 'debug',
//     handleExceptions: true,
//     json: false, // 로그형태를 json으로도 뽑을 수 있다.
//     colorize: true,
//     format: combine(
//       label({ label: `${config.serviceName}_DEBUG` }),
//       timestamp(),
//       myFormat,
//       // prettyPrint()
//     ),
//   },
// };
let options = makeOption(config_1.default.server);
const loggerInstance = winston_1.createLogger({
    transports: [
        new winston_1.transports.File(options.file),
    ],
    exitOnError: false,
});
if (config_1.default.nodeEnv !== 'production') {
    loggerInstance.add(new winston_1.transports.Console(options.console)); // 개발 시 console로도 출력
}
exports.default = loggerInstance;
//# sourceMappingURL=logger.js.map