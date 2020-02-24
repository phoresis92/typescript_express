import {Container} from 'typedi';
import pushInterface from '../interfaces/push.interface';
import SendPush from './SendPush';

import PushService from './service/push.service';

class PushSender implements pushInterface {
    opt1: string;
    opt2: string;
    opt3: string;
    opt4: string;
    opt5: string;
    position: string;
    sender: string;
    targetKey: string;
    targetType: string;

    // constructor(public position: string, public targetKey: string, public sender:string, public opt1:string, public opt2: string, public opt3: string, public opt4: string, public opt5: string){}
    constructor() {
    }

    public setPosition(_position: string): PushSender {
        this.position = _position;
        return this;
    }

    public setSender(_sender: string): PushSender {
        this.sender = _sender;
        return this;
    }

    public setTargetKey(_targetKey: string): PushSender {
        this.targetKey = _targetKey;
        return this;
    }

    public setTargetType(_targetType: string): PushSender {
        this.targetType = _targetType;
        return this;
    }

    public setOpt1(_opt1: string): PushSender {
        this.opt1 = _opt1;
        return this;
    }

    public setOpt2(_opt2: string): PushSender {
        this.opt2 = _opt2;
        return this;
    }

    public setOpt3(_opt3: string): PushSender {
        this.opt3 = _opt3;
        return this;
    }

    public setOpt4(_opt4: string): PushSender {
        this.opt4 = _opt4;
        return this;
    }

    public setOpt5(_opt5: string): PushSender {
        this.opt5 = _opt5;
        return this;
    }

    public async pushAllUser(){
        const pushService = Container.get(PushService);
        const sendList = await pushService.insertAlarm(this);

        this.sendAlarm(sendList);

    }

    public sendAlarm(sendList: any[]): void {
        sendList.map((pushUser, idx)=>{
            new SendPush(pushUser, this.position, this.targetKey, this.targetType).send();
        });

    }

}


