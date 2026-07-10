import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { WebauthnService } from './webauthn.service';
import { AuthService } from '../auth/auth.service';
import { VerifyRegistrationDto } from './dto/verify-registration.dto';
import {
    LoginOptionsDto,
    VerifyAuthenticationDto,
} from './dto/webauthn-login.dto';

@Controller('webauthn')
export class WebauthnController {
    constructor(
        private webauthnService: WebauthnService,
        private authService: AuthService,
    ) { }

    // --- Registrasi (butuh login dulu) ---

    @Post('register/options')
    @UseGuards(JwtAuthGuard)
    getRegistrationOptions(@CurrentUser() user: { userId: number }) {
        return this.webauthnService.generateRegistrationOptions(user.userId);
    }

    @Post('register/verify')
    @UseGuards(JwtAuthGuard)
    verifyRegistration(
        @CurrentUser() user: { userId: number },
        @Body() dto: VerifyRegistrationDto,
    ) {
        return this.webauthnService.verifyRegistration(
            user.userId,
            dto.response,
            dto.nickname,
        );
    }

    @Get('credentials')
    @UseGuards(JwtAuthGuard)
    getCredentials(@CurrentUser() user: { userId: number }) {
        return this.webauthnService.getUserCredentials(user.userId);
    }

    @Delete('credentials/:id')
    @UseGuards(JwtAuthGuard)
    removeCredential(
        @CurrentUser() user: { userId: number },
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.webauthnService.removeCredential(user.userId, id);
    }

    // --- Login (belum login, publik) ---

    @Post('login/options')
    getLoginOptions(@Body() dto: LoginOptionsDto) {
        return this.webauthnService.generateAuthenticationOptions(dto.email);
    }

    @Post('login/verify')
    async verifyLogin(@Body() dto: VerifyAuthenticationDto) {
        const user = await this.webauthnService.verifyAuthentication(
            dto.email,
            dto.response,
        );
        // Setelah verifikasi biometrik sukses, terbitkan token JWT seperti login biasa
        return this.authService.issueTokensForUser(user);
    }
}