'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';

export function useAdminAuth() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }

        const storedUser = localStorage.getItem('user');
        const parsedUser: User | null = storedUser ? JSON.parse(storedUser) : null;

        // Proteksi tambahan: kalau bukan admin, tendang balik ke dashboard biasa
        if (!parsedUser || parsedUser.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        setUser(parsedUser);
        setReady(true);
    }, [router]);

    return { user, ready };
}