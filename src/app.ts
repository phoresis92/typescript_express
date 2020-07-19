import express from 'express';
import session from 'express-session';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import {Container, Inject} from 'typedi';
import {Logger} from "winston";
import helmet from "helmet";
const multer = require('multer');
import Status404Exception from './exceptions/Status404Exception';
import Controller from './interfaces/controller.interface';
import LoggerClass from './utils/logger';
import errorMiddleware from './middleware/error.middleware';
import logErrMiddleware from './middleware/dblog.middleware';
import ConfigClass from "./config/config.dto";
import {SERVERTYPE} from "./config/constant.dto";



class App {
  private logger: Logger = LoggerClass.getInstance();
  private app: express.Application;
  private port: number = ConfigClass.port;


  constructor(controllers: Controller[]) {
    this.app = express();
    /*this.getPort();*/

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.InvalidAddress404();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, '0.0.0.0', () => {
      this.logger.info(`
      ################################################
      🛡  ${ConfigClass.server} [${ConfigClass.serverId}] listening on port: ${this.port} 🛡️ 
      ################################################
    `);
    });
  }

  public getServer() {
    return this.app;
  }

  /*private getPort(){
    switch (ConfigClass.server) {
      case SERVERTYPE.WAS:
        this.port = ConfigClass.wasPort;
        break;
      case SERVERTYPE.PTMS:
        this.port = ConfigClass.ptmsPort;
        break;
      case SERVERTYPE.DFS:
        this.port = ConfigClass.dfsPort;
        break;
    }
  }*/

  private initializeMiddlewares() {
    this.app.use(bodyParser.json()); // for parsing application/json
    this.app.use(bodyParser.urlencoded({extended:true})); // for parsing application/x-www-form-urlencoded
    (ConfigClass.server !== 'DFS' ? this.app.use(multer().none()) : null); // for parsing multipart/form-data
    this.app.use(cookieParser());
    this.app.use(helmet());
    this.app.use(helmet.xssFilter());
    this.app.use(helmet.frameguard());
    this.app.disable('x-powered-by');
    // this.app.use(session({
    //   name: 'session',
    //   secret: "secret cat",
    //   keys: ['key1', 'key2'],
    //   cookie: {
    //     secure: true,
    //     httpOnly: true,
    //     domain: 'example.com',
    //     path: 'foo/bar',
    //     expires: new Date(Date.now() + 60 * 60 * 1000)
    //   }
    // }));
  }

  private initializeErrorHandling() {
    this.app.use(logErrMiddleware);
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use(ConfigClass.api.prefix, controller.router);
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
