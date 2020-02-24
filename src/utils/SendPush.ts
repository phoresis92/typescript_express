import {Inject} from "typedi";
import Mysql from "mysql";
import PushQuery from "./service/push.query";
import config from "../config";

import FCM from 'fcm-node';
var serverKey = globalConfig.PUSH_FCM;
const fcm = new FCM(serverKey);

export default class SendPush {
    @Inject('mysql')
    private mysql: Mysql;

    private pushQuery = new PushQuery();

    constructor(private PushObj, private position: string, private targetKey: string, private targetType: string){}

    public async send(){
        const sessionList = await this.mysql.exec(this.pushQuery.checkPushSet(), [this.PushObj.user_id]);
        const countBadge = await this.mysql.exec(this.pushQuery.getCountBadge(), [this.PushObj.user_id]);

        sessionList.map((session, idx)=>{
            let pushObj = {
                sound: session.push_sound,

                position: this.position,
                type: this.targetType,
                key: this.targetKey,
                badge: countBadge,

                message: '',

                add1: this.PushObj.add1,
                add2: this.PushObj.add2,
                add3: this.PushObj.add3,
            };

            pushObj.message = new PushMessage()
                .setPosition(this.position)
                .setLanguage("KOR")
                .setOpt1(this.PushObj.opt1)
                .setOpt2(this.PushObj.opt2)
                .setOpt3(this.PushObj.opt3)
                .setOpt4(this.PushObj.opt4)
                .setOpt5(this.PushObj.opt5)
                .getMessage();


            if (session.os_type === 'ANDROID') {
                new FcmSender().sendOnce(pushObj, session);
                andCnt++;

            } else if (session.os_type === 'IOS') {
                pushObj.sessionId = session.session_id;

                iosList.push(pushObj);
                iosTargetList.push(sessionData.push_key);

            } else {
                etcCnt++;

            }

            if (addCnt >= alarmObj.length && andCnt + iosList.length + etcCnt >= pushCnt) {
                if (iosList.length > 0)
                    new ApnsSender().sendBulk(iosList, iosTargetList, targetType, position);
            }


        })
    }


}

class PushMessage {
    private position;
    private language;
    private opt1;
    private opt2;
    private opt3;
    private opt4;
    private opt5;

    constructor(){}


    public setPosition(_position: string): PushMessage {
        this.position = _position;
        return this;
    }

    public setLanguage(_language: string): PushMessage {
        this.language = _language;
        return this;
    }

    public setOpt1(_opt1: string): PushMessage {
        this.opt1 = _opt1;
        return this;
    }

    public setOpt2(_opt2: string): PushMessage {
        this.opt2 = _opt2;
        return this;
    }

    public setOpt3(_opt3: string): PushMessage {
        this.opt3 = _opt3;
        return this;
    }

    public setOpt4(_opt4: string): PushMessage {
        this.opt4 = _opt4;
        return this;
    }

    public setOpt5(_opt5: string): PushMessage {
        this.opt5 = _opt5;
        return this;
    }


    public getMessage(): string{
        let message;
        switch(this.position){
            case 'NOTICE':
                message = `새로운 공지가 등록되었습니다.`;
                break;

            case 'CONTENTS':
                message = `새로운 게시물이 등록되었습니다.`;
                break;

        }

        return message;
    }
}

class FcmSender {
    public sendOnce (obj, sessionData) {
        var message = {
            to: sessionData.push_key,
            priority: "high",
            content_available: true,
            data: obj
        };

        fcm.send(message, function (err, response) {
            if (err) {
                console.log('ERR', err);
                CommonDao.sendOnly(UserSessionDao.delete(sessionData.session_id));

            } else {
                // console.log('response', response);

            }
        });
    }

    // public sendBulk (targetLIst, type, position) {
    //     let idList = [];
    //
    //     var message = {
    //         priority: "high",
    //         content_available: true,
    //         data: {
    //             type: type,
    //             key: key,
    //             badge: 0,
    //             position: position,
    //
    //             sound: obj.sound,
    //             alert: obj.message,
    //             type: type,
    //             key: key,
    //             opt1: obj.opt1,
    //             opt2: obj.opt2,
    //             opt3: obj.opt3,
    //             opt4: obj.opt4,
    //             opt5: obj.opt5,
    //             badge: obj.badge,
    //             position: position
    //         }
    //     };
    //
    //     for (let i = 0; i < targetList.length; i++) {
    //         idList.push(targetList[i]);
    //
    //         if (idList.length >= 800) {
    //             var message = {
    //                 registration_ids: idList,
    //                 priority: "high",
    //                 content_available: true,
    //                 data: {
    //                     sound: '',
    //                     vib: '',
    //                     msg: message,
    //                     type: type,
    //                     key: key,
    //                     badge: 0,
    //                     position: position,
    //
    //                     sound: obj.sound,
    //                     alert: obj.message,
    //                     type: type,
    //                     key: key,
    //                     opt1: obj.opt1,
    //                     opt2: obj.opt2,
    //                     opt3: obj.opt3,
    //                     opt4: obj.opt4,
    //                     opt5: obj.opt5,
    //                     badge: obj.badge,
    //                     position: position
    //                 }
    //             };
    //
    //             fcm.send(message, function (err, response) {
    //                 if (err) {
    //                     console.log('ERR', err);
    //
    //                 } else {
    //                     console.log('response', response);
    //
    //                 }
    //             });
    //
    //             idList = [];
    //         }
    //     }
    //
    //     if (idList.length > 0) {
    //         var message = {
    //             registration_ids: idList,
    //             priority: "high",
    //             content_available: true,
    //             data: {
    //                 sound: '',
    //                 vib: '',
    //                 msg: message,
    //                 type: type,
    //                 key: key,
    //                 badge: 1,
    //                 position: position,
    //             }
    //         };
    //
    //         fcm.send(message, function (err, response) {
    //             if (err) {
    //                 console.log('ERR', err);
    //
    //             } else {
    //                 console.log('response', response);
    //
    //             }
    //
    //         });
    //     }
    // }
}

