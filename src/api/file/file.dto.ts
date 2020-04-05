import {Equals, Allow, IsNotEmpty, IsDefined, validate, validateOrReject, Contains, IsInt, IsNumber, IsString, IsMultibyte, IsOptional, ValidateNested, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";

class FileDto {
    @IsNotEmpty()
    public fileData: Express.Multer.File;

    @IsNotEmpty()
    public filePath: string;

    @IsString()
    public encodeSize: string; // 50%

    @Allow()
    public thumbData: any;

    @IsString()
    public targetType: string = 'TEMP';

    @IsString()
    public targetKey: string = 'TEMP';

    @IsString()
    public option1: string;

    @IsString()
    public option2: string;

    @IsString()
    public option3: string;

    @IsNumber()
    public encodeFps: number; //= 0;

    @IsNumber()
    public thumbWidth: number; //= 0;

    @IsNumber()
    public thumbHeight: number; //= 0;

    @IsNumber()
    public useUniqueFileName: number; //= 1;

    @IsNumber()
    public useDateFolder: number; //= 1;

    @IsNumber()
    public makeThumb: number; //= 1;

    @IsNumber()
    public thumbOption: number; //= 1; // 썸네일 생성 시 크기 규칙. 너비, 높이 제한 => 1:최대 길이, 2:최소 길이, 3: 해당 크기로, 4: 원본 크기로


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
