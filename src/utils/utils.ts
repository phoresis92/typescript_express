
export default class Utils {
    constructor(){};

    public makeArray (toArr: string, splitChar: string): string[] {
        let arr = toArr.split(splitChar);
        arr.filter((val, idx)=>{
            return val !== '';
        });

        return arr;
    }
}
