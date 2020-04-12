import {promises} from 'fs';
import {Container, Service, Inject, Token} from 'typedi';
import {extname, basename} from 'path';
import ffmpeg from 'fluent-ffmpeg';
import moment from 'moment';
import gm from 'gm';

import ConfigClass from '../../config/config.dto';

import FileHandlerClass from '../../utils/file/fileHandler.class';
import ErrorResponse from '../../utils/response/ErrorResponse';
import FileDAOClass from './file.dao';
import FileDtoClass/*, { ResponseInterface }*/ from './file.dto';

import TokenInterface from '../../interfaces/token.interface';

import sql from 'mysql';

@Service('FileService')
export default class FileService {

    @Inject()
    private Config: ConfigClass;
    @Inject()
    private FileDAO: FileDAOClass;
    @Inject()
    private FileHandler: FileHandlerClass;

    private allowImageExt = ['.jpg', '.jpeg', '.png', '.gif'];
    private allowVideoExt = ['.mp4', '.avi', '.mov', '.mkv'];

    constructor() {
    };

    public uploadImageService = async (FileDto: FileDtoClass, token: TokenInterface): Promise<FileResponseClass> => {
        let returnObj: FileResponseClass = new FileResponseClass();

        if (FileDto.makeThumb == 1 && (FileDto.thumbWidth == 0 || FileDto.thumbHeight == 0)) {
            throw new ErrorResponse(400, '@Thumbnail Scale Error', '01');
            return returnObj;
        }

        let baseRoot: string = `${this.Config.basePath}${this.Config.uploadPath}`;
        let path: string = `/${FileDto.filePath}`;
        let fileName: string = '';
        const originName: string = FileDto.fileData.originalname;
        const ext: string = extname(originName).toLowerCase();


        if (!this.allowImageExt.includes(ext)) {
            throw new ErrorResponse(400, '@Ext Not Allowed', '02');
        }

        if (FileDto.useDateFolder === 1) {
            path += `/${moment().format('YYYYMMDD')}`;
        }

        if (FileDto.useUniqueFileName === 1) {
            fileName = `${this.FileHandler.getUniqueName()}${ext}`;
        } else {
            fileName = originName;
        }

        path += `/`;
        const result = await this.FileHandler.uploadFileByBuffer(`${baseRoot}${path}`, fileName, FileDto.fileData.buffer);
        if (!result) {
            throw new Error('@File Upload Fail');
        }

        // @ts-ignore
        const originSize: { width: number, height: number } = await this.FileHandler.getDimension(FileDto.fileData.buffer);

        returnObj.userId = token.userId;
        returnObj.uuid = token.uuid;
        returnObj.fileName = fileName;
        returnObj.fileExtenstion = ext;
        returnObj.filePath = `${path}`;
        returnObj.fileWidth = originSize.width;
        returnObj.fileHeight = originSize.height;
        returnObj.fileSize = FileDto.fileData.size;
        returnObj.fileType = 'img';
        returnObj.option1 = FileDto.option1;
        returnObj.option2 = FileDto.option2;
        returnObj.option3 = FileDto.option3;
        returnObj.targetType = FileDto.targetType || 'TEMP';
        returnObj.targetKey = FileDto.targetKey || 'TEMP';

        const thumbName = `${basename(fileName, ext)}_thumb${ext}`;

        if (FileDto.makeThumb === 0 && FileDto.thumbData === undefined) {
            returnObj.code = '01';

            await this.FileDAO.insertFile(returnObj);
            return returnObj;

        } else if (FileDto.thumbData !== undefined) {
            const result = await this.FileHandler.uploadFileByBuffer(`${baseRoot}${path}`, thumbName, FileDto.thumbData.buffer);

            if (!result) {
                throw new Error('@File Upload Fail');
            }

            // @ts-ignore
            const thumbSize: { width: number, height: number } = await this.FileHandler.getDimension(FileDto.thumbData.buffer);

            returnObj.thumbName = thumbName;
            returnObj.thumbExtenstion = extname(thumbName);
            returnObj.thumbWidth = thumbSize.width;
            returnObj.thumbHeight = thumbSize.height;
            returnObj.code = '02';

            await this.FileDAO.insertFile(returnObj);
            return returnObj;

        } else {
            // @ts-ignore
            const {resizeWidth, resizeHeight} = await this.FileHandler.rescaleCalc(originSize.width, originSize.height, FileDto.thumbWidth, FileDto.thumbHeight, FileDto.thumbOption);

            await this.FileHandler.getThumbnail(FileDto.fileData.buffer, resizeWidth, resizeHeight
                , `${baseRoot}${path}/${thumbName}`, 100);

            // @ts-ignore
            const thumbSize: { width: number, height: number } = await this.FileHandler.getDimension(`${baseRoot}${path}/${thumbName}`);

            returnObj.thumbName = thumbName;
            returnObj.thumbExtenstion = extname(thumbName);
            returnObj.thumbWidth = thumbSize.width;
            returnObj.thumbHeight = thumbSize.height;
            returnObj.code = '03';

            await this.FileDAO.insertFile(returnObj);
            return returnObj;

        }

    };

