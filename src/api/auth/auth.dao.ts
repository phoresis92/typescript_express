import {randomBytes} from "crypto";
import argon2 from "argon2";
import {Inject, Service} from 'typedi';

import Mysql from '../../loaders/MysqlTemplate';
import ErrorResponse from '../../utils/response/ErrorResponse';

import UtilsClass from '../../utils/utils';

@Service()
export default class AuthDAO{

    @Inject('utils')
    private Utils: UtilsClass;

    constructor(){}

    public async getUserLoginById (loginId: string, statusCheck?: boolean): Promise<any> {

        let query =`
            SELECT *
            FROM t_nf_user_login l
            WHERE l.login_id = ?
            `;

        if(statusCheck){
            query = `
                SELECT l.*
                FROM (${query}) l
                INNER JOIN t_nf_user u ON u.user_id = l.user_id
                    AND u.user_status = 50
            `
        }

        const recordSet = await Mysql.exec(query, [loginId]);

        return recordSet[0];

    }

    public async getUserByUserId (userId: string): Promise<any> {

        let query =`
            SELECT *
            FROM t_nf_user u
            WHERE u.user_id = ?
            `;

        const recordSet = await Mysql.exec(query, [userId]);

        return recordSet[0];

    }

    public async getSessionBySessionId (sessionId: string): Promise<any> {

        let query =`
            SELECT us.*, (us.push_set + 0) AS push_num
            FROM t_nf_user_session us
            WHERE us.session_id = ?
            `;

        const recordSet = await Mysql.exec(query, [sessionId]);

        return recordSet[0];

    }

    public async getSessionByLoginGroup (userId: string, loginGroup: string): Promise<any> {

        let query =`
            SELECT us.*, (us.push_set + 0) AS push_num
            FROM t_nf_user_session us
            WHERE us.user_id = ?
                AND us.login_group = ?
            `;

        const recordSet = await Mysql.exec(query, [userId, loginGroup]);

        return recordSet[0];

    }

    public async deleteSessionByUserIdAndLoginGroup (userId: string, loginGroup: string): Promise<any> {

        let query =`
            DELETE FROM t_nf_user_session
            WHERE user_id = ?
                AND login_group = ?
            `;

        const recordSet = await Mysql.exec(query, [userId, loginGroup]);

        return recordSet;

    }

    public async deleteSessionBySessionId (sessionId: string): Promise<any> {

        let query =`
            DELETE FROM t_nf_user_session
            WHERE session_id = ?
            `;

        const recordSet = await Mysql.exec(query, [sessionId]);

        return recordSet;

    }

    public async insertSession (sessionId: string, userId: string, osType: string, osVersion: string, appVersion: string, pushKey: string): Promise<any> {

        let query =`
            INSERT IGNORE INTO t_nf_user_session
            SET session_id = ?
                , user_id = ?
                , login_group = ?
                , os_type = ?
                , os_version = ?
                , app_version = ?
                , push_key = ?
            `;

        const recordSet = await Mysql.exec(query, [sessionId, userId, (osType === 'AOD' || osType === 'IOS' ? 'MOBILE' : (osType === 'WEB' ? 'WEB' : 'ETC')), osType, osVersion, appVersion, pushKey]);

        return recordSet;

    }

    public async updateLastLoginDate (sessionId: string, pushKey: string, userId: string): Promise<any> {

        let updateSession =`
            UPDATE t_nf_user_session
            SET push_key = ?
                , last_date = NOW()
                , refresh_date = NOW()
            WHERE session_id = ?
            `;

        const updateSessionResult = await Mysql.exec(updateSession, [pushKey, sessionId]);

        let updateLogin = `
            UPDATE t_nf_user_login ul
            SET last_date = NOW()
            WHERE user_id = ?
        `;

        const updateLoginResult = await Mysql.exec(updateLogin, [userId]);


        return {updateSessionResult, updateLoginResult};

    }

    public async signupUser (joinType: string, nickName: string, loginId: string, password: string, agreeUse: number, agreePersonalInfo: number): Promise<{uuid: any, user_id: number}> {

        let hashedPassword: string | null;

        if(joinType !== 'NORMAL'){
            hashedPassword = null;

        }else{
            const salt = randomBytes(32);
            hashedPassword = await argon2.hash(password, { salt });

        }

        const uuid = this.Utils.makeUserId();
        let user_id: number;

        const [conn, querySync] = await Mysql.getConnTransaction();

        try{

            let insertUser =`
                INSERT t_nf_user
                SET uuid = ?
                    , user_type = 'USER'
                    , nick_name = ?
                    , agree_use = ?
                    , agree_use_date = ${agreeUse === 1 ? `NOW()` : `NULL`} 
                    , agree_personal_info = ?
                    , agree_personal_info_date = ${agreePersonalInfo === 1 ? `NOW()` : `NULL`} 
            `;

            const insertUserResult = await querySync(insertUser, [uuid, nickName, agreeUse, agreePersonalInfo]);
            if(insertUserResult.affectedRows === 0){
                conn.rollback();
            }

            user_id = insertUserResult.insertId;

            let insertUserLogin = `
                INSERT t_nf_user_login
                SET ?
            `;

            const insertLoginResult = await querySync(insertUserLogin, {join_type: joinType, login_id: loginId, uuid, user_id: insertUserResult.insertId, password: hashedPassword}/*[joinType, loginId, uuid, insertUserResult.insertId]*/);
            if(insertLoginResult.affectedRows === 0){
                conn.rollback();
            }

            await conn.commit();

        }catch(e){
            await conn.rollback();
            throw new ErrorResponse(500, e.message, '500');
        }finally{
            await conn.release();
        }

        return {uuid, user_id};

    }

}
