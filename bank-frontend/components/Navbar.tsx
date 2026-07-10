'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/api';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch {
            // tetap lanjut
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            router.push('/login');
        }
    };

    return (
        <header className="bg-surface/80 dark:bg-on-background/80 backdrop-blur-xl border-b border-white/20 dark:border-outline-variant/20 shadow-sm sticky top-0 z-50 flex justify-between items-center px-5 h-16 w-full">
            <div className="flex items-center gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Bankku
                </span>
            </div>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                    onClick={handleLogout}
                    className="text-sm text-error font-bold hover:underline px-2"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}