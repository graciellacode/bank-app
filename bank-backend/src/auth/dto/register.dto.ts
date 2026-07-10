import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty({ message: 'Nama lengkap wajib diisi' })
    fullName: string;

    @IsEmail({}, { message: 'Email tidak valid' })
    email: string;

    @MinLength(6, { message: 'Password minimal 6 karakter' })
    password: string;
}