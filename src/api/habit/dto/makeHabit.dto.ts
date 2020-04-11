import {
    Validate,
    Equals,
    Allow,
    IsNotEmpty,
    IsDefined,
    validate,
    validateOrReject,
    Contains,
    IsInt,
    IsNumber,
    IsString,
    IsMultibyte,
    IsOptional,
    ValidateNested,
    Length,
    IsEmail,
    IsFQDN,
    IsDate,
    IsMilitaryTime,
    Min,
    Max,
    MaxLength,
    IsArray,
    IsIn,
    ArrayContains, MinDate,
} from "class-validator";

import {ArrayIsIn} from '../../../utils/classValidator/ArrayIsIn';
import moment from 'moment';


class MakeHabitRoomDto {
    @IsNumber()
    public habitSeq: number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    public habitTitle: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    public habitGoal: string;

    @IsNotEmpty()
    @IsNumber()
    public habitCategory: number;

    @IsNotEmpty()
    @IsString()
    @IsIn(['EVERY', 'WEEK', 'END', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX'])
    public frequency: string; // 50%

    @IsNotEmpty()
    @IsString()
    @IsIn(['HUNDRED', 'ONEM', 'TWOM', 'FIVEM', 'ONEY'])
    public period: string;

    @IsNotEmpty()
    @IsDate()
    @MinDate(new Date(moment().format('YYYY-MM-DD HH:mm:ss')))
    public startDate: Date;

    @IsNotEmpty()
    @IsDate()
    public endDate: Date;

    @IsMilitaryTime({
        message: `certStart IsMilitaryTime`
    })
    public certStart: string;

    @IsMilitaryTime({
        message: `certEnd IsMilitaryTime`
    })
    public certEnd: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(20)
    public maxJoinCnt: number;

    @IsNotEmpty()
    @IsArray()
    @Validate(ArrayIsIn, ['PICTURE', 'TEXT'])
    public certType: string[];

    @IsNotEmpty()
    @IsArray()
    @Validate(ArrayIsIn, ['CAMERA', 'ALBUM'])
    public pictureType: string[];

    @IsNotEmpty()
    @IsString()
    public certMethod: string;

    @IsNumber()
    public profileFileSeq: number;

    @IsNumber()
    public sampleFileSeq: number;


    public validDate (){
        return this.startDate <= this.endDate;
    }

}

export default MakeHabitRoomDto;
