import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh', // nama strategy berbeda dari yang biasa
) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'), // ambil dari body request
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_REFRESH_SECRET') as string,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: { sub: number; email: string }) {
        const refreshToken = req.body.refreshToken;
        return { userId: payload.sub, email: payload.email, refreshToken };
    }
}