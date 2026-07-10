import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { id },
            relations: { account: true },
        });
    }

    async create(data: {
        fullName: string;
        email: string;
        password: string;
    }): Promise<User> {
        const user = this.usersRepository.create(data);
        return this.usersRepository.save(user);
    }

    async updateRefreshTokenHash(
        userId: number,
        refreshTokenHash: string | null,
    ): Promise<void> {
        await this.usersRepository.update(userId, { refreshTokenHash });
    }

    // Method baru untuk profile
    async getProfile(userId: number) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: { account: true },
            select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
                role: true,
                createdAt: true,
                account: {
                    accountNumber: true,
                    balance: true,
                },
            },
        });

        if (!user) {
            throw new NotFoundException('User tidak ditemukan');
        }

        return user;
    }

    async updateProfile(
        userId: number,
        data: { fullName?: string; phoneNumber?: string },
    ) {
        await this.usersRepository.update(userId, data);
        return this.getProfile(userId);
    }
}