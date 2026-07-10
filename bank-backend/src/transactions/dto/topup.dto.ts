import { IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class TopUpDto {
    @IsNumber({}, { message: 'Jumlah harus berupa angka' })
    @Min(10000, { message: 'Minimal top up Rp 10.000' })
    amount: number;

    @IsOptional()
    @IsString()
    note?: string;
}