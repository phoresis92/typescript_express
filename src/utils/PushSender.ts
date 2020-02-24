import {Container} from 'typedi';
import pushInterface from '../interfaces/push.interface';
import SendPush from './SendPush';

import PushService from './service/push.service';

class Push implements pushInterface {
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

    public setPosition(_position: string): Push {
        this.position = _position;
        return this;
    }

    public setSender(_sender: string): Push {
        this.sender = _sender;
        return this;
    }

    public setTargetKey(_targetKey: string): Push {
        this.targetKey = _targetKey;
        return this;
    }

    public setTargetType(_targetType: string): Push {
        this.targetType = _targetType;
        return this;
    }

    public setOpt1(_opt1: string): Push {
        this.opt1 = _opt1;
        return this;
    }

    public setOpt2(_opt2: string): Push {
        this.opt2 = _opt2;
        return this;
    }

    public setOpt3(_opt3: string): Push {
        this.opt3 = _opt3;
        return this;
    }

    public setOpt4(_opt4: string): Push {
        this.opt4 = _opt4;
        return this;
    }

    public setOpt5(_opt5: string): Push {
        this.opt5 = _opt5;
        return this;
    }

    public pushAllUser(){
        const pushService = Container.get(PushService);
        const sendList = await pushService.insertAlarm(this);

        this.sendAlarm(sendList);

    }

    sendAlarm(sendList: object[]): number {
        sendList.map((pushUser, idx)=>{
            new SendPush(pushUser, this.position, this.targetKey, this.targetType).send();
        });

        return 0;
    }

}


