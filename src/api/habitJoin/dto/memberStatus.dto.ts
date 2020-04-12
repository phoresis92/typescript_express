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


class MemberStatusDto {

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    public habitSeq: number;

    @IsNotEmpty()
    @IsString()
    public uuid: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['APPROVE', 'REFUSE', 'FORCE_DROP'])
    public statusType: string;

}

export default MemberStatusDto;
