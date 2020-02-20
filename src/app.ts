import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import express, {NextFunction, Request, Response} from 'express';
import {Container} from 'typedi';
// import HttpException from './exceptions/HttpException';
import Status404Exception from './exceptions/Status404Exception';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import logErrMiddleware from './middleware/dblog.middleware';
import {Logger} from "winston";
import Config from "./config/index";

class App {
  private logger: Logger = Container.get('logger');
  private app: express.Application;
  private port: number

  constructor(controllers: Controller[]) {
    this.app = express();
    this.getPort();

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.InvalidAddress404();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
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
    switch (Config.server) {
      case Config.serverType.WAS:
        this.port = Config.wasPort;
        break;
      case Config.serverType.PTMS:
        this.port = Config.ptmsPort;
        break;
      case Config.serverType.DFS:
        this.port = Config.dfsPort;
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
      this.app.use(Config.api.prefix, controller.router);
    });
  }

  private InvalidAddress404 (){
    this.app.get('*', async (request: Request, response: Response, next: NextFunction)=>{
      next(new Status404Exception(request.params));
    })
        .post('*', async (request: Request, response: Response, next: NextFunction)=>{
          next(new Status404Exception(request.params));
        })
        .delete('*', async (request: Request, response: Response, next: NextFunction)=>{
          next(new Status404Exception(request.params));
        })
        .put('*', async (request: Request, response: Response, next: NextFunction)=>{
          next(new Status404Exception(request.params));
        })
        .patch('*', async (request: Request, response: Response, next: NextFunction)=>{
          next(new Status404Exception(request.params));
        })
        .head('*', async (request: Request, response: Response, next: NextFunction)=>{
          next(new Status404Exception(request.params));
        })
        .options('*', async (request: Request, response: Response, next: NextFunction)=>{
          next(new Status404Exception(request.params));
        })
  }
}

export default App;
