import argon2 from 'argon2';
import {createHash} from 'crypto';
import moment = require('moment');
import * as uuid from 'uuid';
import jwt from 'jsonwebtoken';
import redis, {RedisClient, print} from 'redis';
import {Container, Service, Inject} from 'typedi';
import {promisify} from 'util';
import TokenInterface from '../../interfaces/token.interface';

import UtilsClass from '../../utils/utils';

import ConfigClass from '../../config/config.dto';

import AuthDAOClass from './auth.dao';
import SigninDtoClass from './dto/signin.dto';
import SignupDtoClass from './dto/signup.dto';

import SnsAuthCheck from '../../utils/externalApi/SnsAuthCheck';

import ErrorResponse from "../../utils/response/ErrorResponse";

@Service('AuthService')
export default class AuthService {

    @Inject()
    private Config: ConfigClass;
    @Inject()
    private AuthDAO: AuthDAOClass;
    @Inject('redis')
    private Redis: RedisClient;

    constructor() {};

    public signinService = async (SigninDto: SigninDtoClass): Promise<any> => {

        /** UserLogin Check **/
        const loginData = await this.AuthDAO.getUserLoginById(SigninDto.loginId);
        {
            if (!loginData) {
                throw new ErrorResponse(404, "loginId not exist", '01');
            }

            if (SigninDto.joinType === 'NORMAL') {
                if(loginData.password === null){
                    throw new ErrorResponse(400, "In NORMAL type must have password", '02');
                    return;
                }
                console.log()
                const validPassword = await argon2.verify(loginData.password, SigninDto.password);
                if (!validPassword) {
                    throw new ErrorResponse(401, "password mismatch", '02');
                    return;
                }
            } else {
                const validToken = await new SnsAuthCheck(SigninDto.joinType).authorizeToken(SigninDto.loginId, SigninDto.password);
                if (!validToken) {
                    throw new ErrorResponse(401, `Invalid SNS token`, '02');
                    return;
                }
            }
        }

        /** User Check **/
        const userData = await this.AuthDAO.getUserByUserId(loginData.user_id);
        {
            if(!userData){
                throw new ErrorResponse(404, `Not exist userData`, '03');
                return;
            }
            if(userData.user_status !== 50){
                throw new ErrorResponse(403, `Deleted or Blocked user`, '04');
                return;
            }

        }

        /** Session Check **/
        let sessionData: any = await this.AuthDAO.getSessionBySessionId(SigninDto.sessionId);
        {
            if(sessionData){
                const {updateSessionResult, updateLoginResult} = await this.AuthDAO.updateLastLoginDate(SigninDto.sessionId, SigninDto.pushKey, loginData.user_id);

            }else{
                const loginGroup: string = (SigninDto.osType === 'AOD' || SigninDto.osType === 'IOS' ? 'MOBILE' : (SigninDto.osType === 'WEB' ? 'WEB' : 'ETC'));
                const anotherSession = await this.AuthDAO.getSessionByLoginGroup(loginData.user_id, loginGroup);

                if(anotherSession && SigninDto.loginForce === 0){
                    throw new ErrorResponse(401, `Another session exist`, '05');
                    return;
                }else if(anotherSession){
                    const deleteResult = await this.AuthDAO.deleteSessionByUserIdAndLoginGroup(loginData.user_id, loginGroup);
                    if(deleteResult.affectedRows === 0){
                        throw new ErrorResponse(500, `[DB] DELETE SESSION`, '06');
                        return;
                    }
                }

                //TODO Set default pushSet
                sessionData = {
                    pushSet: 31,
                    session_id: SigninDto.sessionId
                };

            }
        }

        const insertSessionRecord = await this.AuthDAO.insertSession(SigninDto.sessionId, loginData.user_id, SigninDto.osType, SigninDto.osVersion, SigninDto.appVersion, SigninDto.pushKey);
        // if(insertSessionRecord.affectedRows === 0){
        //     throw new ErrorResponse(500, `DB ERROR (insert session)`, '07');
        //     return;
        // }
        /** Token **/
        {
            const accessToken: string = this.generateToken({
                                                               uuid: userData.uuid.toString(),
                                                               sessionId: sessionData.session_id
                                                           }, '20m');
            const refreshToken: string = this.generateToken({sessionId: sessionData.session_id}, '1w');

            const hmsetSync = promisify(this.Redis.hmset).bind(this.Redis);
            // @ts-ignore
            const hmsetResult = await hmsetSync(sessionData.session_id, {
                refreshToken: refreshToken,
                userId: loginData.user_id
            });
            if (hmsetResult !== 'OK') {
                throw new ErrorResponse(500, '[REDIS] Set refreshToken Error', '07');
                return;
            }

            // if (data.osType === 'WEB') {
            //     req.yar.set('TOKEN', token);
            // }

            return {accessToken, refreshToken};
        }

    };

