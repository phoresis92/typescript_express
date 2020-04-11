import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, IsArray} from "class-validator";

@ValidatorConstraint({ name: "arrayIsIn", async: true })
export class ArrayIsIn implements ValidatorConstraintInterface {

    validate(arr: string[], args: ValidationArguments): Promise<boolean> {
        return new Promise((resolve, reject)=>{
            const inArr: string[] = args.constraints;
            let result = true;

            if(Array.isArray(arr)){
                if(arr.length === 0){
                    resolve(false);
                }

                for(let val of arr){
                    let flag = false;
                    for(let inVal of inArr){
                        if(val === inVal){
                            flag = true;
                        }
                    }

                    if(!flag){
                        result = false;
                        break;
                    }
                }

                resolve(result);

            }else{
                resolve(false);
            }


        })
        // return text.length > 1 && text.length < 10; // for async validations you must return a Promise<boolean> here
    }

    defaultMessage(args: ValidationArguments) { // here you can provide default error message if validation failed
        return `${args.property} not in (${args.constraints})`;
    }

}
