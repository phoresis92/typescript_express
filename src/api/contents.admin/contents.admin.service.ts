import {getRepository} from 'typeorm';
import Contents from '../../entity/contents/contents.entity';
import ErrorResponse from '../../exceptions/ErrorResponse';
import Utils from '../../utils/utils';
import {NextFunction} from "express";
// import * as express from "./post.controller";
// import CreatePostDto from "./post.dto";
// import PostNotFoundException from "../exceptions/PostNotFoundException";
// import Post from "./post.entity";

import contentsQuery from './contents.admin.query';

import {Container, Service, Inject} from 'typedi';

enum contentsType {
    NOTICE = 'NOTICE',
    CONTENTS = 'CONTENTS'
}

@Service('ContentsAdminService')
export default class ContentsAdminService {
    @Inject('utils')
    private Utils;
    @Inject('mysql')
    private mysql;
    @Inject('logger')
    private logger;

    private ContentsAdminQuery = new contentsQuery();

    constructor() {
        console.log('ContentsAdminService', 'constructor');
    };

    public getAll = async (page: number, keyword: string) => {

        const contents = await this.mysql.exec(this.ContentsAdminQuery.all(page, keyword));

        let imgFile;
        if (contents.length !== 0) {
            let query = [];
            contents.map((val, idx) => {
                query.push(this.ContentsAdminQuery.imgFile(val.contents_seq));
            });

            imgFile = await this.mysql.get(query);
        } else {
            imgFile = [];
        }

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
        return {contents, imgFile};

    };

    public createNoticeService = async (serialNumber: string, contents: string) => {

        let recordSet;
        let updateResult;

        recordSet = await this.mysql.exec(this.ContentsAdminQuery.createNotice(), [serialNumber, contents]);

        return {recordSet};
    };

    public delete = async (contentsSeqs: string, next: NextFunction) => {
        const seqArray = this.Utils.makeArray(contentsSeqs, ',');
        let recordSet;
        let updateResult;

        recordSet = await this.mysql.exec(this.ContentsAdminQuery.getBySeqs(), [seqArray]);

        if (seqArray.length !== recordSet.length) {
            throw new ErrorResponse(404, "already deleted", 1);
        }

        updateResult = await this.mysql.exec(this.ContentsAdminQuery.delete(), [seqArray]);

        return {recordSet, updateResult};
    };

}
