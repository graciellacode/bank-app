'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
    const pathname = usePathname();

    const links = [
        { href: '/dashboard', label: 'Beranda', icon: 'home' },
        { href: '/transactions', label: 'Riwayat', icon: 'history' },
        { href: '/transfer', label: 'Transfer', icon: 'swap_horiz' },
        { href: '/profile', label: 'Profil', icon: 'person' },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-white/80 dark:bg-inverse-surface/80 backdrop-blur-xl border-t border-white/20 dark:border-outline-variant/20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl">
            {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-transform active:scale-90 ${isActive
                            ? 'text-primary dark:text-primary-fixed-dim font-bold bg-primary/10'
                            : 'text-outline dark:text-outline-variant'
                            }`}
                    >
                        <span
                            className="material-symbols-outlined"
                            style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                        >
                            {link.icon}
                        </span>
                        <span className="text-[11px]">{link.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}