import {Inject} from 'typedi';
import Mysql from 'mysql';

export default class versionQuery{
    @Inject('mysql')
    private mysql: Mysql;

    constructor(){}

    public recent = () => {
        let query =
            `SELECT *
            FROM t_nf_version v
            WHERE v.version_type = ?
            ORDER BY v.version_seq DESC 
            LIMIT 1 `;

        return query;
    }
}
