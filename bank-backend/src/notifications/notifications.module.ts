import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationPreference } from './entities/notification-preference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationPreference])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule { }