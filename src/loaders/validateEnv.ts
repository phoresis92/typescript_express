import {
  cleanEnv, port, str,
} from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    JWT_SECRET: str(),
    RDB_HOST: str(),
    RDB_PORT: port(),
    RDB_USER: str(),
    RDB_PASSWORD: str(),
    RDB_DB: str(),
    PORT: port(),
  });
}

export default validateEnv;
