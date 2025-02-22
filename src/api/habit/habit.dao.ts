import {randomBytes} from "crypto";
import argon2 from "argon2";
import {Inject, Service, Token} from 'typedi';
import mysql from 'mysql';
import TokenInterface from '../../interfaces/token.interface';

import Mysql from '../../loaders/MysqlTemplate';
import MysqlTemplate from '../../utils/database/MysqlTemplate';
import FileHandlerClass from '../../utils/file/fileHandler.class';
import ErrorResponse from '../../utils/response/ErrorResponse';

import UtilsClass from '../../utils/Utils';
import ConfigClass from '../../config/config.dto';
import HabitListDto from './dto/habitList.dto';
import HabitDtoClass from './dto/makeHabit.dto';

@Service()
export default class AuthDAO{

    @Inject('utils')
    private Utils: UtilsClass;
    @Inject()
    private FileHandle: FileHandlerClass;

    @Inject('mysql')
    private mysqlTemp: MysqlTemplate;

    constructor(){}

    public async insertRoom (HabitDto: HabitDtoClass, token: TokenInterface): Promise<any> {

        const [conn, querySync] = await this.mysqlTemp.getConn();

        try{

            let query = `
                INSERT INTO t_nf_habit
                SET ?
            `;

            const insertHabit = await querySync(query, {
                habit_category_seq: HabitDto.habitCategory,
                habit_title: HabitDto.habitTitle,
                habit_goal: HabitDto.habitGoal,
                frequency: HabitDto.frequency,
                period: HabitDto.period,
                start_date: HabitDto.startDate,
                end_date: HabitDto.endDate,
                cert_start: HabitDto.certStart,
                cert_end: HabitDto.certEnd,
                max_join_cnt: HabitDto.maxJoinCnt,
                cert_type: HabitDto.certType.join(','),
                picture_type: HabitDto.pictureType.join(','),
                cert_method: HabitDto.certMethod,
            });

            // console.log(insertHabit)
            if(insertHabit.affectedRows === 0){
                conn.rollback();
                throw new ErrorResponse(500, '[DB] Insert Habit Error', '500');
                return;
            }

            // ==========================================================================================

            query = `
                INSERT INTO t_nf_habit_join
                SET ?
            `;

            const insertJoin = await querySync(query, {
                user_id: token.userId,
                uuid: token.uuid,
                habit_seq: insertHabit.insertId,
                join_status: 100,
                is_leader: 50,
            });

            // console.log(insertJoin)
            if(insertJoin.affectedRows === 0){
                conn.rollback();
                throw new ErrorResponse(500, '[DB] Insert Join Error', '500');
                return;
            }

            // ==========================================================================================

            query = `
                UPDATE t_nf_file
                SET target_type = ?
                    , target_key = ?
                WHERE file_seq = ?
            `;

            if(HabitDto.sampleFileSeq !== 0){
                const updateSampleFile = await querySync(query, ['HABIT_SAMPLE', insertHabit.insertId, HabitDto.sampleFileSeq]);

                // if(updateSampleFile.affectedRows === 0){
                //     conn.rollback();
                //     throw new ErrorResponse(500, '[DB] Update Sample File', '500');
                //     return;
                // }

            }

            if(HabitDto.profileFileSeq !== 0){
                const updateProfileFile = await querySync(query, ['HABIT', insertHabit.insertId, HabitDto.profileFileSeq]);

                // if(updateProfileFile.affectedRows === 0){
                //     conn.rollback();
                //     throw new ErrorResponse(500, '[DB] Update Profile File', '500');
                //     return;
                // }

            }

            conn.commit();

            return insertHabit.insertId;

        }catch (err) {
            console.log(err)
            throw err;
            conn.rollback();

        }finally{
            conn.release();

        }

    }

