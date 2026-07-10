import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
} from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    fullName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phoneNumber: string | null;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ type: 'varchar', length: 255, nullable: true })
    refreshTokenHash: string | null;

    @OneToOne(() => Account, (account) => account.user)
    account: Account;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}