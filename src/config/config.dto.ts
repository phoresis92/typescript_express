import path from 'path';
import {Container} from 'typedi';


const envFound = require('dotenv').config();
if (!envFound) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default class Config {

    private constructor() {
    }

    /**
     * Service Info
     */
    public static readonly server: string = Container.get('server');
    public static serverId: string;
    public static readonly serviceName: string = process.env.SERVICE_NAME!;

    /**
     * Node Environment
     */
    public static nodeEnv: string = process.env.NODE_ENV!;

    /**
     * Mysql Environment
     */
    public static readonly mysqlHost: string = process.env.RDB_HOST!;
    public static readonly mysqlPort: number = Number(process.env.RDB_PORT);
    public static readonly mysqlUser: string = process.env.RDB_USER!;
    public static readonly mysqlPassword: string = process.env.RDB_PASSWORD!;
    public static readonly mysqlDb: string = process.env.RDB_DB!;
    public static readonly mysqlDateStrings: boolean = Boolean(process.env.RDB_DATE_STRINGS);
    public static readonly mysqlCharSet: string = process.env.RDB_CHAR_SET!;

    /**
     * Your favorite port
     */
    public static port: number = Number(process.env.WAS_PORT);

    /**
     * File upload path
     */
    public static basePath: string = process.env.BASE_PATH!;
    public static uploadPath: string = process.env.UPLOAD_PATH!;
    public static ffmpegPath: string = path.join(__dirname, '../..', process.env.FFMPEG_PATH!);

    /**
     * Facebook develop id for Auth
     */
    public static facebookId: string = process.env.APIKEY_FB_ID!;
    public static facebookSecret: string = process.env.APIKEY_FB_SECRET!;

    /**
     * Redis Config
     */
    public static redisPort: number = parseInt(process.env.REDIS_PORT!) | 6379;
    public static redisHost: string = process.env.REDIS_HOST!;

    /**
     * Paging Config
     */
    public static itemPerPageCnt: number = parseInt(process.env.ITME_PER_PAGE_COUNT!) | 10;
    public static pageCount: number = parseInt(process.env.PAGE_COUNT!) | 10;

    /**
     * That long string from mlab
     */
    // databaseURL: process.env.MONGODB_URI,

    /**
     * Your secret sauce
     */
    public static jwtSecret: string = process.env.JWT_SECRET!;

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
    public static api: {prefix: string} =  {
        prefix: process.env.API_PREFIX || '/api',
    };
    /**
     * Mailgun email credentials
     */
    // emails: {
    //     apiKey: 'API key from mailgun',
    //     domain: 'Domain Name from mailgun'
    // }
}
