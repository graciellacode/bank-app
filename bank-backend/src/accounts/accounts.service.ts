import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
    ) { }

    async createAccountForUser(user: User): Promise<Account> {
        const accountNumber = this.generateAccountNumber();
        const account = this.accountRepository.create({
            accountNumber,
            balance: 0,
            user,
        });
        return this.accountRepository.save(account);
    }

    private generateAccountNumber(): string {
        const random = Math.floor(1000000000 + Math.random() * 9000000000);
        return random.toString();
    }

    async findByUserId(userId: number): Promise<Account> {
        const account = await this.accountRepository.findOne({
            where: { user: { id: userId } },
        });

        if (!account) {
            throw new NotFoundException('Akun rekening tidak ditemukan');
        }

        return account;
    }

    async findByAccountNumber(accountNumber: string) {
        const account = await this.accountRepository.findOne({
            where: { accountNumber },
            relations: { user: true }, // diubah dari ['user'] jadi { user: true }
        });

        if (!account) {
            throw new NotFoundException('Nomor rekening tidak ditemukan');
        }

        return {
            accountNumber: account.accountNumber,
            accountHolderName: account.user.fullName,
        };
    }
}