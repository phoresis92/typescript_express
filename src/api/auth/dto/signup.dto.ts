import {Equals, Allow, IsNotEmpty, IsDefined, validate, validateOrReject, Contains, IsDateString, IsInt, IsNumber, IsString, IsMultibyte, IsOptional, ValidateNested, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";

class SignupDto {
    @IsNotEmpty()
    public joinType: string;

    @IsNotEmpty()
    public loginId: string;

    @IsNotEmpty()
    public password: string;

    @IsString()
    public nickName: string; // 50%

    @IsNumber()
    public fileSeq: number;

    @IsNumber()
    public agreeUse: number;

    @IsNumber()
    public agreePersonalInfo: number;

}

export default SignupDto;
