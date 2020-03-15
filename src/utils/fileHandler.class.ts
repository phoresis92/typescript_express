import {rejects} from 'assert';
import * as fs from "fs";
import gm from "gm";
import mkdirp from 'mkdirp';
import moment from 'moment';
import path, {extname} from 'path';
import uuid, {v1, v3, v4, v5} from 'uuid';


export default class FileHandlerClass{

    constructor(){
    }

    public uploadFileByBuffer(path: string, fileName: string, buffer: Buffer, isUnique?:number){
        if(isUnique === undefined){
            isUnique = 0;
        }

        return new Promise((resolve, reject)=>{
            if(!fs.existsSync(path)) {
                mkdirp.sync(path);
            }

            if(isUnique){
                fileName = `${this.getUniqueName()}${extname(fileName)}`;
            }

            const permission = 438;
            let fileDescriptor = fs.openSync(`${path}/${fileName}`, 'w', permission);

            if (fileDescriptor) {
                fs.writeSync(fileDescriptor, buffer, 0, buffer.length, 0);
                fs.closeSync(fileDescriptor);

                resolve(true);
            } else {
                reject(false);
            }

        })

    }

    public deleteFile(path: string, fileName: string){
        return new Promise((resolve, reject)=>{
            if(fs.existsSync(`${path}/${fileName}`)) {
                fs.unlink(`${path}/${fileName}`, (err)=>{
                    if(err) throw err;
                    resolve(true);
                });
            }else{
                reject(false);
            }

        })

    }

    public getDimension (file: any){
        return new Promise((resolve, reject)=>{
            gm(file)
                .size({bufferStream: true}, (err, dimension)=>{
                    if (err) reject(err);

                    resolve(dimension)

                })
        });
    }

    public getThumbnail (file: any, width: number, height: number, thumbPathWithName: string, quality: number){
        return new Promise((resolve, reject)=>{
            gm(file)
                .thumb(width, height, thumbPathWithName, quality, (err)=>{
                    if (err) reject(err);

                    resolve(true);
                })
        });
    }

    public rescaleCalc (width: number, height: number, maxWidth: number, maxHeight: number, option: number){
        return new Promise((resolve, reject)=>{
            // 가로, 세로 최대 사이즈 설정
            var resizeWidth = width;
            var resizeHeight = height;

            // 이미지 비율 구하기
            var basisRatio = maxHeight / maxWidth;
            var imgRatio = height / width;

            if (option == 4) {

            } else if ((imgRatio == basisRatio) || (option == 3)) {
                // 기준 비율과 동일한 경우
                // 강제로 크기를 세팅하는 경우

                resizeWidth = maxWidth;
                resizeHeight = maxHeight;

            } else if ((imgRatio > basisRatio) && (height > maxHeight)) {
                // height가 기준 비율보다 길다.

                if (option == 1) {
                    resizeHeight = maxHeight;
                    resizeWidth = Math.round((width * resizeHeight) / height);

                } else if (option == 2) {
                    resizeWidth = maxWidth;
                    resizeHeight = Math.round((height * resizeWidth) / width);

                }

            } else if ((imgRatio < basisRatio) && (width > maxWidth)) {
                // width가 기준 비율보다 길다.

                if (option == 1) {
                    resizeWidth = maxWidth;
                    resizeHeight = Math.round((height * resizeWidth) / width);

                } else if (option == 2) {
                    resizeHeight = maxHeight;
                    resizeWidth = Math.round((width * resizeHeight) / height);

                }

            }

            resolve({resizeWidth, resizeHeight});

        });
    }

    public getUniqueName(){
        return `${moment().format('YYYYMMDD_HHmmss')}_${v4().split('-')[0]}`;
    }
}
