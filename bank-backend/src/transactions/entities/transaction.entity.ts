import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';

export enum TransactionType {
    DEBIT = 'debit',   // saldo berkurang (uang keluar)
    CREDIT = 'credit', // saldo bertambah (uang masuk)
}

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Account, { onDelete: 'CASCADE' })
    account: Account;

    @Column({ type: 'enum', enum: TransactionType })
    type: TransactionType;

    @Column('decimal', { precision: 15, scale: 2 })
    amount: number;

    @Column('decimal', { precision: 15, scale: 2 })
    balanceAfter: number; // saldo SETELAH transaksi ini, untuk audit trail

    @Column({ length: 255, nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;
}