    public async getRoomList (token: TokenInterface, HabitListDto: HabitListDto): Promise<any> {

        const [conn, querySync] = await Mysql.getConn();

        try{

            let selectTarget = `
                SELECT h.*
                    , hc.category_title
                    , CONVERT(u.uuid, CHAR(50)) AS uuid
                    , u.nick_name
            `;

            let selectCount = `
                SELECT COUNT(1) AS count
            `;

            let body = `
                FROM (
                    SELECT *
                    FROM t_nf_habit h
                    WHERE h.habit_status = 50
                        AND h.start_date > NOW()
                        ${HabitListDto.habitCategory !== 0 ? `
                        AND h.habit_category_seq = ${mysql.escape(HabitListDto.habitCategory)}
                        ` : ``}
                        ${HabitListDto.keyword !== '' ? `
                        AND h.habit_title LIKE ${mysql.escape('%' + HabitListDto.keyword + '%')}
                        ` : ``}
                    ) h
                INNER JOIN t_nf_habit_category hc ON hc.habit_category_seq = h.habit_category_seq
                INNER JOIN t_nf_habit_join hj ON hj.habit_seq = h.habit_seq
                    AND hj.join_status = 100
                    AND hj.is_leader = 50
                INNER JOIN t_nf_user u ON u.user_id = hj.user_id
                    AND u.user_status = 50
            `;

            let foot = `
                ORDER BY h.reg_date DESC
                LIMIT ${(HabitListDto.page - 1) * ConfigClass.itemPerPageCnt}, ${ConfigClass.itemPerPageCnt}
            `;

            const queryList = [
                selectTarget + body + foot,
                selectCount + body
            ];

            // console.log(queryList[0])
            const recordSet = await querySync(queryList.join(';'));
            return [recordSet[0], recordSet[1][0].count];

        }catch (err) {
            console.log(err)
            throw err;
            conn.rollback();

        }finally{
            conn.release();

        }

    }

    public async getRoomBySeq (habitSeq: number, token: TokenInterface): Promise<any> {

        const [conn, querySync] = await this.mysqlTemp.getConn();

        try{

            let query = `
                SELECT h.*
                    , hc.category_title
                    , CONVERT(u.uuid, CHAR(50)) AS uuid
                    , u.nick_name
                FROM (
                    SELECT *
                    FROM t_nf_habit
                    WHERE habit_seq = ?
                    ) h
                INNER JOIN t_nf_habit_category hc ON hc.habit_category_seq = h.habit_category_seq
                INNER JOIN t_nf_habit_join hj ON hj.habit_seq = h.habit_seq
                    AND hj.join_status = 100
                    AND hj.is_leader = 50
                INNER JOIN t_nf_user u ON u.user_id = hj.user_id
                    AND u.user_status = 50
            `;

            const getHabit = await querySync(query, [habitSeq]);

            query = `
                SELECT *
                    , CONVERT(uuid, CHAR(50)) AS uuid
                FROM t_nf_habit_join
                WHERE habit_seq = ?
                    AND user_id = ?
            `;

            const getJoin = await querySync(query, [habitSeq, token.userId]);

            return [getHabit[0], getJoin[0]];

        }catch (err) {
            console.log(err)
            throw err;
            conn.rollback();

        }finally{
            conn.release();

        }

    }

