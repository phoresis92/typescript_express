import argon2 from 'argon2';
import {Container, Service, Inject} from 'typedi';

import ConfigClass from '../../config/config.dto';
import LoginDAOClass from './login.dao';
import LoginDtoClass from './login.dto';

import LoginAuthCheck from '../../utils/externalApi/LoginAuthCheck';

import ErrorResponse from "../../exceptions/ErrorResponse";

@Service('LoginService')
export default class LoginService {

    @Inject()
    private Config: ConfigClass;
    @Inject()
    private LoginDAO: LoginDAOClass;

    constructor() {
    };

    public loginService = async (LoginDto: LoginDtoClass): Promise<any> => {

        const loginData = await this.LoginDAO.getUserLoginById(LoginDto.loginId);

        if (!loginData) {
            throw new ErrorResponse(404, "loginId not exist", '01');
        }

        if (LoginDto.joinType === 'NORMAL') {
            const validPassword = await argon2.verify(loginData.password, LoginDto.password);
            if (!validPassword) {
                throw new ErrorResponse(401, "password mismatch", '02');
                return;
            }
        } else {
            const validToken = await new LoginAuthCheck(LoginDto.joinType).authorizeToken(LoginDto.loginId, LoginDto.password);
            if (!validToken) {
                throw new ErrorResponse(401, `Invalid SNS token`, '02');
                return;
            }
        }

        const userData = await this.LoginDAO.getUserByUserId(loginData.user_id);

        if(!userData){
            throw new ErrorResponse(404, `Not exist userData`, '03');
            return;
        }

        if(userData.status !== 50){
            throw new ErrorResponse(403, `Deleted or Blocked user`, '04');
            return;
        }

        this.LoginDAO.getSessionBySessionId()

        // if(LoginDto.joinType === 'KAKAO'){
        //     Axios.get(options)
        // }else if(LoginDto.joinType === 'NAVER'){
        //
        // }else if(LoginDto.joinType === 'FACEBOOK'){
        //
        // }else if(LoginDto.joinType === 'GOOGLE'){
        //
        // }else{
        //     throw new ErrorResponse(400, "joinType Error", '03');
        //     return;

        return;
        // const loginData = (await this.mysql.exec(this.Query.getById(), [loginId]))[0];

        // if (loginData && loginData.login_id === 'admin' && loginData.password !== password) {
        //     throw new ErrorResponse(403, "[admin] check password", 1)
        // }
        // if (loginData.status !== 50) {
        //     throw new ErrorResponse(404, "deleted user", 3)
        // }

        /*        this.userId = (loginData ? loginData.user_id : this.loginId);


                const sessionData = (await this.mysql.exec(this.Query.getSession('session_id'), [sessionId]))[0];

                if (sessionData) {
                    this.loginProgress();
                    return;
                } else {
                    const sessionData = (await this.mysql.exec(this.Query.getSession('user_id'), [this.userId]))[0];

                    if (!sessionData) {
                        this.loginProgress();
                        return;
                    }

                    if (forceLogin === 0) {
                        throw new ErrorResponse(403, 'already login user', 21);
                        return;
                    } else {
                        await this.mysql.exec(this.Query.deleteSession(), [sessionData.session_id]);
                        this.loginProgress();
                        return;
                    }


                }*/

    };

    /*
        private loginProgress = async function loginProgress() {
            const insertData = await this.mysql.exec(this.Query.insertUpdateSession(), [
                this.sessionId, this.userId, this.osType,
                this.osVersion, this.appVersion, this.deviceName,
                this.pushKey
            ])
            console.log(insertData)
            if(insertData.affectedRows === 0){
                throw new ErrorResponse(500, `DB Error`, 5)
            }

            return insertData;
        }

        public logoutService = async (sessionId: string) => {

            const deleteResult = await this.mysql.exec(this.Query.deleteSession(), [sessionId]);

            return deleteResult;

        }
    */

}

export class LoginResponseClass extends LoginDtoClass {

    code: string;
    fileExtenstion: string;
    thumbExtenstion: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileWidth: number;
    fileHeight: number;
    thumbName: string;
    thumbWidth: number;
    thumbHeight: number;
    movPlaytime: number;

}
