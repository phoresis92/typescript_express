import {Inject} from 'typedi';

export default class contentsQuery{
    @Inject('mysql')
    private mysql

    constructor(){}

    public create = () => {
        let query =
            `INSERT INTO t_nf_log_error 
            (
                status_code, server, id, 
                method, path, header, 
                params, query, payload, 
                response
            )
            VALUES 
            (
            ?, ?, ?, 
            ?, ?, ?, 
            ?, ?, ?, 
            ?
            ) `;

        return query;
    }

}
