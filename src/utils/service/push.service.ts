import {getRepository} from 'typeorm';
import Contents from '../../entity/contents/contents.entity';
import PushInterface from '../../interfaces/push.interface';
import Utils from '../../utils/utils';
import {NextFunction} from "express";
// import * as express from "./post.controller";
// import CreatePostDto from "./post.dto";
// import PostNotFoundException from "../exceptions/PostNotFoundException";
// import Post from "./post.entity";

import PushQuery from './push.query';
import Mysql from 'mysql';

import {Container, Service, Inject} from 'typedi';
import {Logger} from "winston";
// import HttpException from "../../exceptions/HttpException";
import ErrorResponse from "../../exceptions/ErrorResponse";

enum contentsType {
    NOTICE = 'NOTICE',
    CONTENTS = 'CONTENTS'
}


@Service()
export default class PushService {
    @Inject('utils')
    private Utils;
    @Inject('mysql')
    private mysql: Mysql;
    @Inject('logger')
    private logger: Logger;

    private Query;

    constructor() {
        this.Query = new PushQuery()
    };


    public insertAllUserAlarm = async (Push: PushInterface) => {
        const recordSet = await this.mysql.commit(this.Query.pushAllUser(Push));

        let sendList = recordSet[1];

        return sendList;

    }

    public insertAdminAlarm = async (Push: PushInterface) => {
        const recordSet = await this.mysql.commit(this.Query.pushAdmin(Push));

        let sendList = recordSet[1];

        return sendList;

    }

}
