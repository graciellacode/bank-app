import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { Transfer } from './entities/transfer.entity';
import { Account } from '../accounts/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Transfer, Account])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule { }