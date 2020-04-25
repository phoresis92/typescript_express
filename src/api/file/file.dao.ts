import {Service} from 'typedi';
import {query} from 'winston';
import Mysql from '../../loaders/MysqlTemplate';
import {FileResponseClass} from './file.service';

@Service()
export default class FileDAO{

    constructor(){}

    public async insertFile (returnObj: FileResponseClass) {
        const recordSet = await Mysql.commit(returnObj.insertFile());
        return recordSet.insertId;

    }

}
