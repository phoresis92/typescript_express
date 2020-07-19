import {
  cleanEnv, port, str,
} from 'envalid';

export default function validateEnv() {
  cleanEnv(process.env, {
    JWT_SECRET: str(),
    RDB_HOST: str(),
    RDB_PORT: port(),
    RDB_USER: str(),
    RDB_PASSWORD: str(),
    RDB_DB: str(),
    // WAS_PORT: port(),
    // DFS_PORT: port(),
    // PTMS_PORT: port(),
  });
}

