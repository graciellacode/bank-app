import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';

export enum TransferStatus {
    SUCCESS = 'success',
    FAILED = 'failed',
}

@Entity('transfers')
export class Transfer {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Account)
    fromAccount: Account;

    @ManyToOne(() => Account)
    toAccount: Account;

    @Column('decimal', { precision: 15, scale: 2 })
    amount: number;

    @Column({ length: 255, nullable: true })
    note: string;

    @Column({ type: 'enum', enum: TransferStatus, default: TransferStatus.SUCCESS })
    status: TransferStatus;

    @CreateDateColumn()
    createdAt: Date;
}