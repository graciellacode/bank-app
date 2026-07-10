'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';
import BottomNav from '@/components/BottomNav';
import { UserProfile } from '@/types';

export default function ProfilePage() {
    const router = useRouter();
    const { ready } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!ready) return;
        api
            .get<UserProfile>('/users/me')
            .then((res) => setProfile(res.data))
            .finally(() => setLoading(false));
    }, [ready]);

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

    const initials = profile?.fullName
        ?.split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    if (!ready) return null;

    return (
        <div className="min-h-screen bg-background dark:bg-on-background pb-32">
            <header className="bg-surface/80 dark:bg-on-background/80 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center px-5 h-16 w-full border-b border-white/20 dark:border-outline-variant/10 shadow-sm">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Profil
                </h1>
                <ThemeToggle />
            </header>

            <main className="max-w-[600px] mx-auto px-5 pt-6">
                {loading ? (
                    <p className="text-center text-outline py-12">Memuat...</p>
                ) : (
                    <>
                        {/* Profile Header */}
                        <section className="flex flex-col items-center mb-6">
                            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-primary to-secondary shadow-xl mb-4">
                                <div className="w-full h-full rounded-full border-4 border-white dark:border-on-background flex items-center justify-center bg-surface-container dark:bg-inverse-surface">
                                    <span className="text-3xl font-bold text-primary dark:text-primary-fixed-dim">
                                        {initials}
                                    </span>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-on-surface dark:text-inverse-on-surface">
                                {profile?.fullName}
                            </h2>
                            <p className="text-sm text-on-surface-variant dark:text-outline-variant">
                                {profile?.email}
                            </p>
                            {profile?.role === 'admin' && (
                                <div className="mt-2 flex items-center gap-2 px-4 py-1 rounded-full bg-purple-100 dark:bg-secondary/20 border border-secondary/30">
                                    <span className="material-symbols-outlined text-[16px] text-secondary">
                                        admin_panel_settings
                                    </span>
                                    <span className="text-xs text-secondary uppercase tracking-wider font-bold">
                                        Admin
                                    </span>
                                </div>
                            )}
                        </section>

                        {/* Account Summary */}
                        <section className="mb-6">
                            <h3 className="text-on-surface-variant dark:text-outline-variant font-bold text-xs uppercase tracking-widest mb-3 ml-1">
                                Rekening Terhubung
                            </h3>
                            <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-3xl shadow-lg relative overflow-hidden">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-white/80 text-sm">Saldo Utama</span>
                                    <span className="material-symbols-outlined text-white/50">
                                        account_balance_wallet
                                    </span>
                                </div>
                                <div className="text-white text-2xl font-bold mb-1">
                                    Rp{' '}
                                    {new Intl.NumberFormat('id-ID').format(
                                        parseFloat(profile?.account?.balance || '0'),
                                    )}
                                </div>
                                <div className="text-white/60 text-sm font-mono">
                                    {profile?.account?.accountNumber}
                                </div>
                            </div>
                        </section>

                        {/* Settings List */}
                        <section className="space-y-2 mb-6">
                            <h3 className="text-on-surface-variant dark:text-outline-variant font-bold text-xs uppercase tracking-widest mb-3 ml-1">
                                Pengaturan & Keamanan
                            </h3>

                            <SettingItem
                                icon="person"
                                title="Informasi Pribadi"
                                subtitle="Nama, email, dan nomor telepon"
                                onClick={() => alert('Halaman edit profil belum tersedia')}
                            />
                            <SettingItem
                                icon="fingerprint"
                                title="Keamanan & Biometrik"
                                subtitle="PIN, Face ID, dan kata sandi"
                                badge="AKTIF"
                                onClick={() => alert('Fitur biometrik belum tersedia')}
                            />
                            <Link href="/profile/notifications">
                                <SettingItem
                                    icon="notifications_active"
                                    title="Pengaturan Notifikasi"
                                    subtitle="Kelola alert dan notifikasi push"
                                />
                            </Link>
                            <SettingItem
                                icon="help_center"
                                title="Pusat Bantuan"
                                subtitle="FAQ, live chat, dan dokumentasi"
                                onClick={() => alert('Pusat bantuan belum tersedia')}
                            />
                        </section>

                        <button
                            onClick={handleLogout}
                            className="w-full p-4 flex items-center justify-center gap-3 bg-error/10 border border-error/20 text-error font-bold rounded-2xl active:scale-95 transition-all"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            <span>Logout</span>
                        </button>

                        <p className="text-center text-outline text-xs mt-6">
                            Bankku v1.0.0 • Portfolio Banking Project
                        </p>
                    </>
                )}
            </main>

            <BottomNav />
        </div>
    );
}

function SettingItem({
    icon,
    title,
    subtitle,
    badge,
    onClick,
}: {
    icon: string;
    title: string;
    subtitle: string;
    badge?: string;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 bg-surface-container-lowest dark:bg-inverse-surface rounded-xl shadow-sm border border-outline-variant/10 hover:bg-surface-bright dark:hover:bg-on-background transition-colors active:scale-[0.99]"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-fixed-dim dark:bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">{icon}</span>
                </div>
                <div className="text-left">
                    <div className="font-bold text-on-surface dark:text-inverse-on-surface text-sm">
                        {title}
                    </div>
                    <div className="text-xs text-on-surface-variant dark:text-outline-variant">
                        {subtitle}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {badge && (
                    <span className="text-[10px] bg-tertiary-container/20 text-tertiary px-2 py-0.5 rounded-full font-bold">
                        {badge}
                    </span>
                )}
                <span className="material-symbols-outlined text-on-surface-variant/40">
                    chevron_right
                </span>
            </div>
        </button>
    );
}