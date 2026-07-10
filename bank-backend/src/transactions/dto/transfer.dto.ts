import { IsNotEmpty, IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class TransferDto {
    @IsNotEmpty({ message: 'Nomor rekening tujuan wajib diisi' })
    @IsString()
    toAccountNumber: string;

    @IsNumber({}, { message: 'Jumlah harus berupa angka' })
    @Min(1000, { message: 'Minimal transfer Rp 1.000' })
    amount: number;

    @IsOptional()
    @IsString()
    note?: string;
}