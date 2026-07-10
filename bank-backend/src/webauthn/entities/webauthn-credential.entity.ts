import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('webauthn_credentials')
export class WebauthnCredential {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @Column({ unique: true })
    credentialId: string; // base64url, ID unik dari device

    @Column('text')
    publicKey: string; // base64, dipakai untuk verifikasi

    @Column({ type: 'bigint', default: 0 })
    counter: number; // anti-replay attack

    @Column({ nullable: true })
    deviceType: string;

    @Column({ default: false })
    backedUp: boolean;

    @Column({ nullable: true })
    transports: string; // json string, misal: ["internal"]

    @Column({ nullable: true })
    nickname: string; // misal: "iPhone Budi"

    @CreateDateColumn()
    createdAt: Date;
}