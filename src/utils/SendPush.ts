import {Inject, Service} from "typedi";
import Mysql from "../loaders/MysqlTemplate";
import PushQuery from "./service/push.query";
import config from "../config";
import FCM from 'fcm-node';

const fcm = new FCM(config.push.fcmKey);


export default class SendPush {
    // @Inject('mysql')
    // private mysql;

    private pushQuery = new PushQuery();

    constructor(private PushObj, private position: string, private targetKey: string, private targetType: string){}

    public async send(){

        const sessionList = await Mysql.exec(this.pushQuery.checkPushSet(), [this.PushObj.user_id]);
        const countBadge = (await Mysql.exec(this.pushQuery.getCountBadge(), [this.PushObj.user_id]))[0];

        let pushCnt = sessionList.length;
        let andCnt = 0;
        let iosList = [];
        let iosTargetList = [];
        let etcCnt = 0;

        sessionList.map((session, idx)=>{
            let pushObj = {
                sound: session.push_sound,

                position: this.position,
                type: this.targetType,
                key: this.targetKey,
                badge: countBadge.badge,

                message: '',
                sessionId: '',

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
                iosTargetList.push(session.push_key);

            } else {
                etcCnt++;

            }

            if (andCnt + iosList.length + etcCnt >= pushCnt) {
                if (iosList.length > 0){
                    new ApnsSender().sendBulk(iosList, iosTargetList, this.targetType, this.position);

                }
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
                message = `[${this.opt1}] ${this.opt2}개의 사진이 등록되었습니다.`;
                break;

        }

        return message.slice(0, 80);
    }
}

class FcmSender {
    // private fcm = new FCM(config.push.fcmKey);

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
                // CommonDao.sendOnly(UserSessionDao.delete(sessionData.session_id));

            } else {
                console.log('response', response);

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
    private objectCert = {
        certData: (config.push.apnsRelease === `1` ? config.push.apnsCert : config.push.apnsCertDev),
        keyData: (config.push.apnsRelease === `1` ? config.push.apnsKey : config.push.apnsKeyDev),

        passphrase: config.push.apnsPassphrase
    };

    private apnsSender = new (require('nodejs-apns-secure')).SenderApns(this.objectCert, (config.push.apnsRelease === `1`));


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

            this.apnsSender.sendThroughApns(apnsMessage, tokens,
                function Success(resultStatusArray) {
                    // this.apnsSender.resultArray = [];

                    for (let i = 0; i < resultStatusArray.length; i++) {
                        if (resultStatusArray[i].status > 0){
                            console.log(resultStatusArray[i].status)
                        }
                            // CommonDao.sendOnly(UserSessionDao.deleteByPushKey(resultStatusArray[i].token));

                    }
                },
                function Failed(error) {
                console.log(error)
                    // LogErrorDao.error('PUSH_APNS', error);
                    // this.apnsSender.resultArray = [];
                }
            );

        }
    }
}