    public signupService = async (SignupDto: SignupDtoClass): Promise<any> => {

        /** ⚠️Term agree **/
        if(SignupDto.agreeUse !== 1 || SignupDto.agreePersonalInfo !== 1){
            throw new ErrorResponse(400, 'Must agree to term', '01');
            return;
        }

        /** ⚠️Exist loginId check **/
        const loginData = await this.AuthDAO.getUserLoginById(SignupDto.loginId, true);
        if(loginData){
            throw new ErrorResponse(400, 'Exist loginId', '02');
            return;
        }

        /** ⚠️SNS token check **/
        /*if (SignupDto.joinType !== 'NORMAL') {
            const validToken = await new SnsAuthCheck(SignupDto.joinType).authorizeToken(SignupDto.loginId, SignupDto.password);
            if (!validToken) {
                throw new ErrorResponse(401, `Invalid SNS token`, '02');
                return;
            }
        }*/

        /** ⚠️Auth code check **/
        {}

        // const userId = createHash('sha256').update(SignupDto.loginId + moment().format('x').slice(4, 10)).digest('hex').substring(0,49);

        const {uuid, user_id} = await this.AuthDAO.signupUser(SignupDto.joinType, SignupDto.nickName, SignupDto.loginId, SignupDto.password, SignupDto.agreeUse, SignupDto.agreePersonalInfo);

        return {uuid, user_id};

    };

    public logoutService = async (token: TokenInterface): Promise<any> => {

        const deleteSessionRecord = await this.AuthDAO.deleteSessionBySessionId(token.sessionId);
        if(deleteSessionRecord.affectedRows === 0){
            throw new ErrorResponse(500, '[DB] Delete Session', '01');
            return;
        }

        // const redisDelSync = promisify(this.Redis.del).bind(this.Redis);
        // const redisDelResult = await redisDelSync(token.user_id);
        this.Redis.hdel(token.sessionId, 'refresh_token', 'user_id', (err, value)=>{
            if(err){
                throw new ErrorResponse(500, '[Redis] Delete token', '02');
                return;
            }

            return true;
        });

        // this.Redis.del(token.user_id, (err, value) => {
        //     if(err){
        //         throw new ErrorResponse(500, '[Redis] Delete token', '02');
        //         return;
        //     }
        //
        //     return true;
        //
        // });

    };

    public refreshTokenService = async (token: TokenInterface, authorization: any): Promise<any> => {

        const redisGetSync = promisify(this.Redis.hgetall).bind(this.Redis);
        const redisValue = await redisGetSync(token.sessionId);

        const userRefreshToken = authorization.split(' ')[1];

        if(!redisValue){
            throw new ErrorResponse(401, 'Logout User', '01');
            return;
        }

        const redisRefreshToken = redisValue.refresh_token;
        const redisUserId = redisValue.user_id;

        if(userRefreshToken !== redisRefreshToken){
            throw new ErrorResponse(403, 'Refresh Token mismatch', '02');
            return;
        }

        const accessToken: string = this.generateToken({user_id: redisUserId, session_id: token.sessionId}, '20m');

        return accessToken;

    };

    private generateToken(payloadObj: any, expiresIn: string): string {
        // const today = new Date();
        // const exp = new Date(today);
        // exp.setDate(today.getDate() + 60);

        return jwt.sign(
            payloadObj,
            this.Config.jwtSecret,
            {algorithm: 'HS256', expiresIn: expiresIn}
        );

    }

}
