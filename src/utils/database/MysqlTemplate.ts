
import {ConnectionConfig, createPool, MysqlError, Connection, Pool, PoolConnection, escape} from 'mysql';
import moment from 'moment';
import {Inject} from 'typedi';
import {Logger} from 'winston';
import ConfigClass from '../../config/config.dto';
import {promisify} from 'util';

export default class MysqlTemplate {

    @Inject()
    private logger: Logger;

    private pool1: Pool;
    private pool2: Pool;

    public static escape = escape;

    private static instance: MysqlTemplate;

    private constructor(){
        this.createPool();
    }

    public static getInstance (): MysqlTemplate{
        if(!this.instance){
            this.instance = new MysqlTemplate();
        }

        return this.instance;
    }

    private createPool(){

        const dbConfig1: ConnectionConfig = {
            host: ConfigClass.mysqlHost,
            port: ConfigClass.mysqlPort,
            user: ConfigClass.mysqlUser,
            password: ConfigClass.mysqlPassword,
            database: ConfigClass.mysqlDb,
            dateStrings: ConfigClass.mysqlDateStrings,
            charset: ConfigClass.mysqlCharSet,
            multipleStatements: true
        };

        const dbConfig2: ConnectionConfig = {
            host: ConfigClass.mysqlHost,
            port: ConfigClass.mysqlPort,
            user: ConfigClass.mysqlUser,
            password: ConfigClass.mysqlPassword,
            database: ConfigClass.mysqlDb,
            dateStrings: ConfigClass.mysqlDateStrings,
            charset: ConfigClass.mysqlCharSet,
        };

        this.pool1 = createPool(dbConfig1);
        this.pool2 = createPool(dbConfig2);

    }





    /*exports.get = function (query, next) {
        return new Promise((resolve, reject) => {
            if (!query) {
                resolve([]);
            }
            try {
                var strQuery = query.join(';');

                pool.getConnection(function (err, conn) {
                    if (err) {
                        console.log('getConn : ', query);
                        //logger.error("poolConnect:"+err);
                        try {
                            conn.release();
                        } catch (e) {
                        } //logger.error("poolConnect conn.release:"+e); }
                        throw err;
                    }
                    conn.query(strQuery, function (err, rows) {
                        if (err) {
                            console.log('queryErr : ', query);
                            try {
                                conn.release();
                            } catch (e) {
                            } //logger.error("poolClose:"+e); }
                            throw err;
                        } else {
                            try {
                                conn.release();
                            } catch (e) {
                            } //logger.error("poolClose:"+e); }
                            if (query.length === 1) {
                                rows = [rows]
                            }
                            resolve(rows)
                        }
                    });
                });
            } catch (e) {
                console.log(query);
                reject(e)
            }

        })

    };*/


    public query = async (query: string, args?: Array<any>): Promise<any> => {

        try{

            const getConnSync = promisify(this.pool1.getConnection).bind(this.pool1);
            const conn = await getConnSync();

            try {

                const querySync = promisify(conn.query).bind(conn);
                // @ts-ignore
                const recordSet = await querySync(query, args);

                return recordSet;

            }catch (err) {

            }finally {
                conn.release();
            }


        }catch(err){
            this.logger.error(`MysqlTemplate.query:\n\t${err.message}`);
            throw err;
        }

    };

    public getConn = async (): Promise<any> => {

        try{

            const getConnSync = promisify(this.pool1.getConnection).bind(this.pool1);
            const conn = await getConnSync();

            await conn.beginTransaction();

            try {

                const querySync = promisify(conn.query).bind(conn);
                return [conn, querySync];

            }catch (err) {
                throw err;
            }finally {
                // conn.release();
            }


        }catch(err){

        }

    };

}




