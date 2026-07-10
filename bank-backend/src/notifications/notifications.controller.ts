import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Controller('notifications/preferences')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private notificationsService: NotificationsService) { }

    @Get()
    get(@CurrentUser() user: { userId: number }) {
        return this.notificationsService.getPreferences(user.userId);
    }

    @Patch()
    update(
        @CurrentUser() user: { userId: number },
        @Body() dto: UpdatePreferencesDto,
    ) {
        return this.notificationsService.updatePreferences(user.userId, dto);
    }
}