import { Controller, Get, Patch, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard) // urutan penting: cek login dulu, baru cek role
@Roles(UserRole.ADMIN)
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Get('users')
    getAllUsers(@Query('page') page?: string, @Query('limit') limit?: string) {
        return this.adminService.getAllUsers(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 10,
        );
    }

    @Get('users/:id')
    getUserDetail(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.getUserDetail(id);
    }

    @Get('transactions')
    getAllTransactions(@Query('page') page?: string, @Query('limit') limit?: string) {
        return this.adminService.getAllTransactions(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
        );
    }

    @Patch('accounts/:id/freeze')
    toggleFreeze(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.toggleFreeze(id);
    }
}