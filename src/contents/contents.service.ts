import {getRepository} from 'typeorm';
import Contents from '../entity/contents/contents.entity';
import Utils from '../utils/utils';
import {NextFunction} from "express";
// import * as express from "./post.controller";
// import CreatePostDto from "./post.dto";
// import PostNotFoundException from "../exceptions/PostNotFoundException";
// import Post from "./post.entity";

import contentsQuery from './contents.query';

import {Container, Service, Inject} from 'typedi';
import {Logger} from "winston";
import HttpException from "../exceptions/HttpException";

enum contentsType {
    NOTICE = 'NOTICE',
    CONTENTS = 'CONTENTS'
}


@Service()
export default class ContentsService {
    @Inject('utils')
    private Utils;
    @Inject('mysql')
    private mysql;
    @Inject('logger')
    private logger: Logger;

    private Query;

    constructor() {
        this.Query = new contentsQuery()
    };

    public getBySerial = async (serialNumber: string, keyword, page: number) => {
        const contents = await this.mysql.exec(this.Query.bySerial(page, keyword), [serialNumber]);

        let imgFile
        if (contents.length !== 0) {
            let query = [];
            contents.map((val, idx) => {
                query.push(this.Query.imgFile(val.contents_seq))
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
        return {contents, imgFile}
    }

    public searchContents = async (serialNumber: string, keyword: string, page: number) => {
        const contents = await this.mysql.exec(this.Query.search(page), [serialNumber, `%${keyword}%`, `%${keyword}%`]);

        let imgFile
        if (contents.length !== 0) {
            let query = [];
            contents.map((val, idx) => {
                query.push(this.Query.imgFile(val.contents_seq))
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
        return {contents, imgFile}
    }

    public getNotice = async () => {

        let notice = (await this.mysql.exec(this.Query.notice()))[0];

        let imgFile;
        if (notice) {
            let query = this.Query.imgFile(notice.contents_seq);
            imgFile = await this.mysql.exec(query);
        } else {
            notice = null;
            imgFile = null;
        }

        return {notice, imgFile}
    }

    public create = async (serialNumber: string, phoneNumber: string, fileSeqs: string, next: NextFunction) => {

        let recordSet;
        let updateResult;

        try {
            recordSet = await this.mysql.exec(this.Query.create(), [serialNumber, phoneNumber]);

            console.log(recordSet);
            console.log(recordSet.affectedRows);
            console.log(recordSet.insertId);

            let fileSeqArr = this.Utils.makeArray(fileSeqs, ',');
            console.log(fileSeqArr);

            updateResult = await this.mysql.exec(this.Query.updateFile(), [recordSet.insertId, fileSeqArr])
            console.log(updateResult)
        } catch (e) {
            this.logger.error(e.stack());
            throw new Error(e)
        }

        return {recordSet, updateResult}
    }

    public delete = async (serialNumber: string, contentsSeqs: string, next: NextFunction) => {
        const seqArray = this.Utils.makeArray(contentsSeqs, ',');
        let recordSet;
        let updateResult;

        try {
            recordSet = await this.mysql.exec(this.Query.getBySeqs(), [seqArray]);

            if (seqArray.length !== recordSet.length) {
                throw new Error("already deleted");
            }

            recordSet.map((val, idx) => {
                if (val.serial_number !== serialNumber) {
                    throw new Error("not mine");
                }
            })

            updateResult = await this.mysql.exec(this.Query.delete(), [seqArray])

            console.log(updateResult);

        } catch (e) {
            this.logger.error(e.message);
            // next(new Error(e));
            throw new Error(e);
            return;
        }

        return {recordSet, updateResult}
    }

}
