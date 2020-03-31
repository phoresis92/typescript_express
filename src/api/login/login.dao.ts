import {Service} from 'typedi';
import {query} from 'winston';
import Mysql from '../../loaders/MysqlTemplate';

@Service()
export default class LoginDAO{

    constructor(){}

    public async getUserLoginById (loginId: string): Promise<any> {

        let query =`
            SELECT *
            FROM t_nf_user_login l
            WHERE l.login_id = ?
            `;

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

}
