import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationPreference } from './entities/notification-preference.entity';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(NotificationPreference)
        private prefRepository: Repository<NotificationPreference>,
    ) { }

    async getPreferences(userId: number) {
        let pref = await this.prefRepository.findOne({
            where: { user: { id: userId } },
        });

        // Kalau belum ada, buat default otomatis (user baru/lama yang belum punya record)
        if (!pref) {
            pref = this.prefRepository.create({ user: { id: userId } as any });
            pref = await this.prefRepository.save(pref);
        }

        return pref;
    }

    async updatePreferences(
        userId: number,
        data: Partial<{
            pushEnabled: boolean;
            incomingTransferPush: boolean;
            paymentReminderPush: boolean;
            monthlyStatementEmail: boolean;
            highValueSms: boolean;
        }>,
    ) {
        const pref = await this.getPreferences(userId);
        Object.assign(pref, data);
        return this.prefRepository.save(pref);
    }
}