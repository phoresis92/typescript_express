import {Inject} from 'typedi';
import Mysql from 'mysql';
import PushInterface from '../../interfaces/push.interface';

export default class contentsQuery{
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
            user_id, 'ADMIN', ${this.mysql.escape(Push.position)},
            'NOTICE', ${this.mysql.escape(Push.targetKey)},
            ${this.mysql.escape(Push.opt1)}, ${this.mysql.escape(Push.opt2)}, ${this.mysql.escape(Push.opt3)},
            ${this.mysql.escape(Push.opt4)}, ${this.mysql.escape(Push.opt5)}
            FROM t_nf_user_login ul
            WHERE ul.user_id != 'pumpcar_admin' 
                AND ul.status = 50 `;

        return [head+body, body];
    }

    public checkPushSet = () => {
        let query =
            `SELECT 
            FROM t_nf_user_session us
            WHERE us.user_id = ?
            #    AND us.push_set & 1 `
    }

    public getCountBadge = () => {
        let query =
            `SELECT *
            FROM t_nf_user_alarm ua
            WHERE ua.user_id = ?
                AND ua.is_read = 0`;

        return query;
    }

}
