import {Inject} from 'typedi';

export default class contentsQuery{
    constructor(
        @Inject('mysql')
        private mysql
    ){}

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
