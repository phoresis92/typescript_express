import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import express from 'express';
import {Container} from 'typedi';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import logErrMiddleware from './middleware/dblog.middleware';

class App {
  private logger = Container.get('logger');
  private config = Container.get('config');
  private app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      this.logger.info(`
      ################################################
      🛡 Server listening on port: ${this.config.port} 🛡️ 
      ################################################
    `);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json()); // for parsing application/json
    this.app.use(bodyParser.urlencoded({extended:true})); // for parsing application/x-www-form-urlencoded
    this.app.use(multer().array()); // for parsing multipart/form-data
    this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
    this.app.use(logErrMiddleware);
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }
}

export default App;
