import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

enum SERVERTYPE {
  WAS = 'WAS',
  PTMS = 'PTMS',
  DFS = 'DFS'
}

export default {
  server: process.env.SERVER,

  serverType: SERVERTYPE,
  /**
   * Service Info
   */
  serviceName: process.env.SERVICE_NAME,

  /**
   * Node Environment
   */
  nodeEnv: process.env.NODE_ENV,

  mysqlHost: process.env.RDB_HOST,
  mysqlPort: process.env.RDB_PORT,
  mysqlUser: process.env.RDB_USER,
  mysqlPassword: process.env.RDB_PASSWORD,
  mysqlDb: process.env.RDB_DB,


  /**
   * Your favorite port
   */
  wasPort: parseInt(process.env.WAS_PORT, 10),
  ptmsPort: parseInt(process.env.PTMS_PORT, 10),
  dfsPort: parseInt(process.env.DFS_PORT, 10),

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI,

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * Agenda.js stuff
   */
  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
  },

  /**
   * Agendash config
   */
  agendash: {
    user: 'agendash',
    password: '123456'
  },
  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },
  /**
   * Mailgun email credentials
   */
  emails: {
    apiKey: 'API key from mailgun',
    domain: 'Domain Name from mailgun'
  }
};

