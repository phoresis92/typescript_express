import * as uuid from 'uuid'

export default class Utils {
    constructor(){};

    public makeArray (toArr: string, splitChar: string): string[] {
        let arr = toArr.split(splitChar);
        arr.filter((val, idx)=>{
            return val !== '';
        });

        return arr;
    }

    public makeUserId (){
        const token = uuid.v4().split('-');
        return token[2] + token[1] + token[0] + token[3] + token[4]
    }

}
