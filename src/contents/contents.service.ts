import {getRepository} from 'typeorm';
import Contents from '../entity/contents/contents.entity';
import RequestWithUser from "../interfaces/requestWithUser.interface";
import * as express from "./post.controller";
import CreatePostDto from "./post.dto";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import Post from "./post.entity";

import { Service, Inject } from 'typedi';

enum contentsType {
    NOTICE = 'NOTICE',
    CONTENTS = 'CONTENTS'
}


@Service()
export default class ContentsService {
    private contentsRepository = getRepository(Contents);

    constructor(){};

    public  getContentsBySerial = async (serialNumber, page) => {

        const contents = await this.contentsRepository.find({
            where: {
                serial_number: serialNumber,
                contents_type: contentsType.CONTENTS,
            },
            order: {
                contents_seq: 'DESC'
            },
            skip: (page - 1) * 10,
            take: 10,
        });
        console.log(contents)
        return contents
    }

}
