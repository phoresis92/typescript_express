import {Container, Service} from 'typedi';
import { createLogger, format, transports, Logger } from 'winston';
import ConfigClass from '../config/config.dto';

const { combine, timestamp, label, printf, prettyPrint } = format;

@Service('logger')
export default class LoggerClass {

    private constructor(){};

    private static options: any;

    private static logFormat = printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;    // log 출력 포맷 정의
    });

    private static logger: Logger = null;

    public static getInstance(): Logger{
        if(this.logger === null){
            this.options = this.makeOption(ConfigClass.serviceName, ConfigClass.server);

            this.logger = createLogger({
                transports: [
                    new transports.File(this.options.file), // 중요! 위에서 선언한 option으로 로그 파일 관리 모듈 transport
                ],
                exitOnError: false,
            });

            if (ConfigClass.nodeEnv !== 'production') {
                this.logger.add(new transports.Console(this.options.console)); // 개발 시 console로도 출력
            }

        }

        return this.logger;

    }

    private static makeOption(serviceName: string, server: string){
        if(server === ''){
            throw new Error('server is empty');
        }if(serviceName === ''){
            throw new Error('serviceName is empty');
        }

        return {
            // log파일
            file: {
                level: 'info',
                filename: `${__dirname}/../../logs/${ConfigClass.serviceName}_${server}.log`, // 로그파일을 남길 경로
                handleExceptions: true,
                json: false,
                maxsize: 5242880, // 5MB
                maxFiles: 5,
                colorize: false,
                format: combine(
                    label({ label: `${ConfigClass.serviceName}` }),
                    timestamp(),
                    this.logFormat,    // log 출력 포맷
                ),
            },
            // 개발 시 console에 출력
            console: {
                level: 'debug',
                handleExceptions: true,
                json: false, // 로그형태를 json으로도 뽑을 수 있다.
                colorize: true,
                format: combine(
                    label({ label: `${ConfigClass.serviceName}_${server}` }),
                    timestamp(),
                    this.logFormat,
                    // prettyPrint()
                ),
            },
        }
    }

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
