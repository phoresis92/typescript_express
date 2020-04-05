import jwt from 'jsonwebtoken';
import {Request, RequestHandler} from 'express';
import {RedisClient} from 'redis';
import {Container, Inject} from 'typedi';
import {promisify} from 'util';
import ConfigClass from '../config/config.dto';
import Response from '../utils/response';
import ErrorResponse from '../utils/response/ErrorResponse';

/**
 * We are assuming that the JWT will come in a header with the form
 *
 * Authorization: Bearer ${JWT}
 *
 * But it could come in a query parameter with the name that you want like
 * GET https://my-bulletproof-api.com/stats?apiKey=${JWT}
 * Luckily this API follow _common sense_ ergo a _good design_ and don't allow that ugly stuff
 */

class JwtValid {

    private Config: ConfigClass = Container.get('Config');
    private Redis: RedisClient = Container.get('redis');

    constructor(){
    }

    public decodeToken (): RequestHandler {
        return async (req, res, next) => {
            let decoded;
            try {
                decoded = jwt.verify(this.getTokenFromHeader(req), this.Config.jwtSecret);
            }catch(e){

            }
            console.log(decoded)

            decoded = jwt.decode(this.getTokenFromHeader(req))

            console.log(decoded)

            req.token = decoded

            next();

        }

            // return jwt({
            //     secret: this.Config.jwtSecret, // The _secret_ to sign the JWTs
            //     // requestProperty: 'token', // Use req.token to store the JWT
            //     getToken: this.getTokenFromHeader, // How to extract the JWT from the request
            //     responseProperty: 'body.token'
            // })

    }

    public userIdFromUuid (): RequestHandler {
        return async (req, res, next) => {

            const redisGetSync = promisify(this.Redis.hgetall).bind(this.Redis);
            const tokenDataObj = await redisGetSync(req.body.token.sessionId);

            req.body.token.userId = tokenDataObj.userId;

            next();

        }
    }

    public validate (): RequestHandler {
        return async (req, res, next) => {

            const redisGetSync = promisify(this.Redis.hgetall).bind(this.Redis);
            const refreshToken = await redisGetSync(req.body.token.sessionId);

            if(!refreshToken){
                res.status(401).send(new Response.fail(req, req.params, next).make({}, '401', 'Logout User'));
                // next(new ErrorResponse(401, 'Logout User', '401'));
                return;
            }

            next();

        }
    }

    private getTokenFromHeader (req: Request) {
        if (
            (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
            (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
        ) {
            return req.headers.authorization.split(' ')[1];
        }
        return '';
    }

}

// function jwtValidMiddleware<T>(): RequestHandler {
//     const Config: ConfigClass = Container.get('Config');
//
//     return jwt({
//         secret: Config.jwtSecret, // The _secret_ to sign the JWTs
//         requestProperty: 'body.token', // Use req.token to store the JWT
//         getToken: getTokenFromHeader, // How to extract the JWT from the request
//     })
//         // .unless({path: ['/api/auth/auth']})
//         ;
//
//     function getTokenFromHeader (req: Request) {
//         if (
//             (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
//             (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
//         ) {
//             return req.headers.authorization.split(' ')[1];
//         }
//         return null;
//     }
//
// }

export default JwtValid;

