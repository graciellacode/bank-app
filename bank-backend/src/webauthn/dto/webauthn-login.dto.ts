import { IsEmail, IsObject, IsOptional } from 'class-validator';

export class LoginOptionsDto {
    @IsEmail()
    email: string;
}

export class VerifyAuthenticationDto {
    @IsEmail()
    email: string;

    @IsObject()
    response: any;
}