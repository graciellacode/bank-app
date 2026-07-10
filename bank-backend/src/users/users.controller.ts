import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('me')
    getProfile(@CurrentUser() user: { userId: number }) {
        return this.usersService.getProfile(user.userId);
    }

    @Patch('me')
    updateProfile(
        @CurrentUser() user: { userId: number },
        @Body() dto: UpdateProfileDto,
    ) {
        return this.usersService.updateProfile(user.userId, dto);
    }
}