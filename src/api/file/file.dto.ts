import {Allow, IsDefined, validate, validateOrReject, Contains, IsInt, IsString, IsMultibyte, IsOptional, ValidateNested, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";

class FileDto {
    @IsString()
    public fullName: string;

    @IsEmail()
    public email: string;

    @IsString()
    public password: string;

    @Allow()
    public fileData: any;

    @Allow()
    public thumbData: any;

    public setFileData = (fileData: any)=>{
        this.fileData = fileData;
        return this;
    };

    public setThumbData = (thumbData: any)=>{
        this.thumbData = thumbData;
        return this;
    };

}

export default FileDto;
