import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { WebauthnCredential } from './entities/webauthn-credential.entity';
import { User } from '../users/entities/user.entity';
import { WebauthnChallengeStore } from './webauthn-challenge.store';

@Injectable()
export class WebauthnService {
    constructor(
        @InjectRepository(WebauthnCredential)
        private credentialRepository: Repository<WebauthnCredential>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private configService: ConfigService,
        private challengeStore: WebauthnChallengeStore,
    ) { }

    private get rpName() {
        return this.configService.get('WEBAUTHN_RP_NAME') as string;
    }
    private get rpID() {
        return this.configService.get('WEBAUTHN_RP_ID') as string;
    }
    private get origin() {
        return this.configService.get('WEBAUTHN_ORIGIN') as string;
    }

    // ============ REGISTRASI (user sudah login, mau tambahkan biometrik) ============

    async generateRegistrationOptions(userId: number) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User tidak ditemukan');

        const existingCredentials = await this.credentialRepository.find({
            where: { user: { id: userId } },
        });

        const options = await generateRegistrationOptions({
            rpName: this.rpName,
            rpID: this.rpID,
            userName: user.email,
            userDisplayName: user.fullName,
            attestationType: 'none',
            excludeCredentials: existingCredentials.map((cred) => ({
                id: cred.credentialId,
                transports: cred.transports ? JSON.parse(cred.transports) : undefined,
            })),
            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: 'preferred',
                authenticatorAttachment: 'platform', // wajib biometrik built-in device, bukan USB key
            },
        });

        this.challengeStore.set(`register:${userId}`, options.challenge);
        return options;
    }

    async verifyRegistration(userId: number, response: any, nickname?: string) {
        const expectedChallenge = this.challengeStore.get(`register:${userId}`);
        if (!expectedChallenge) {
            throw new BadRequestException('Sesi registrasi kedaluwarsa, coba lagi');
        }

        const verification = await verifyRegistrationResponse({
            response,
            expectedChallenge,
            expectedOrigin: this.origin,
            expectedRPID: this.rpID,
            requireUserVerification: false,
        });

        if (!verification.verified || !verification.registrationInfo) {
            throw new BadRequestException('Verifikasi biometrik gagal');
        }

        const { credential } = verification.registrationInfo;

        const saved = this.credentialRepository.create({
            user: { id: userId } as User,
            credentialId: credential.id,
            publicKey: Buffer.from(credential.publicKey).toString('base64'),
            counter: credential.counter,
            transports: credential.transports
                ? JSON.stringify(credential.transports)
                : undefined,
            nickname: nickname || 'Perangkat Saya',
        });
        await this.credentialRepository.save(saved);

        this.challengeStore.clear(`register:${userId}`);

        return { message: 'Biometrik berhasil diaktifkan' };
    }

    // ============ LOGIN (belum login, pakai biometrik untuk masuk) ============

    async generateAuthenticationOptions(email: string) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException(
                'Email tidak ditemukan atau belum mengaktifkan biometrik',
            );
        }

        const credentials = await this.credentialRepository.find({
            where: { user: { id: user.id } },
        });

        if (credentials.length === 0) {
            throw new BadRequestException('Akun ini belum mengaktifkan login biometrik');
        }

        const options = await generateAuthenticationOptions({
            rpID: this.rpID,
            userVerification: 'preferred',
            allowCredentials: credentials.map((cred) => ({
                id: cred.credentialId,
                transports: cred.transports ? JSON.parse(cred.transports) : undefined,
            })),
        });

        this.challengeStore.set(`login:${email}`, options.challenge);
        return options;
    }

    async verifyAuthentication(email: string, response: any) {
        const expectedChallenge = this.challengeStore.get(`login:${email}`);
        if (!expectedChallenge) {
            throw new BadRequestException('Sesi login kedaluwarsa, coba lagi');
        }

        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundException('User tidak ditemukan');

        const credential = await this.credentialRepository.findOne({
            where: { credentialId: response.id },
        });

        if (!credential) {
            throw new BadRequestException('Kredensial biometrik tidak dikenali');
        }

        const verification = await verifyAuthenticationResponse({
            response,
            expectedChallenge,
            expectedOrigin: this.origin,
            expectedRPID: this.rpID,
            credential: {
                id: credential.credentialId,
                publicKey: Buffer.from(credential.publicKey, 'base64'),
                counter: Number(credential.counter),
                transports: credential.transports
                    ? JSON.parse(credential.transports)
                    : undefined,
            },
            requireUserVerification: false,
        });

        if (!verification.verified) {
            throw new BadRequestException('Verifikasi biometrik gagal');
        }

        // Update counter untuk mencegah replay attack
        credential.counter = verification.authenticationInfo.newCounter;
        await this.credentialRepository.save(credential);

        this.challengeStore.clear(`login:${email}`);

        return user;
    }

    async getUserCredentials(userId: number) {
        const credentials = await this.credentialRepository.find({
            where: { user: { id: userId } },
            select: { id: true, nickname: true, createdAt: true },
        });
        return credentials;
    }

    async removeCredential(userId: number, credentialDbId: number) {
        const credential = await this.credentialRepository.findOne({
            where: { id: credentialDbId, user: { id: userId } },
        });
        if (!credential) throw new NotFoundException('Kredensial tidak ditemukan');
        await this.credentialRepository.remove(credential);
        return { message: 'Biometrik berhasil dihapus' };
    }
}