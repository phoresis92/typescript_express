import {randomBytes} from "crypto";
import argon2 from "argon2";
import {Inject, Service, Token} from 'typedi';
import mysql from 'mysql';
import TokenInterface from '../../interfaces/token.interface';

import Mysql from '../../loaders/MysqlTemplate';
import FileHandlerClass from '../../utils/file/fileHandler.class';
import ErrorResponse from '../../utils/response/ErrorResponse';

import UtilsClass from '../../utils/utils';
import ConfigClass from '../../config/config.dto';
import MemberStatusDtoClass from './dto/memberStatus.dto';

@Service()
export default class HabitJoinDAO{

    @Inject('utils')
    private Utils: UtilsClass;
    @Inject()
    private Config: ConfigClass;
    @Inject()
    private FileHandle: FileHandlerClass;

    constructor(){}

    public async insertHabitJoin (habitSeq: number, token: TokenInterface): Promise<any> {

        const [conn, querySync] = await Mysql.getConn();

        try{

            let query = `
                INSERT INTO t_nf_habit_join (user_id, uuid, habit_seq)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    join_status = 10
                    , is_leader = 0
                    , mod_date = NOW()
            `;

            const insertHabit = await querySync(query, [token.userId, token.uuid, habitSeq]);

            // console.log(insertHabit)
            if(insertHabit.affectedRows === 0){
                conn.rollback();
                throw new ErrorResponse(500, '[DB] Insert Habit Error', '500');
                return;
            }

            // ==========================================================================================

            conn.commit();

            return true;

        }catch (err) {
            throw err;
            conn.rollback();

        }finally{
            conn.release();

        }

    }

    public async cancelHabitJoin (habitSeq: number, token: TokenInterface): Promise<any> {

        const [conn, querySync] = await Mysql.getConn();

        try{

            let query = `
                UPDATE t_nf_habit_join
                SET join_status = 0
                    , mod_date = NOW()
                WHERE user_id = ?
                    AND habit_seq = ?
            `;

            const cancelHabit = await querySync(query, [token.userId, habitSeq]);

            // console.log(insertHabit)
            if(cancelHabit.affectedRows === 0){
                conn.rollback();
                throw new ErrorResponse(500, '[DB] Update Habit Error', '500');
                return;
            }

            // ==========================================================================================

            conn.commit();

            return true;

        }catch (err) {
            throw err;
            conn.rollback();

        }finally{
            conn.release();

        }

    }

    public async withdrawHabitJoin (habitSeq: number, token: TokenInterface): Promise<any> {

        const [conn, querySync] = await Mysql.getConn();

        try{

            let query = `
                UPDATE t_nf_habit_join
                SET join_status = 70
                    , mod_date = NOW()
                WHERE user_id = ?
                    AND habit_seq = ?
            `;

            const withdrawHabit = await querySync(query, [token.userId, habitSeq]);

            // console.log(insertHabit)
            if(withdrawHabit.affectedRows === 0){
                conn.rollback();
                throw new ErrorResponse(500, '[DB] Withdraw Habit Error', '500');
                return;
            }

            // ==========================================================================================

            query = `
                UPDATE t_nf_habit h
                SET join_cnt = (
                    SELECT COUNT(1)
                    FROM t_nf_habit_join
                    WHERE habit_seq = h.habit_seq
                        AND join_status = 100 
                    )
                WHERE habit_seq = ?
            `;

            const joinCntUpdate = await querySync(query, [habitSeq]);
            if(joinCntUpdate.affectedRows === 0){
                conn.rollback();
                throw new ErrorResponse(500, '[DB] Join Count Update Error', '500');
                return;
            }

            conn.commit();

            return true;

        }catch (err) {
            throw err;
            conn.rollback();

        }finally{
            conn.release();

        }

    }

    // ========================================================================================================================

