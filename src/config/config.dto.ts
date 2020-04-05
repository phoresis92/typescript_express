import path from 'path';
import validateEnv from '../loaders/validateEnv';

/**
 * ValidateEnv
 */
validateEnv();


const envFound = require('dotenv').config();
if (!envFound) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export enum SERVERTYPE {
    WAS = 'WAS',
    PTMS = 'PTMS',
    DFS = 'DFS',
    ERROR = 'ERROR'
}

export default class Config {
    /**
     * Service Info
     */
    public server: string = process.env.SERVER!;
    public serverType = SERVERTYPE;
    public serviceName: string = process.env.SERVICE_NAME!;

    /**
     * Node Environment
     */
    public nodeEnv: string = process.env.NODE_ENV!;

    /**
     * Mysql Environment
     */
    public mysqlHost: string = process.env.RDB_HOST!;
    public mysqlPort: number = Number(process.env.RDB_PORT);
    public mysqlUser: string = process.env.RDB_USER!;
    public mysqlPassword: string = process.env.RDB_PASSWORD!;
    public mysqlDb: string = process.env.RDB_DB!;
    public dataString: boolean = Boolean(process.env.RDB_DATA_STRING);
    public charSet: string = process.env.RDB_CHAR_SET!;

    /**
     * Your favorite port
     */
    public wasPort: number =  Number(process.env.WAS_PORT);
    public ptmsPort: number = Number(process.env.PTMS_PORT);
    public dfsPort: number = Number(process.env.DFS_PORT);

    /**
     * File upload path
     */
    public basePath: string = process.env.BASE_PATH!;
    public uploadPath: string = process.env.UPLOAD_PATH!;
    public ffmpegPath: string = path.join(__dirname, '../..', process.env.FFMPEG_PATH!);

    /**
     * Facebook develop id for Auth
     */
    public facebookId: string = process.env.APIKEY_FB_ID!;
    public facebookSecret: string = process.env.APIKEY_FB_SECRET!;

    /**
     * Redis Config
     */
    public redisPort: number = parseInt(process.env.REDIS_PORT!) | 6379;
    public redisHost: string = process.env.REDIS_HOST!;

    /**
     * That long string from mlab
     */
    // databaseURL: process.env.MONGODB_URI,

    /**
     * Your secret sauce
     */
    public jwtSecret: string = process.env.JWT_SECRET!;

    /**
     * Used by winston logger
     */
    // logs: {
    //     level: process.env.LOG_LEVEL || 'silly',
    // },

    /**
     * Push set
     */
    // push: {
    //     fcmKey: process.env.PUSH_FCM,
    //     apnsRelease: process.env.PUSH_APNS_RELEASE,
    //     apnsCert: process.env.PUSH_APNS_CERT,
    //     apnsCertDev: process.env.PUSH_APNS_CERT_DEV,
    //     apnsKey: process.env.PUSH_APNS_KEY,
    //     apnsKeyDev: process.env.PUSH_APNS_KEY_DEV,
    //     apnsPassphrase: process.env.PUSH_APNS_PASSPHRASE,
    // },

    /**
     * Agenda.js stuff
     */
    // agenda: {
    //     dbCollection: process.env.AGENDA_DB_COLLECTION,
    //     pooltime: process.env.AGENDA_POOL_TIME,
    //     concurrency: parseInt(process.env.AGENDA_CONCURRENCY!, 10),
    // },

    /**
     * Agendash config
     */
    // agendash: {
    //     user: 'agendash',
    //     password: '123456'
    // },
    /**
     * API configs
     */
    public api: {prefix: string} =  {
        prefix: '/api',
    };
    /**
     * Mailgun email credentials
     */
    // emails: {
    //     apiKey: 'API key from mailgun',
    //     domain: 'Domain Name from mailgun'
    // }
}
