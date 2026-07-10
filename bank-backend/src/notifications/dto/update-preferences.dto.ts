import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePreferencesDto {
    @IsOptional()
    @IsBoolean()
    pushEnabled?: boolean;

    @IsOptional()
    @IsBoolean()
    incomingTransferPush?: boolean;

    @IsOptional()
    @IsBoolean()
    paymentReminderPush?: boolean;

    @IsOptional()
    @IsBoolean()
    monthlyStatementEmail?: boolean;

    @IsOptional()
    @IsBoolean()
    highValueSms?: boolean;
}