/*



const {promisify} = require('util');

const config = new (require('../config/config.dto').default)();

var DbConfig: mysql.ConnectionConfig = {
    host: config.mysqlHost,
    port: config.mysqlPort,
    user: config.mysqlUser,
    password: config.mysqlPassword,
    database: config.mysqlDb,
    dateString: config.dataString,
    charset: config.charSet
};

var DbConfig2 = {
    host: config.mysqlHost,
    port: config.mysqlPort,
    user: config.mysqlUser,
    password: config.mysqlPassword,
    database: config.mysqlDb,
    dataString: config.dataString,
    charset: config.charSet
};

DbConfig2.multipleStatements = true;

var pool = Mysql.createPool(DbConfig2);
var pool2 = Mysql.createPool(DbConfig);

exports.escape = Mysql.escape;

exports.get = function (query, next) {
    return new Promise((resolve, reject) => {
        if (!query) {
            resolve([]);
        }
        try {
            var strQuery = query.join(';');

            pool.getConnection(function (err, conn) {
                if (err) {
                    console.log('getConn : ', query);
                    //logger.error("poolConnect:"+err);
                    try {
                        conn.release();
                    } catch (e) {
                    } //logger.error("poolConnect conn.release:"+e); }
                    throw err;
                }
                conn.query(strQuery, function (err, rows) {
                    if (err) {
                        console.log('queryErr : ', query);
                        try {
                            conn.release();
                        } catch (e) {
                        } //logger.error("poolClose:"+e); }
                        throw err;
                    } else {
                        try {
                            conn.release();
                        } catch (e) {
                        } //logger.error("poolClose:"+e); }
                        if (query.length === 1) {
                            rows = [rows]
                        }
                        resolve(rows)
                    }
                });
            });
        } catch (e) {
            console.log(query);
            reject(e)
        }

    })

};

exports.getSingle = function (query, next) {

    try {
        pool2.getConnection(function (err, conn) {
            if (err) {
                console.log('getConn : ', query);
                //logger.error("poolConnect:"+err);
                try {
                    conn.release();
                } catch (e) {
                } //logger.error("poolConnect conn.release:"+e); }
                throw err;
            }
            conn.query(query, function (err, rows) {
                if (err) {
                    console.log('queryErr : ', query);
                    try {
                        conn.release();
                    } catch (e) {
                    } //logger.error("poolClose:"+e); }
                    throw err;
                } else {
                    try {
                        conn.release();
                    } catch (e) {
                    } //logger.error("poolClose:"+e); }
                    next(rows);
                }
            });
        });
    } catch (e) {
        console.log(query);
        throw err;
    }
};

exports.exec = function (query, params, next) {
    return new Promise((resolve, reject) => {
        try {
            pool.getConnection(function (err, conn) {
                if (err) {
                    try {
                        conn.release();
                    } catch (e) {
                    } //logger.error("poolConnect conn.release:"+e); }
                    throw err;
                }
                conn.query(query, params, function (err, result) {
                    if (err) {
                        try {
                            conn.release();
                        } catch (e) {
                        } //logger.error("poolClose:"+e); }
                        throw err;
                    } else {
                        try {
                            conn.release();
                        } catch (e) {
                        } //logger.error("poolClose:"+e); }
                        // next(result);
                        resolve(result)
                    }
                });
                //console.log(result);
            });
        } catch (e) {
            //logger.error(e);
            console.log(query);
            // throw err;
            reject(err)
        }
    })

};

// 트랜젝션 : 실패시 롤백, 성공시 커밋
exports.commit = function (query, next) {
    return new Promise((resolve, reject) => {
        var strQuery = query;
        if (Array.isArray(query))
            strQuery = query.join(';');

        try {
            pool.getConnection(function (err, conn) {
                if (err) {
                    try {
                        conn.release();
                    } catch (e) {
                    }
                    throw err;
                }
                conn.beginTransaction(function (err) {
                    if (err) {
                        throw err;
                    }

                    conn.query(strQuery, function (err, result) {
                        if (err) {
                            conn.rollback(function () {
                                try {
                                    conn.release();
                                } catch (e) {
                                }
                                throw err;
                            });
                        }

                        if ((!Array.isArray(query) && Array.isArray(result[0])) || (Array.isArray(query) && query.length > 1 && query.length !== result.length)) {
                            conn.rollback(function () {
                                var nowTime = moment().format('YYYY-MM-DD hh:mm:ss');
                                console.log('Warning! Detecting query attack [', nowTime, '] -', strQuery);

                                try {
                                    conn.release();
                                } catch (e) {
                                }
                                throw err;
                            });

                        } else {
                            conn.commit(function (err) {
                                if (err) {
                                    conn.rollback(function () {
                                        try {
                                            conn.release();
                                        } catch (e) {
                                        }
                                        throw err;
                                    });

                                } else {
                                    try {
                                        conn.release();
                                    } catch (e) {
                                    }
                                    resolve(result)
                                }
                            });
                        }
                    });
                });
            });

        } catch (e) {
            console.log(query);
            reject(e)

        }

    })

};

exports.getConnTransaction = function () {
    return new Promise((resolve, reject) => {
        try {
            pool.getConnection(async (err, conn) => {
                if (err) {
                    try {
                        conn.release();
                    } catch (e) {
                    }
                    reject(err);
                    throw err;

                }

                await conn.beginTransaction();

                const querySync = promisify(conn.query).bind(conn);

                resolve([conn, querySync]);

            })

        } catch (e) {
            console.log(e);
            reject(e)

        }
    })
}
*/
