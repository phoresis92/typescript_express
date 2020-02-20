import {Inject} from 'typedi';

export default class contentsQuery{
    constructor(
        @Inject('mysql')
        private mysql
    ){}

    public create = () => {
        let query =
            `INSERT INTO t_nf_contents (serial_number, contents_type, phone_number)
             VALUES (?, 'CONTENTS', ?) `;

        return query;
    }

    public bySerial = (page) => {
        let query =
            `SELECT *
            FROM t_nf_contents c
            WHERE serial_number = ?
                OR contents_type = 'NOTICE'
            ORDER BY contents_seq DESC 
            LIMIT ${(page - 1) * 10}, 10 `;

        return query;
    }

    public imgFile = (contentsSeq) =>{
        let query = 
            `SELECT f.*
             FROM t_nf_file f WHERE f.target_type = 'CONTENTS'
                AND f.target_key = ${contentsSeq}`;
        
        return query;
    }

    public notice = () =>{
        let query =
            `SELECT *
            FROM t_nf_contents c
            WHERE c.contents_type = 'NOTICE'
            ORDER BY c.contents_seq DESC
            LIMIT 1 `;

        return query;
    }

    public updateFile = () =>{
        let query =
            `UPDATE t_nf_file  
            SET target_type = 'CONTENTS',
                target_key = ? 
            WHERE file_seq IN ( ? )`;

        return query;
    }
}
