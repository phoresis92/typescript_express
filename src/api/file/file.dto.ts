import {Equals, Allow, IsDefined, validate, validateOrReject, Contains, IsInt, IsString, IsMultibyte, IsOptional, ValidateNested, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";

class FileDto {
    @IsString()
    public fullName: string;

    @IsEmail()
    public email: string;

    @IsString()
    public password: string;

    @Equals('Essential')
    public fileData: string;

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

export const fileParam = [
    {name: 'fileData', maxCount: 1},
    {name: 'thumbData', maxCount: 1}
];

export type fileParamType = {fileData: Express.Multer.File[], thumbData: Express.Multer.File[]};
