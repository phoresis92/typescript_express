import {Inject} from 'typedi';
import Mysql from 'mysql';
import PushInterface from '../../../interfaces/push.interface';

export default class PushQuery{
    @Inject('mysql')
    private mysql: Mysql

    constructor(){}

    public pushAllUser = (Push: PushInterface) => {
        let head =
            `INSERT INTO t_nf_user_alarm (
            user_id, sender_id, position, 
            target_type, target_key, 
            option1, option2, option3,
            option4, option5)
            `;

        let body =
            `SELECT 
            user_id AS user_id
            , 'ADMIN' AS sender
            , ${Mysql.escape(Push.position)} AS position
            , 'NOTICE' AS target_type
            , ${Mysql.escape(Push.targetKey)} AS target_key
            , ${Mysql.escape(Push.opt1)} AS opt1
            , ${Mysql.escape(Push.opt2)} AS opt2
            , ${Mysql.escape(Push.opt3)} AS opt3
            , ${Mysql.escape(Push.opt4)} AS opt4
            , ${Mysql.escape(Push.opt5)} AS opt5
            FROM t_nf_user_login ul
            WHERE ul.user_id != 'pumpcar_admin' 
                AND ul.status = 50 `;

        // console.log(head+body)
        // console.log(body)
        return [head+body, body];
    }

    public pushAdmin = (Push: PushInterface) => {
        let head =
            `INSERT INTO t_nf_user_alarm (
            user_id, sender_id, position, 
            target_type, target_key, 
            option1, option2, option3,
            option4, option5)
            `;

        let body =
            `SELECT 
            ul.user_id AS user_id
            , ${Mysql.escape(Push.sender)} AS sender
            , ${Mysql.escape(Push.position)} AS position
            , 'CONTENTS' AS target_type
            , ${Mysql.escape(Push.targetKey)} AS target_key
            , ${Mysql.escape(Push.opt1)} AS opt1
            , ${Mysql.escape(Push.opt2)} AS opt2
            , ${Mysql.escape(Push.opt3)} AS opt3
            , ${Mysql.escape(Push.opt4)} AS opt4
            , ${Mysql.escape(Push.opt5)} AS opt5
            FROM t_nf_user_login ul
            WHERE ul.user_id = 'pumpcar_admin' `;
        // -- AND ul.status = 50

        // console.log(head+body)
        // console.log(body)
        return [head+body, body];
    }

    public checkPushSet = () => {
        let query =
            `SELECT *
            FROM t_nf_user_session us
            WHERE us.user_id = ?
            #    AND us.push_set & 1 
            `;

        return query;
    }

    public getCountBadge = () => {
        let query =
            `SELECT IFNULL(COUNT(1), 0) AS badge
            FROM t_nf_user_alarm ua
            WHERE ua.user_id = ?
                AND ua.is_read = 0
                `;

        return query;
    }

}
