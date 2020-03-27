import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
// import * as multer from 'multer';
import express from 'express';
import {Container} from 'typedi';
// import HttpException from './exceptions/HttpException';
import Status404Exception from './exceptions/Status404Exception';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import logErrMiddleware from './middleware/dblog.middleware';
import {Logger} from "winston";
import Config from "./config/config.dto";

const multer = require('multer');
// const uploads = multer({dest: '/home/young/workspace/typescript_express/uploads'})


class App {
  private logger: Logger = Container.get('logger');
  private app: express.Application;
  private port: number;

  private Config: Config = Container.get('Config');

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
    switch (this.Config.server) {
      case this.Config.serverType.WAS:
        this.port = this.Config.wasPort;
        break;
      case this.Config.serverType.PTMS:
        this.port = this.Config.ptmsPort;
        break;
      case this.Config.serverType.DFS:
        this.port = this.Config.dfsPort;
        break;
    }
  }

  private initializeMiddlewares() {
      console.log(this.Config.server !== 'DFS')
      console.log(this.Config.server)
    this.app.use(bodyParser.json()); // for parsing application/json
    this.app.use(bodyParser.urlencoded({extended:true})); // for parsing application/x-www-form-urlencoded
    (this.Config.server !== 'DFS' ? this.app.use(multer().none()) : null); // for parsing multipart/form-data
    this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
    this.app.use(logErrMiddleware);
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use(this.Config.api.prefix, controller.router);
    });
  }

  private InvalidAddress404 (){
    this.app.get('*', async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
      next(new Status404Exception(request.params));
    })
        .post('*', async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
          next(new Status404Exception(request.params));
        })
        .delete('*', async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
          next(new Status404Exception(request.params));
        })
        .put('*', async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
          next(new Status404Exception(request.params));
        })
        .patch('*', async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
          next(new Status404Exception(request.params));
        })
        .head('*', async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
          next(new Status404Exception(request.params));
        })
        .options('*', async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
          next(new Status404Exception(request.params));
        });
  }
}

export default App;
