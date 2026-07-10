import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('accounts')
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 20 })
    accountNumber: string;

    @Column('decimal', { precision: 15, scale: 2, default: 0 })
    balance: number;

    // Kolom baru
    @Column({ default: false })
    isFrozen: boolean;

    @OneToOne(() => User, (user) => user.account)
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}