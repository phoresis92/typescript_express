
export default class Utils {
    constructor(){};

    public makeArray (origin: string, split: string): string[] {
        let arr = origin.split(split);
        arr.filter((val, idx)=>{
            return val !== '';
        });

        return arr;
    }
}
