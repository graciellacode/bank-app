'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AdminNavbar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch {
            // tetap lanjut logout walau request gagal
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            router.push('/login');
        }
    };

    const links = [
        { href: '/admin/users', label: 'Semua User' },
        { href: '/admin/transactions', label: 'Semua Transaksi' },
    ];

    return (
        <nav className="bg-gray-900 text-white sticky top-0 z-10">
            <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-6">
                    <span className="font-bold text-sm bg-red-600 px-2 py-1 rounded">
                        ADMIN
                    </span>
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium ${pathname === link.href ? 'text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <button
                    onClick={handleLogout}
                    className="text-sm text-red-400 hover:text-red-300"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}