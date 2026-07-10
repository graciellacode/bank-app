import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AccountsService } from './accounts.service';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
    constructor(private accountsService: AccountsService) { }

    @Get('me')
    async getMyAccount(@CurrentUser() user: { userId: number }) {
        const account = await this.accountsService.findByUserId(user.userId);
        return {
            accountNumber: account.accountNumber,
            balance: account.balance,
            createdAt: account.createdAt,
        };
    }

    // Endpoint baru: cek nama pemilik rekening tujuan
    @Get('inquiry/:accountNumber')
    async inquiry(@Param('accountNumber') accountNumber: string) {
        return this.accountsService.findByAccountNumber(accountNumber);
    }
}