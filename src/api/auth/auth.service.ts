import argon2 from 'argon2';
import {Request} from 'express';
import jwt from 'jsonwebtoken';
import redis, {RedisClient, print} from 'redis';
import {Container, Service, Inject} from 'typedi';
import {promisify} from 'util';
import TokenInterface from '../../interfaces/token.interface';

import UtilsClass from '../../utils/Utils';

import ConfigClass from '../../config/config.dto';

import AuthDAOClass from './auth.dao';
import SigninDtoClass from './dto/signin.dto';
import SignupDtoClass from './dto/signup.dto';

import SnsAuthCheck from '../../utils/externalApi/SnsAuthCheck';

import ErrorResponse from "../../utils/response/ErrorResponse";

@Service('AuthService')
export default class AuthService {

    private AuthDAO: AuthDAOClass = Container.get('AuthDAO');
    private Redis: RedisClient = Container.get('redis');

    constructor() {};

    public signinService = async (SigninDto: SigninDtoClass): Promise<any> => {
        console.log('signinService');

        try {

            /** UserLogin Check **/
            const loginData = await this.AuthDAO.getUserLoginById(SigninDto.loginId);
            {
                if (!loginData) {
                    throw new ErrorResponse(404, "loginId not exist", '01');
                }

                if (SigninDto.joinType === 'NORMAL') {
                    if (loginData.password === null) {
                        throw new ErrorResponse(400, "In NORMAL type must have password", '02');
                        return;
                    }
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
                if (!userData) {
                    throw new ErrorResponse(404, `Not exist userData`, '03');
                    return;
                }
                if (userData.user_status !== 50) {
                    throw new ErrorResponse(403, `Deleted or Blocked user`, '04');
                    return;
                }

            }

            /** Session Check **/
            let sessionData: any = await this.AuthDAO.getSessionBySessionId(SigninDto.sessionId);
            {
                if (sessionData) {
                    const {updateSessionResult, updateLoginResult} = await this.AuthDAO.updateLastLoginDate(SigninDto.sessionId, SigninDto.pushKey, loginData.user_id);

                } else {
                    const loginGroup: string = (SigninDto.osType === 'AOD' || SigninDto.osType === 'IOS' ? 'MOBILE' : (SigninDto.osType === 'WEB' ? 'WEB' : 'ETC'));
                    const anotherSession = await this.AuthDAO.getSessionByLoginGroup(loginData.user_id, loginGroup);

                    if (anotherSession && SigninDto.loginForce === 0) {
                        throw new ErrorResponse(401, `Another session exist`, '05');
                        return;
                    } else if (anotherSession) {
                        const deleteResult = await this.AuthDAO.deleteSessionByUserIdAndLoginGroup(loginData.user_id, loginGroup);
                        if (deleteResult.affectedRows === 0) {
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

                // const hmsetSync = promisify(this.Redis.hmset).bind(this.Redis);
                // const expireSync = promisify(this.Redis.expire).bind(this.Redis);
                // const hdelSync = promisify(this.Redis.hdel).bind(this.Redis);

                const hmsetSync = promisify(this.Redis.hmset).bind(this.Redis);
                // @ts-ignore
                const hmsetResult = await hmsetSync(sessionData.session_id, {
                    refreshToken: refreshToken,
                    userId: loginData.user_id
                });

                const expireSync = promisify(this.Redis.expire).bind(this.Redis);
                let expireResult = await expireSync(sessionData.session_id, 60 * 60 * 24 * 7);

                if (hmsetResult !== 'OK' || expireResult !== 1) {
                    const hdelSync = promisify(this.Redis.hdel).bind(this.Redis);
                    // @ts-ignore
                    await hdelSync(sessionData.session_id, 'userId', 'refreshToken');

                    throw new ErrorResponse(500, '[REDIS] Set refreshToken Error', '07');
                    return;

                }

                // if (data.osType === 'WEB') {
                //     req.yar.set('TOKEN', token);
                // }

                return {accessToken, refreshToken, userData};
            }

            // this.logger.error(`🔥 auth.servicesigninService:\n\t${err.message}`);

        }catch (e) {
            // console.log(e);
            throw e;
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
        if (SignupDto.joinType !== 'NORMAL') {
            const validToken = await new SnsAuthCheck(SignupDto.joinType).authorizeToken(SignupDto.loginId, SignupDto.password);
            if (!validToken) {
                throw new ErrorResponse(401, `Invalid SNS token`, '02');
                return;
            }
        }

        /** ⚠️Auth code check **/
        {}

        // const userId = createHash('sha256').update(SignupDto.loginId + moment().format('x').slice(4, 10)).digest('hex').substring(0,49);

        const {uuid, userId} = await this.AuthDAO.signupUser(SignupDto);

        return {uuid, userId};

    };

    public logoutService = async (token: TokenInterface): Promise<any> => {

        const deleteSessionRecord = await this.AuthDAO.deleteSessionBySessionId(token.sessionId);
        if(deleteSessionRecord.affectedRows === 0){
            throw new ErrorResponse(500, '[DB] Delete Session', '01');
            return;
        }

        const hdelSync = promisify(this.Redis.hdel).bind(this.Redis);
        // @ts-ignore
        const delResult = await hdelSync(token.sessionId, 'userId', 'refreshToken');

        return true;

        // this.Redis.hdel(token.sessionId, 'refresh_token', 'user_id', (err, value)=>{
        //     if(err){
        //         throw new ErrorResponse(500, '[Redis] Delete token', '02');
        //         return;
        //     }
        //
        //     return true;
        // });

    };

    public refreshTokenService = async (token: any, req: Request): Promise<any> => {

        const userRefreshToken: string = this.getTokenFromHeader(req);

        if(userRefreshToken !== token.refreshToken){
            throw new ErrorResponse(403, 'Refresh Token mismatch', '02');
            return;
        }

        const userData = await this.AuthDAO.getUserByUserId(token.userId);

        const accessToken: string = this.generateToken({uuid: userData.uuid.toString(), sessionId: token.sessionId}, '20m');

        return accessToken;

    };

    private generateToken(payloadObj: any, expiresIn: string): string {
        // const today = new Date();
        // const exp = new Date(today);
        // exp.setDate(today.getDate() + 60);

        return jwt.sign(
            payloadObj,
            ConfigClass.jwtSecret,
            {algorithm: 'HS256', expiresIn: expiresIn}
        );

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


}
