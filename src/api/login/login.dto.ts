import {Equals, Allow, IsNotEmpty, IsDefined, validate, validateOrReject, Contains, IsInt, IsNumber, IsString, IsMultibyte, IsOptional, ValidateNested, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";

class LoginDto {
    @IsNotEmpty()
    public joinType: string;

    @IsNotEmpty()
    public loginId: string;

    @IsNotEmpty()
    public password: string;

    @IsNotEmpty()
    public sessionId: string; // 50%

    @IsNumber()
    public loginForce: number;

    @IsString()
    public osType: string;

    @IsString()
    public osVersion: string;

    @IsString()
    public appVersion: string;

    @IsNotEmpty()
    public pushKey: string;

}

export default LoginDto;