    public uploadVideoService = async (FileDto: FileDtoClass, token: TokenInterface): Promise<FileResponseClass> => {
        // if (FileDto.makeThumb == 1 && (FileDto.thumbWidth == 0 || FileDto.thumbHeight == 0)) {
        //     throw new Error('@Thumbnail Scale Error');
        // }

        return new Promise(async (resolve, reject) => {

            let baseRoot: string = `${this.Config.basePath}${this.Config.uploadPath}`;
            let path: string = `/${FileDto.filePath}`;
            let fileName: string = '';
            const originName: string = FileDto.fileData.originalname;
            const ext: string = extname(originName).toLowerCase();

            let returnObj: FileResponseClass = new FileResponseClass();

            if (!this.allowVideoExt.includes(ext)) {
                reject('@Ext Not Allowed');
                // throw new Error('@Ext Not Allowed');
            }

            if (FileDto.useDateFolder === 1) {
                path += `/${moment().format('YYYYMMDD')}`;
            }

            if (FileDto.useUniqueFileName === 1) {
                fileName = `${this.FileHandler.getUniqueName()}${ext}`;
            } else {
                fileName = originName;
            }
            const convertName = `${basename(fileName, ext)}_convert.mp4`;

            path += `/`
            const result = await this.FileHandler.uploadFileByBuffer(`${baseRoot}${path}`, fileName, FileDto.fileData.buffer);

            if (!result) {
                throw new Error('@File Upload Fail');
            }

            //========================================================
            //========================================================

            await this.FileHandler.convertVideo(path, FileDto.encodeSize, FileDto.encodeFps, fileName, convertName);

            // @ts-ignore
            const {width, height, duration, size, bitRate} = await this.FileHandler.getVideoMeta(`${baseRoot}${path}/${convertName}`);

            returnObj.userId = token.userId;
            returnObj.uuid = token.uuid;
            returnObj.fileName = convertName;
            returnObj.fileExtenstion = extname(convertName);
            returnObj.filePath = `${path}`;
            returnObj.fileWidth = width;
            returnObj.fileHeight = height;
            returnObj.fileSize = size;
            returnObj.fileType = 'mov';
            returnObj.option1 = FileDto.option1;
            returnObj.option2 = FileDto.option2;
            returnObj.option3 = FileDto.option3;
            returnObj.targetType = FileDto.targetType || 'TEMP';
            returnObj.targetKey = FileDto.targetKey || 'TEMP';
            returnObj.movPlaytime = parseInt(duration);

            const thumbName = `${basename(fileName, ext)}_thumb.png`;

            if (FileDto.makeThumb === 0 && FileDto.thumbData === undefined) {
                returnObj.code = '01';

                await this.FileDAO.insertFile(returnObj);
                resolve(returnObj);

            } else if (FileDto.thumbData !== undefined) {
                const result = await this.FileHandler.uploadFileByBuffer(`${baseRoot}${path}`, thumbName, FileDto.thumbData.buffer);

                if (!result) {
                    throw new Error('@File Upload Fail');
                }

                // @ts-ignore
                const thumbSize: { width: number, height: number } = await this.FileHandler.getDimension(FileDto.thumbData.buffer);

                returnObj.thumbName = thumbName;
                returnObj.thumbWidth = thumbSize.width;
                returnObj.thumbHeight = thumbSize.height;
                returnObj.thumbExtenstion = extname(thumbName);
                returnObj.code = '02';

                await this.FileDAO.insertFile(returnObj);
                resolve(returnObj);

            } else {

                let thumbWidth: number = FileDto.thumbWidth && FileDto.thumbWidth > 0 ? FileDto.thumbWidth : width;
                let thumbHeight: number = FileDto.thumbHeight && FileDto.thumbHeight > 0 ? FileDto.thumbHeight : height;

                ffmpeg(`${baseRoot}${path}/${convertName}`)
                    // @ts-ignore
                    .screenshots({
                                     timestamps: [30.5, '50%', '01:10.123'],
                                     filename: thumbName,
                                     folder: `${baseRoot}${path}`,
                                     size: `${thumbWidth}x${thumbHeight}`,
                                 });

                returnObj.thumbName = thumbName;
                returnObj.thumbWidth = thumbWidth;
                returnObj.thumbHeight = thumbHeight;
                returnObj.code = '03';

                await this.FileDAO.insertFile(returnObj);
                resolve(returnObj);

            }

        });

    };

}

export class FileResponseClass extends FileDtoClass {

    userId: number;
    uuid: string;
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

    public insertFile() {
        let query = `
            INSERT INTO 
                t_nf_file
            SET 
                target_type = ${sql.escape(this.targetType)}
                , target_key = ${sql.escape(this.targetKey)}
                , user_id = ${sql.escape(this.userId)}
                , uuid = ${sql.escape(this.uuid)}
                , file_type = ${sql.escape(this.fileType)}
                , file_path = ${sql.escape(this.filePath)}
                , file_name = ${sql.escape(this.fileName)}
                , file_extension = ${sql.escape(this.fileExtenstion)}
                , file_size = ${sql.escape(this.fileSize)}
                , file_width = ${sql.escape(this.fileWidth)}
                , file_height = ${sql.escape(this.fileHeight)}
                , thumb_path = ${sql.escape(this.filePath)}
                , thumb_name = ${sql.escape(this.thumbName)}
                , thumb_extension = ${sql.escape(this.thumbExtenstion)}
                , thumb_width = ${sql.escape(this.thumbWidth)}
                , thumb_height = ${sql.escape(this.thumbHeight)}
                , option1 = ${sql.escape(this.option1)}
                , option2 = ${sql.escape(this.option2)}
                , option3 = ${sql.escape(this.option3)}
                ${this.movPlaytime !== undefined ? `, mov_playtime = ${sql.escape(this.movPlaytime)}` : ``}
        `;

        return query;
    }

}
