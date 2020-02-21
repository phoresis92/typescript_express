import {getRepository} from 'typeorm';
import Contents from '../../entity/contents/contents.entity';
import Utils from '../../utils/utils';
import {NextFunction} from "express";
// import * as express from "./post.controller";
// import CreatePostDto from "./post.dto";
// import PostNotFoundException from "../exceptions/PostNotFoundException";
// import Post from "./post.entity";

import contentsQuery from './login.query';
import Mysql from 'mysql';

import {Container, Service, Inject} from 'typedi';
import {Logger} from "winston";
import HttpException from "../../exceptions/HttpException";
import ErrorResponse from "../../exceptions/ErrorResponse";

enum contentsType {
    NOTICE = 'NOTICE',
    CONTENTS = 'CONTENTS'
}


@Service()
export default class LoginService {
    @Inject('utils')
    private Utils;
    @Inject('mysql')
    private mysql: Mysql;
    @Inject('logger')
    private logger: Logger;

    private Query;

    constructor() {
        this.Query = new contentsQuery()
    };

    private loginId;
    private sessionId;
    private osType;
    private osVersion;
    private appVersion;
    private deviceName;
    private pushKey;
    private userId;

    public loginService = async (loginId: string, password: string, sessionId: string, osType: string, osVersion: string, appVersion: string, deviceName: string, pushKey: string, forceLogin: number) => {
        this.loginId = loginId;
        this.sessionId = sessionId;
        this.osType = osType;
        this.osVersion = osVersion;
        this.appVersion = appVersion;
        this.deviceName = deviceName;
        this.pushKey = pushKey;

        const loginData = (await this.mysql.exec(this.Query.getById(), [loginId]))[0];
        if (!loginData) {
            throw new ErrorResponse(404, "loginId not exist", 1);
        }
        if (loginData.password !== password) {
            throw new ErrorResponse(403, "check password", 2)
        }
        if (loginData.status !== 50) {
            throw new ErrorResponse(404, "deleted user", 3)
        }

        this.userId = loginData.user_id;


        const sessionData = (await this.mysql.exec(this.Query.getSession('session_id'), [sessionId]))[0];

        if (sessionData) {
            this.loginProgress();
            return;
        } else {
            const sessionData = (await this.mysql.exec(this.Query.getSession('user_id'), [loginData.user_id]))[0];

            if (!sessionData) {
                this.loginProgress();
                return;
            }

            if (forceLogin === 0) {
                throw new ErrorResponse(403, 'already login user', 4);
                return;
            } else {
                await this.mysql.exec(this.Query.deleteSession(), [sessionData.session_id]);
                this.loginProgress();
                return;
            }


        }

    }

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

}