class ApnsSender {
    public sendBulk (targetList, tokenList, type, position) {
        if (targetList.length > 0) {
            var apnsMessage = [];
            var tokens = [];
            var capacity = targetList.length;

            for (var i = 0; i < capacity; i++) {
                var obj = targetList[i];

                apnsMessage.push({
                    expiry: 0,
                    _id: '10000',
                    payload: {
                        aps: {  //you can send only notification or only data(or include both)
                            sound: obj.sound,
                            alert: obj.message,
                            type: type,
                            key: obj.key,
                            add1: obj.add1,
                            add2: obj.add2,
                            add3: obj.add3,
                            badge: obj.badge,
                            position: position
                        }
                    }
                });

                tokens.push(tokenList[i]);
            }

            apnsSender.sendThroughApns(apnsMessage, tokens,
                function Success(resultStatusArray) {
                    apnsSender.resultArray = [];

                    for (let i = 0; i < resultStatusArray.length; i++) {
                        if (resultStatusArray[i].status > 0)
                            CommonDao.sendOnly(UserSessionDao.deleteByPushKey(resultStatusArray[i].token));

                    }
                },
                function Failed(error) {
                    LogErrorDao.error('PUSH_APNS', error);
                    apnsSender.resultArray = [];
                }
            );

        }
    }
}

const ServerConfig = require('../../../ServerConfig');
var globalConfig = ServerConfig.globalConfig;
var serverConfig = ServerConfig.serverConfig;

const fs = require('fs');
var FCM = require('fcm-node');
var serverKey = globalConfig.PUSH_FCM;
var fcm = new FCM(serverKey);

var objectCert = {
    certData: (globalConfig.PUSH_APNS_RELEASE == 1 ? globalConfig.PUSH_APNS_CERT : globalConfig.PUSH_APNS_CERT_DEV),
    keyData: (globalConfig.PUSH_APNS_RELEASE == 1 ? globalConfig.PUSH_APNS_KEY : globalConfig.PUSH_APNS_KEY_DEV),

    passphrase: globalConfig.PUSH_APNS_PASSPHRASE
};

var apnsSender = new (require('nodejs-apns-secure')).SenderApns(objectCert, (globalConfig.PUSH_APNS_RELEASE == 1));

exports.fcmSender = {
    sendOnce: function (obj, sessionData) {

        var message = {
            to: sessionData.push_key,
            priority: "high",
            content_available: true,
            data: obj
        };

        fcm.send(message, function (err, response) {
            if (err) {
                console.log('ERR', err);
                CommonDao.sendOnly(UserSessionDao.delete(sessionData.session_id));

            } else {
                // console.log('response', response);

            }
        });
    },

    sendBulk: function (targetList, type, position) {
        let idList = [];

        var message = {
            priority: "high",
            content_available: true,
            data: {
                type: type,
                key: key,
                badge: 0,
                position: position,

                sound: obj.sound,
                alert: obj.message,
                type: type,
                key: key,
                opt1: obj.opt1,
                opt2: obj.opt2,
                opt3: obj.opt3,
                opt4: obj.opt4,
                opt5: obj.opt5,
                badge: obj.badge,
                position: position
            }
        };

        for (let i = 0; i < targetList.length; i++) {
            idList.push(targetList[i]);

            if (idList.length >= 800) {
                var message = {
                    registration_ids: idList,
                    priority: "high",
                    content_available: true,
                    data: {
                        sound: '',
                        vib: '',
                        msg: message,
                        type: type,
                        key: key,
                        badge: 0,
                        position: position,

                        sound: obj.sound,
                        alert: obj.message,
                        type: type,
                        key: key,
                        opt1: obj.opt1,
                        opt2: obj.opt2,
                        opt3: obj.opt3,
                        opt4: obj.opt4,
                        opt5: obj.opt5,
                        badge: obj.badge,
                        position: position
                    }
                };

                fcm.send(message, function (err, response) {
                    if (err) {
                        console.log('ERR', err);

                    } else {
                        console.log('response', response);

                    }
                });

                idList = [];
            }
        }

        if (idList.length > 0) {
            var message = {
                registration_ids: idList,
                priority: "high",
                content_available: true,
                data: {
                    sound: '',
                    vib: '',
                    msg: message,
                    type: type,
                    key: key,
                    badge: 1,
                    position: position,
                }
            };

            fcm.send(message, function (err, response) {
                if (err) {
                    console.log('ERR', err);

                } else {
                    console.log('response', response);

                }

            });
        }

    },
};

