import {Equals, Allow, IsNotEmpty, IsDefined, validate, validateOrReject, Contains, IsInt, IsNumber, IsString, IsMultibyte, IsOptional, ValidateNested, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";

class ProfileDto {

    @IsNotEmpty()
    @IsString()
    public nickName: string;

    @IsNumber()
    public fileSeq: number;

}

export default ProfileDto;
