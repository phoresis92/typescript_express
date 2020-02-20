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
  private port: number

  constructor(controllers: Controller[]) {
    this.app = express();
    this.getPort();

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      this.logger.info(`
      ################################################
      🛡 Server listening on port: ${this.port} 🛡️ 
      ################################################
    `);
    });
  }

  public getServer() {
    return this.app;
  }

  private getPort(){
    switch (this.config.server) {
      case this.config.serverType.WAS:
        this.port = this.config.wasPort
        break;
      case this.config.serverType.PTMS:
        this.port = this.config.ptmsPort
        break;
      case this.config.serverType.DFS:
        this.port = this.config.dfsPort
        break;
    }
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
      this.app.use(this.config.api.prefix, controller.router);
    });
  }
}

export default App;
