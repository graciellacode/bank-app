import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Account } from '../accounts/entities/account.entity';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { Transfer, TransferStatus } from './entities/transfer.entity';
import { TransferDto } from './dto/transfer.dto';
import { TopUpDto } from './dto/topup.dto';

@Injectable()
export class TransactionsService {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        @InjectRepository(Transfer)
        private transferRepository: Repository<Transfer>,
    ) { }

    async transfer(userId: number, dto: TransferDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const accountRepo = queryRunner.manager.getRepository(Account);

            const fromAccount = await accountRepo.findOne({
                where: { user: { id: userId } },
                lock: { mode: 'pessimistic_write' },
            });

            if (!fromAccount) {
                throw new NotFoundException('Akun pengirim tidak ditemukan');
            }

            if (fromAccount.isFrozen) {
                throw new BadRequestException('Akun Anda sedang dibekukan, hubungi customer service');
            }

            const toAccount = await accountRepo.findOne({
                where: { accountNumber: dto.toAccountNumber },
                lock: { mode: 'pessimistic_write' },
            });

            if (!toAccount) {
                throw new NotFoundException('Nomor rekening tujuan tidak ditemukan');
            }

            if (toAccount.isFrozen) {
                throw new BadRequestException('Akun tujuan sedang dibekukan');
            }

            if (fromAccount.id === toAccount.id) {
                throw new BadRequestException('Tidak bisa transfer ke rekening sendiri');
            }

            const currentBalance = Number(fromAccount.balance);
            if (currentBalance < dto.amount) {
                throw new BadRequestException('Saldo tidak mencukupi');
            }

            const newFromBalance = currentBalance - dto.amount;
            fromAccount.balance = newFromBalance;
            await accountRepo.save(fromAccount);

            const newToBalance = Number(toAccount.balance) + dto.amount;
            toAccount.balance = newToBalance;
            await accountRepo.save(toAccount);

            const transactionRepo = queryRunner.manager.getRepository(Transaction);
            await transactionRepo.save(
                transactionRepo.create({
                    account: fromAccount,
                    type: TransactionType.DEBIT,
                    amount: dto.amount,
                    balanceAfter: newFromBalance,
                    description: dto.note || `Transfer ke ${toAccount.accountNumber}`,
                }),
            );

            await transactionRepo.save(
                transactionRepo.create({
                    account: toAccount,
                    type: TransactionType.CREDIT,
                    amount: dto.amount,
                    balanceAfter: newToBalance,
                    description: dto.note || `Transfer dari ${fromAccount.accountNumber}`,
                }),
            );

            const transferRepo = queryRunner.manager.getRepository(Transfer);
            const transfer = await transferRepo.save(
                transferRepo.create({
                    fromAccount,
                    toAccount,
                    amount: dto.amount,
                    note: dto.note,
                    status: TransferStatus.SUCCESS,
                }),
            );

            await queryRunner.commitTransaction();

            return {
                message: 'Transfer berhasil',
                transferId: transfer.id,
                newBalance: newFromBalance,
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async topUp(userId: number, dto: TopUpDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const accountRepo = queryRunner.manager.getRepository(Account);

            const account = await accountRepo.findOne({
                where: { user: { id: userId } },
                lock: { mode: 'pessimistic_write' },
            });

            if (!account) {
                throw new NotFoundException('Akun tidak ditemukan');
            }

            const newBalance = Number(account.balance) + dto.amount;
            account.balance = newBalance;
            await accountRepo.save(account);

            const transactionRepo = queryRunner.manager.getRepository(Transaction);
            await transactionRepo.save(
                transactionRepo.create({
                    account,
                    type: TransactionType.CREDIT,
                    amount: dto.amount,
                    balanceAfter: newBalance,
                    description: dto.note || 'Top up saldo',
                }),
            );

            await queryRunner.commitTransaction();

            return {
                message: 'Top up berhasil',
                newBalance,
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getHistory(userId: number, page = 1, limit = 10) {
        const account = await this.transactionRepository.manager
            .getRepository(Account)
            .findOne({ where: { user: { id: userId } } });

        if (!account) {
            throw new NotFoundException('Akun tidak ditemukan');
        }

        const [data, total] = await this.transactionRepository.findAndCount({
            where: { account: { id: account.id } },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}