import {Equals, Allow, IsNotEmpty, IsDefined, validate, validateOrReject, Contains, IsDateString, IsInt, IsNumber, IsString, IsMultibyte, IsOptional, ValidateNested, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";

class SignupDto {
    @IsNotEmpty()
    @IsString()
    public joinType: string;

    @IsNotEmpty()
    @IsString()
    public loginId: string;

    @IsNotEmpty()
    @IsString()
    public password: string;

    // @IsString()
    // public nickName: string;
    //
    // @IsNumber()
    // public fileSeq: number;

    @IsNumber()
    public agreeUse: number;

    @IsNumber()
    public agreePersonalInfo: number;

}

export default SignupDto;
