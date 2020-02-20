import {getRepository} from 'typeorm';
import Contents from '../entity/contents/contents.entity';
import Utils from '../utils/utils';
import { NextFunction } from "express";
// import * as express from "./post.controller";
// import CreatePostDto from "./post.dto";
// import PostNotFoundException from "../exceptions/PostNotFoundException";
// import Post from "./post.entity";

import contentsQuery from './contents.query';

import { Container, Service, Inject } from 'typedi';

enum contentsType {
    NOTICE = 'NOTICE',
    CONTENTS = 'CONTENTS'
}


@Service()
export default class ContentsService {
    private Query;
    private utils = new this.Utils();

    constructor(
        @Inject('utils')
        private Utils,
        @Inject('mysql')
        private mysql,
        @Inject('logger')
        private logger
    ){
        this.Query = new contentsQuery()
    };

    public getBySerial = async (serialNumber: string, page: number) => {
        const contents = await this.mysql.exec(this.Query.bySerial(page), [serialNumber, contentsType.CONTENTS]);

        let imgFile
        if(contents.length !== 0){
            let query = [];
            contents.map((val, idx)=>{
                query.push(this.Query.imgFile(val.contents_seq))
            });

            imgFile = await this.mysql.get(query);
        }else{
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
        if(notice){
            let query = this.Query.imgFile(notice.contents_seq);
            imgFile = await this.mysql.exec(query);
        }else {
            notice = null;
            imgFile = null;
        }

        return {notice, imgFile}
    }

    public create = async (serialNumber: string, phoneNumber: string, fileSeqs: string, next: NextFunction) => {

        let recordSet;
        let updateResult;

        try{
        recordSet = await this.mysql.exec(this.Query.create(), [serialNumber, phoneNumber]);
        
        console.log(recordSet);
        console.log(recordSet.affectedRows);
        console.log(recordSet.insertId);

        let fileSeqArr = this.utils.makeArray(fileSeqs, ',');
        console.log(fileSeqArr);

        updateResult = await this.mysql.exec(this.Query.updateFile(), [recordSet.insertId, fileSeqArr])
            console.log(updateResult)
        }catch (e){
            logger.error(e.stack());
            throw new Error(e)
        }

        return {recordSet, updateResult}
    }

}
