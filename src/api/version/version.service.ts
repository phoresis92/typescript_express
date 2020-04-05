import {getRepository} from 'typeorm';
import Contents from '../../entity/contents/contents.entity';
import Utils from '../../utils/utils';
import {NextFunction} from "index.d.ts";
// import * as express from "./post.controller";
// import CreatePostDto from "./post.dto";
// import PostNotFoundException from "../exceptions/PostNotFoundException";
// import Post from "./post.entity";

import versionQuery from './version.query';

import {Container, Service, Inject} from 'typedi';
import {Logger} from "winston";
import Mysql from "mysql";
import HttpException from "../../exceptions/HttpException";
import ErrorResponse from "../../utils/response/ErrorResponse";

enum contentsType {
    NOTICE = 'NOTICE',
    CONTENTS = 'CONTENTS'
}

@Service()
export default class VersionService {
    @Inject('utils')
    private Utils;
    @Inject('mysql')
    private mysql: Mysql;
    @Inject('logger')
    private logger: Logger;

    private Query;

    constructor() {
        this.Query = new versionQuery();
    };

    public getRecent = async (type: string) => {

        const versionData = (await this.mysql.exec(this.Query.recent(), [type]))[0];

        if (!versionData) {
            throw new ErrorResponse(404, "Version not exist", 1);
        }

        return {versionData};

        // const contents = await this.contentsRepository.find({
        //     where: {
        //         serial_number: serialNumber,
        //         contents_type: contentsType.CONTENTS,
        //     },
        //     order: {
        //         contents_seq: 'DESC'
        //     },
        //     skip: (page - 1) * 10,
        //     take: 10,
        // });
    };

}
