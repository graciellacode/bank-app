import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AccountsService } from '../accounts/accounts.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private accountsService: AccountsService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async register(dto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException('Email sudah terdaftar');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.usersService.create({
            fullName: dto.fullName,
            email: dto.email,
            password: hashedPassword,
        });

        const account = await this.accountsService.createAccountForUser(user);

        return {
            message: 'Registrasi berhasil',
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                accountNumber: account.accountNumber,
            },
        };
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Email atau password salah');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Email atau password salah');
        }

        const tokens = await this.generateTokens(user.id, user.email, user.role);

        // Simpan hash refresh token ke database
        const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
        await this.usersService.updateRefreshTokenHash(user.id, refreshTokenHash);

        return {
            message: 'Login berhasil',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        };
    }

    async refresh(userId: number, refreshToken: string) {
        const user = await this.usersService.findById(userId);

        if (!user || !user.refreshTokenHash) {
            throw new UnauthorizedException('Akses ditolak, silakan login kembali');
        }

        // Bandingkan refresh token yang dikirim dengan hash di database
        const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
        if (!isValid) {
            throw new UnauthorizedException('Refresh token tidak valid');
        }

        // Generate token baru (access + refresh baru juga, disebut "token rotation")
        const tokens = await this.generateTokens(user.id, user.email, user.role);

        const newRefreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
        await this.usersService.updateRefreshTokenHash(user.id, newRefreshTokenHash);

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    async logout(userId: number) {
        // Hapus refresh token dari database, jadi tidak bisa dipakai lagi
        await this.usersService.updateRefreshTokenHash(userId, null);
        return { message: 'Logout berhasil' };
    }

    // Ganti "private async issueTokensAndRespond" menjadi:
    async issueTokensForUser(user: {
        id: number;
        email: string;
        role: string;
        fullName: string;
    }) {
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
        await this.usersService.updateRefreshTokenHash(user.id, refreshTokenHash);

        return {
            message: 'Login berhasil',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        };
    }

    private async generateTokens(userId: number, email: string, role: string) {
        const payload = { sub: userId, email, role };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET') || 'default_secret_key_123',
            expiresIn: this.configService.get('JWT_EXPIRES_IN') || '15m',
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET') || 'default_refresh_secret_key_456',
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
        });

        return { accessToken, refreshToken };
    }
}