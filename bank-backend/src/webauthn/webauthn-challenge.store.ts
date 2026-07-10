import { Injectable } from '@nestjs/common';

/**
 * Penyimpanan sementara untuk challenge WebAuthn.
 * Challenge hanya perlu hidup beberapa menit selama proses registrasi/login berlangsung,
 * jadi cukup disimpan di memory (tidak perlu tabel database permanen).
 */
@Injectable()
export class WebauthnChallengeStore {
    private store = new Map<string, { challenge: string; expiresAt: number }>();

    set(key: string, challenge: string) {
        this.store.set(key, { challenge, expiresAt: Date.now() + 5 * 60 * 1000 });
    }

    get(key: string): string | null {
        const entry = this.store.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }
        return entry.challenge;
    }

    clear(key: string) {
        this.store.delete(key);
    }
}