    public async updateRoom (HabitDto: HabitDtoClass, token: TokenInterface): Promise<any> {

        const [conn, querySync] = await Mysql.getConn();

        try{

            let query = `
                UPDATE t_nf_habit
                SET ?
                WHERE habit_seq = ${mysql.escape(HabitDto.habitSeq)}
            `;

            const updateHabit = await querySync(query, {
                habit_category_seq: HabitDto.habitCategory,
                habit_title: HabitDto.habitTitle,
                habit_goal: HabitDto.habitGoal,
                frequency: HabitDto.frequency,
                period: HabitDto.period,
                start_date: HabitDto.startDate,
                end_date: HabitDto.endDate,
                cert_start: HabitDto.certStart,
                cert_end: HabitDto.certEnd,
                max_join_cnt: HabitDto.maxJoinCnt,
                cert_type: HabitDto.certType.join(','),
                picture_type: HabitDto.pictureType.join(','),
                cert_method: HabitDto.certMethod,
            });

            // console.log('updateHabit', updateHabit)
            if(updateHabit.affectedRows === 0){
                conn.rollback();
                throw new ErrorResponse(500, '[DB] Update Habit Error', '500');
                return;
            }

            // ==========================================================================================

            query = `
                UPDATE t_nf_file
                SET target_type = ?
                    , target_key = ?
                WHERE file_seq = ?
            `;

            if(HabitDto.sampleFileSeq !== 0){

                // Delete exist file
                const existSampleFileList = await querySync(`
                    SELECT * 
                    FROM t_nf_file
                    WHERE target_type = 'HABIT_SAMPLE'
                        AND target_key = ? 
                `, [HabitDto.habitSeq]);

                // console.log('existSampleFileList', existSampleFileList)
                if(existSampleFileList.length !== 0){
                    for(let file of existSampleFileList){
                        await this.FileHandle.deleteFile(file.file_path, file.file_name);
                        await this.FileHandle.deleteFile(file.thumb_path, file.thumb_name);
                    }

                    let delteSampleFile = await querySync(`
                        DELETE  
                        FROM t_nf_file
                        WHERE file_seq IN (?) 
                    `, [existSampleFileList.map((val: any) => val.file_seq)]);

                    // console.log(delteSampleFile)
                }

                // Update temp file
                const updateSampleFile = await querySync(query, ['HABIT_SAMPLE', HabitDto.habitSeq, HabitDto.sampleFileSeq]);

                // console.log('updateSampleFile', updateSampleFile)
                if(updateSampleFile.affectedRows === 0){
                    conn.rollback();
                    throw new ErrorResponse(500, '[DB] Update Sample File', '500');
                    return;
                }

            }

            if(HabitDto.profileFileSeq !== 0){

                // Delete exist file
                const existProfileFileList = await querySync(`
                    SELECT * 
                    FROM t_nf_file
                    WHERE target_type = 'HABIT'
                        AND target_key = ? 
                `, [HabitDto.habitSeq]);

                // console.log('existProfileFileList', existProfileFileList)
                if(existProfileFileList.length !== 0){
                    for(let file of existProfileFileList){
                        await this.FileHandle.deleteFile(file.file_path, file.file_name);
                        await this.FileHandle.deleteFile(file.thumb_path, file.thumb_name);
                    }
                    await querySync(`
                        DELETE  
                        FROM t_nf_file
                        WHERE file_seq IN (?) 
                    `, [existProfileFileList.map((val: any) => val.file_seq)]);
                }

                // Update temp file
                const updateProfileFile = await querySync(query, ['HABIT', HabitDto.habitSeq, HabitDto.profileFileSeq]);

                // console.log('updateProfileFile', updateProfileFile)
                if(updateProfileFile.affectedRows === 0){
                    conn.rollback();
                    throw new ErrorResponse(500, '[DB] Update Profile File', '500');
                    return;
                }

            }

            conn.commit();

            return true;

        }catch (err) {
            console.log(err)
            throw err;
            conn.rollback();

        }finally{
            conn.release();

        }

    }

    public async deleteRoom (habitSeq: number, token: TokenInterface): Promise<any> {

        const [conn, querySync] = await Mysql.getConn();

        try{

            let query = `
                UPDATE t_nf_habit
                SET habit_status = 10
                WHERE habit_seq = ?
            `;

            const deleteHabit = await querySync(query, [habitSeq]);

            if(deleteHabit.affectedRows === 0){
                conn.rollback();
                throw new ErrorResponse(500, '[DB] Update Habit Error', '500');
                return;
            }

            conn.commit();

            return true;

        }catch (err) {
            console.log(err)
            throw err;
            conn.rollback();

        }finally{
            conn.release();

        }

    }

    // ==============================================================================================

    public async categoryValidCheck (categorySeq: number): Promise<any> {

        let query =`
            SELECT *
            FROM t_nf_habit_category hc
            WHERE hc.category_status = 50
                AND hc.habit_category_seq = ?
            `;

        const recordSet = await this.mysqlTemp.query(query, [categorySeq]);

        return recordSet[0];

    }

    public async getHabitCategory (): Promise<any> {

        let query = `
            SELECT *
            FROM t_nf_habit_category
            WHERE category_status = 50
            ORDER BY order_num ASC
        `;

        // const [conn, querySync] = await Mysql.getConn();
        //
        // const recordSet = querySync();
        //
        // conn.commit();
        // conn.release();

        const recordSet = await Mysql.exec(query);

        return recordSet;

    }

}