    public async memberList (habitSeq: number, token: TokenInterface, page:number, listType:number, permission: string[]): Promise<any> {

        const [conn, querySync] = await Mysql.getConn();

        try{

            let selectTarget = `
                SELECT
                    user_id,
                    CONVERT(uuid, CHAR(50)) AS uuid,
                    habit_seq,
                    join_status,
                    is_leader,
                    mod_date,
                    reg_date
            `;

            let selectCount = `
                SELECT COUNT(1) AS count
            `;

            let body = `
                FROM t_nf_habit_join hj
                WHERE hj.habit_seq = ${mysql.escape(habitSeq)}
                    AND hj.join_status IN (${mysql.escape(permission)})
                    AND hj.user_id != ${mysql.escape(token.userId)}
                    ${listType === 1 ? `` : (listType === 2 ? `
                        AND hj.join_status = 100
                    ` : `
                        AND hj.join_status = 10
                    `)}
            `;

            let foot = `
                ORDER BY hj.reg_date DESC
                LIMIT ${(page - 1) * this.Config.itemPerPageCnt}, ${this.Config.itemPerPageCnt}
            `;

            const queryList = [
                `
                    SELECT 
                        u.nick_name
                        , i.uuid
                        , i.join_status
                        , i.is_leader
                        , i.mod_date
                        , CONCAT(f.file_path, f.file_name) AS file_path
                        , CONCAT(f.thumb_path, f.thumb_name) AS thumb_path
                    FROM (${selectTarget + body + foot}) i
                    INNER JOIN t_nf_user u ON u.user_id = i.user_id
                        AND u.user_status = 50
                    LEFT JOIN t_nf_file f ON f.target_type = 'USER'
                        AND f.target_key = u.uuid
                `,
                selectCount + body
            ];

            // console.log(queryList[0])
            const recordSet = await querySync(queryList.join(';'));
            conn.commit();
            return [recordSet[0], recordSet[1][0].count];

            // const memberList = await querySync(query, [habitSeq, permission]);

            // ==========================================================================================


            // return memberList;

        }catch (err) {
            throw err;
            conn.rollback();

        }finally{
            conn.release();

        }

    }

    public async getTargetStatus (MemberStatus: MemberStatusDtoClass, token: TokenInterface, targetUserData: any): Promise<any> {

        const [conn, querySync] = await Mysql.getConn();

        try{

            let query = `
                SELECT *
                    , CONVERT(uuid, CHAR(50)) AS uuid
                FROM t_nf_habit_join
                WHERE habit_seq = ?
                    AND user_id = ?
            `;

            const targetJoin = (await querySync(query, [MemberStatus.habitSeq, targetUserData.user_id]))[0];

            conn.commit();
            return targetJoin;

        }catch (err) {
            throw err;
            conn.rollback();

        }finally{
            conn.release();

        }

    }

    public async changeTargetStatus (habitSeq: number, userId: number, changeStatus: number): Promise<any> {

        const [conn, querySync] = await Mysql.getConn();

        try{

            let query = `
                UPDATE t_nf_habit_join
                SET join_status = ?
                    , mod_date = NOW()
                WHERE user_id = ?
                    AND habit_seq = ?
            `;

            const updateStatus = await querySync(query, [changeStatus, userId, habitSeq]);

            // console.log(insertHabit)
            if(updateStatus.affectedRows === 0){
                conn.rollback();
                throw new ErrorResponse(500, '[DB] Update Status Error', '500');
                return;
            }

            // ==========================================================================================

            query = `
                UPDATE t_nf_habit h
                SET join_cnt = (
                    SELECT COUNT(1)
                    FROM t_nf_habit_join
                    WHERE habit_seq = h.habit_seq
                        AND join_status = 100 
                    )
                WHERE habit_seq = ?
            `;

            const joinCntUpdate = await querySync(query, [habitSeq]);
            if(joinCntUpdate.affectedRows === 0){
                conn.rollback();
                throw new ErrorResponse(500, '[DB] Join Count Update Error', '500');
                return;
            }

            conn.commit();

            return true;

        }catch (err) {
            throw err;
            conn.rollback();

        }finally{
            conn.release();

        }

    }

}
