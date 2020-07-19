import {randomBytes} from "crypto";
import argon2 from "argon2";
import {Inject, Service} from 'typedi';
import mysql from 'mysql';
import TokenInterface from '../../interfaces/token.interface';

import Mysql from '../../loaders/MysqlTemplate';
import FileHandlerClass from '../../utils/file/fileHandler.class';
import ErrorResponse from '../../utils/response/ErrorResponse';

import UtilsClass from '../../utils/Utils';
import SignupDto from '../auth/dto/signup.dto';
import ProfileDtoClass from './dto/profile.dto';

@Service()
export default class UserDao{

    @Inject('utils')
    private Utils: UtilsClass;
    @Inject()
    private FileHandle: FileHandlerClass;

    constructor(){}


    public async updateProfile (ProfileDto: ProfileDtoClass, token: TokenInterface): Promise<any> {

        const [conn, querySync] = await Mysql.getConn();

        try{

            /** Update Nickname **/
            {
                let updateProfile = `
                    UPDATE t_nf_user
                    SET nick_name = ?
                    WHERE user_id = ?
                `;

                const updateProfileResult = await querySync(updateProfile, [ProfileDto.nickName, token.userId]);
                if(updateProfileResult.affectedRows === 0){
                    conn.rollback();
                    throw new ErrorResponse(500, '[Error] Insert User', '500');
                    return;
                }
            }

            /** Update Profile Image **/
            if(ProfileDto.fileSeq !== 0){

                // Get exist file
                const existUserProfileList = await querySync(`
                    SELECT * 
                    FROM t_nf_file
                    WHERE target_type = 'USER'
                        AND target_key = ? 
                `, [token.uuid]);

                // Update temp file
                const updateProfile = await querySync(`
                    UPDATE t_nf_file
                    SET target_type = 'USER'
                        , target_key = ?
                    WHERE file_seq = ?
                `, [token.uuid, ProfileDto.fileSeq]);

                // console.log('updateSampleFile', updateSampleFile)
                if(updateProfile.affectedRows === 0){
                    conn.rollback();
                    throw new ErrorResponse(500, '[DB] Update Profile', '500');
                    return;
                }

                // console.log('existSampleFileList', existSampleFileList)
                if(existUserProfileList.length !== 0){
                    for(let file of existUserProfileList){
                        await this.FileHandle.deleteFile(file.file_path, file.file_name);
                        await this.FileHandle.deleteFile(file.thumb_path, file.thumb_name);
                    }

                    await querySync(`
                        DELETE  
                        FROM t_nf_file
                        WHERE file_seq IN (?) 
                    `, [existUserProfileList.map((val: any) => val.file_seq)]);

                }

            }

            await conn.commit();
            return true;

        }catch(e){
            await conn.rollback();
            throw new ErrorResponse(500, e.message, '500');
        }finally{
            await conn.release();
        }

    }

}
