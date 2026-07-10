import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Account } from '../accounts/entities/account.entity';
import { Transaction } from '../transactions/entities/transaction.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Account)
        private accountsRepository: Repository<Account>,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
    ) { }

    async getAllUsers(page = 1, limit = 10) {
        const [data, total] = await this.usersRepository.findAndCount({
            relations: { account: true },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                createdAt: true,
                account: {
                    id: true,
                    accountNumber: true,
                    balance: true,
                    isFrozen: true,
                },
            },
        });

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async getUserDetail(id: number) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: { account: true },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                createdAt: true,
                account: { id: true, accountNumber: true, balance: true, isFrozen: true },
            },
        });

        if (!user) {
            throw new NotFoundException('User tidak ditemukan');
        }

        return user;
    }

    async getAllTransactions(page = 1, limit = 20) {
        const [data, total] = await this.transactionRepository.findAndCount({
            relations: { account: { user: true } },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
            select: {
                id: true,
                type: true,
                amount: true,
                balanceAfter: true,
                description: true,
                createdAt: true,
                account: {
                    accountNumber: true,
                    user: { fullName: true },
                },
            },
        });

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async toggleFreeze(accountId: number) {
        const account = await this.accountsRepository.findOne({
            where: { id: accountId },
        });

        if (!account) {
            throw new NotFoundException('Akun tidak ditemukan');
        }

        account.isFrozen = !account.isFrozen;
        await this.accountsRepository.save(account);

        return {
            message: account.isFrozen ? 'Akun berhasil dibekukan' : 'Akun berhasil diaktifkan kembali',
            isFrozen: account.isFrozen,
        };
    }
}