import {Inject} from 'typedi';
import Mysql from 'mysql';

export default class contentsQuery{
    @Inject('mysql')
    private mysql: Mysql

    constructor(){}

    public getById = () => {
        let query =
            `SELECT *
            FROM t_nf_user_login l
            WHERE l.login_id = ? `;

        return query;
    }

    public getSession = (column) => {
        let query =
            `SELECT *
            FROM t_nf_user_session us
            WHERE us.${column} = ? `;

        return query;
    }

    public deleteSession = () => {
        let query =
            `DELETE FROM t_nf_user_session
            WHERE session_id = ? `;

        return query;
    }

    public insertUpdateSession = () => {
        let query =
            `INSERT INTO t_nf_user_session (
            session_id, user_id, os_type, 
            os_version, app_version, device_name, 
            push_key, last_date, refresh_date)
            VALUES (
            ?, ?, ?,
            ?, ?, ?,
            ?, NOW(), NOW())
            ON DUPLICATE KEY UPDATE
            os_type = VALUES(os_type),
            os_version = VALUES(os_version),
            app_version = VALUES(app_version),
            device_name = VALUES(device_name),
            push_key = VALUES(push_key),
            last_date = NOW(),
            refresh_date = NOW()`;

        return query;
    }

}
