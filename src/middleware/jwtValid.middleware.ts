import jwt from 'jsonwebtoken';
import {Request, RequestHandler} from 'express';
import {invalid} from 'moment';
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
        return async (req: Request, res, next) => {

            const invalidJwt: Error = await this.jwtValidCheck(req);

            if(invalidJwt){
                res.status(401).send(new Response.fail(req, req.params, next).make({}, '401', invalidJwt.message));
                return;
            }

            const decoded = await jwt.decode(this.getTokenFromHeader(req));
            req.cookies.token = decoded;

            const redisGetSync = promisify(this.Redis.hgetall).bind(this.Redis);
            const getResult = await redisGetSync(req.cookies.token.sessionId);

            if(!getResult){
                res.status(401).send(new Response.fail(req, req.params, next).make({}, '401', 'Logout User'));
                // next(new ErrorResponse(401, 'Logout User', '401'));
                return;
            }

            req.cookies.token.userId = getResult.userId;
            req.cookies.token.refreshToken = getResult.refreshToken;

            next();

        }

            // return jwt({
            //     secret: this.Config.jwtSecret, // The _secret_ to sign the JWTs
            //     // requestProperty: 'token', // Use req.token to store the JWT
            //     getToken: this.getTokenFromHeader, // How to extract the JWT from the request
            //     responseProperty: 'body.token'
            // })

    }

    private getTokenFromHeader (req: Request): string {
        if (
            (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
            (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
        ) {
            return req.headers.authorization.split(' ')[1];
        }
        return '';
    }

    private jwtValidCheck (req: Request) {
        try {
            jwt.verify(this.getTokenFromHeader(req), this.Config.jwtSecret);

            return null;

        }catch(e){
            return e;
        }

    }

}

export default JwtValid;

