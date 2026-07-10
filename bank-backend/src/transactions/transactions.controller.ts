import {
    Controller,
    Post,
    Get,
    Body,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TransactionsService } from './transactions.service';
import { TransferDto } from './dto/transfer.dto';
import { TopUpDto } from './dto/topup.dto';

@Controller()
@UseGuards(JwtAuthGuard) // semua endpoint di controller ini wajib login
export class TransactionsController {
    constructor(private transactionsService: TransactionsService) { }

    @Post('transfer')
    transfer(
        @CurrentUser() user: { userId: number },
        @Body() dto: TransferDto,
    ) {
        return this.transactionsService.transfer(user.userId, dto);
    }

    @Get('transactions')
    getHistory(
        @CurrentUser() user: { userId: number },
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.transactionsService.getHistory(
            user.userId,
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 10,
        );
    }

    @Post('topup')
    topUp(
        @CurrentUser() user: { userId: number },
        @Body() dto: TopUpDto,
    ) {
        return this.transactionsService.topUp(user.userId, dto);
    }
}