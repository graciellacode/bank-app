import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('notification_preferences')
export class NotificationPreference {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column({ default: true })
    pushEnabled: boolean;

    @Column({ default: true })
    incomingTransferPush: boolean;

    @Column({ default: true })
    paymentReminderPush: boolean;

    @Column({ default: true })
    monthlyStatementEmail: boolean;

    @Column({ default: false })
    highValueSms: boolean;
}