exports.apnsSender = {
    sendOnce: function (obj) {
        var apnsMessage1 = {
            expiry: 0,
            _id: obj.user_id,
            payload: {
                aps: {  //you can send only notification or only data(or include both)
                    sound: obj.sound,
                    alert: obj.message,
                    type: obj.type,
                    key: obj.key,
                    badge: obj.badge,
                    position: obj.position,
                }
            }
        };

        var tokens = [obj.pushkey]; //"59e21c18c86ed8769274c87307537076999925c5787be62e416ca9807b428bed"];
        var apnsMessages = [apnsMessage1];

        apnsSender.sendThroughApns(apnsMessages, tokens,
            function Success(resultStatusArray) {
                CommonDao.insert(AlarmLogDao.insertPush(obj.user_id, 'ios', obj.pushkey, obj.position, obj.type, obj.key, obj.message, 1), function (result) {

                });

                apnsSender.resultArray = [];
            },
            function Failed(error) {
                LogErrorDao.error('PUSH_APNS', obj.user_id + ' -> ' + error);

                CommonDao.insert(AlarmLogDao.insertPush(obj.user_id, 'ios', obj.pushkey, obj.position, obj.type, obj.key, obj.message, 2), function (result) {

                });

                apnsSender.resultArray = [];
            }
        );
    },
    sendBulk: function (targetList, tokenList, type, position) {
        if (targetList.length > 0) {
            var apnsMessage = [];
            var tokens = [];
            var capacity = targetList.length;

            for (var i = 0; i < capacity; i++) {
                var obj = targetList[i];

                apnsMessage.push({
                    expiry: 0,
                    _id: '10000',
                    payload: {
                        aps: {  //you can send only notification or only data(or include both)
                            sound: obj.sound,
                            alert: obj.message,
                            type: type,
                            key: obj.key,
                            add1: obj.add1,
                            add2: obj.add2,
                            add3: obj.add3,
                            badge: obj.badge,
                            position: position
                        }
                    }
                });

                tokens.push(tokenList[i]);
            }

            apnsSender.sendThroughApns(apnsMessage, tokens,
                function Success(resultStatusArray) {
                    apnsSender.resultArray = [];

                    for (let i = 0; i < resultStatusArray.length; i++) {
                        if (resultStatusArray[i].status > 0)
                            CommonDao.sendOnly(UserSessionDao.deleteByPushKey(resultStatusArray[i].token));

                    }
                },
                function Failed(error) {
                    LogErrorDao.error('PUSH_APNS', error);
                    apnsSender.resultArray = [];
                }
            );

        }
    },
};



exports.sendBulk = function (alarmObj, position, targetType, targetKey) {
    if (alarmObj.length > 0) {
        let pushCnt = 0;
        let addCnt = 0;
        let andCnt = 0;
        let iosList = [];
        let iosTargetList = [];
        let etcCnt = 0;

        for (let i = 0; i < alarmObj.length; i++) {
            let checkObj = alarmObj[i];

            if (checkObj.recv_push == 1) {

                if(checkObj.push_show == 0) {
                    checkObj.message = null;
                    checkObj.sound = null;
                    checkObj.vibrate = 0;

                }

                let query = [];
                query.push(UserSessionDao.getAvailablePushByUserId(checkObj.user_id, checkObj.push_set));
                query.push(UserAlarmDao.countBadge(checkObj.user_id));
                CommonDao.get(query, (recordSet) => {
                    let sessionList = recordSet[0];
                    let badge = recordSet[1][0].count + 1;

                    pushCnt += sessionList.length;
                    addCnt++;

                    for(let j = 0; j < sessionList.length; j++) {
                        let sessionData = sessionList[j];

                        let pushObj = {
                            sound: sessionData.push_sound,

                            position: position,
                            type: targetType,
                            key: checkObj.key,
                            badge: badge,

                            add1: checkObj.add1,
                            add2: checkObj.add2,
                            add3: checkObj.add3,
                        };

                        pushObj.message = Language.makeMessage(position, checkObj.language, checkObj.opt1, checkObj.opt2, checkObj.opt3, checkObj.opt4, checkObj.opt5).slice(0, 80);

                        if (sessionData.os_type === 'ANDROID') {
                            Push.fcmSender.sendOnce(pushObj, sessionData);
                            andCnt++;

                        } else if (sessionData.os_type === 'IOS') {
                            pushObj.sessionId = sessionData.session_id;

                            iosList.push(pushObj);
                            iosTargetList.push(sessionData.push_key);

                        } else {
                            etcCnt++;

                        }

                        if (addCnt >= alarmObj.length && andCnt + iosList.length + etcCnt >= pushCnt) {
                            if (iosList.length > 0)
                                Push.apnsSender.sendBulk(iosList, iosTargetList, targetType, position);
                        }
                    }
                });
            }

        }
    }
};

