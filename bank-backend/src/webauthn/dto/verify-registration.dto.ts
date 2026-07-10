import { IsObject, IsOptional, IsString } from 'class-validator';

export class VerifyRegistrationDto {
    @IsObject()
    response: any;

    @IsOptional()
    @IsString()
    nickname?: string;
}