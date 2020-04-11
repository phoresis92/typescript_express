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

class HabitListDto {
    @IsNotEmpty()
    @IsNumber()
    public habitCategory: number;

    @IsNotEmpty()
    @IsNumber()
    public page: number;

}

export default HabitListDto;
