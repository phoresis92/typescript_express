interface PushInterface {
    position: string;
    targetKey: string;
    sender: string;
    opt1: string;
    opt2: string;
    opt3: string;
    opt4: string;
    opt5: string;

    sendAlarm (): number;

}

export default PushInterface;
