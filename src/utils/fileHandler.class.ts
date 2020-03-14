import * as fs from "fs";
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

    public getUniqueName(){
        console.log(v1());
        console.log(v4());
        return `${moment().format('YYYYMMDD_HHmmss')}_${v4().substr(0, 8)}`;
    }
}
