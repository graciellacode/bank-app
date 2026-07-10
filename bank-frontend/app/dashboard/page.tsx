'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Account, Transaction } from '@/types';
import ThemeToggle from '@/components/ThemeToggle';
import BottomNav from '@/components/BottomNav';

export default function DashboardPage() {
    const { user, ready } = useAuth();
    const [account, setAccount] = useState<Account | null>(null);
    const [recentTx, setRecentTx] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showBalance, setShowBalance] = useState(true);

    useEffect(() => {
        if (!ready) return;

        Promise.all([
            api.get<Account>('/accounts/me'),
            api.get<{ data: Transaction[] }>('/transactions?page=1&limit=3'),
        ])
            .then(([accRes, txRes]) => {
                setAccount(accRes.data);
                setRecentTx(txRes.data.data);
            })
            .finally(() => setLoading(false));
    }, [ready]);

    if (!ready) return null;

    return (
        <div className="min-h-screen bg-background dark:bg-on-background pb-32">
            {/* Top App Bar */}
            <header className="bg-surface/80 dark:bg-on-background/80 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center px-5 h-16 w-full border-b border-white/20 dark:border-outline-variant/10 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                        {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Bankku
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <button className="material-symbols-outlined text-primary dark:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-inverse-surface p-2 rounded-full active:scale-95 transition-all">
                        notifications
                    </button>
                </div>
            </header>

            <main className="px-5 py-6 max-w-[600px] mx-auto">
                {/* Welcome Header */}
                <section className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-on-surface dark:text-inverse-on-surface">
                        Halo, {user?.fullName?.split(' ')[0]}{' '}
                        <span className="inline-block animate-wave text-3xl">👋</span>
                    </h1>
                    <p className="text-on-surface-variant dark:text-outline-variant text-sm mt-1">
                        Kelola finansialmu dengan mudah hari ini.
                    </p>
                </section>

                {/* Balance Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,74,198,0.3)] text-white mb-6 transition-transform hover:scale-[1.01] duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-sm opacity-80 mb-1">Saldo Anda</p>
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold tracking-tight">
                                    {loading
                                        ? '...'
                                        : showBalance
                                            ? `Rp ${new Intl.NumberFormat('id-ID').format(
                                                parseFloat(account?.balance || '0'),
                                            )}`
                                            : 'Rp ••••••••'}
                                </span>
                                <button
                                    onClick={() => setShowBalance(!showBalance)}
                                    className="material-symbols-outlined cursor-pointer hover:opacity-70 transition-opacity"
                                >
                                    {showBalance ? 'visibility' : 'visibility_off'}
                                </button>
                            </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                            <span className="material-symbols-outlined">account_balance_wallet</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[10px] opacity-60 mb-1 uppercase tracking-wider">
                                Nomor Rekening
                            </p>
                            <p className="font-mono tracking-widest text-sm">
                                {account?.accountNumber || '••••••••••'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                    <Link href="/transfer" className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-active:scale-90 transition-transform">
                            <span className="material-symbols-outlined text-[26px]">swap_horiz</span>
                        </div>
                        <span className="text-xs text-on-surface dark:text-inverse-on-surface">
                            Transfer
                        </span>
                    </Link>
                    <Link href="/topup" className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-active:scale-90 transition-transform">
                            <span className="material-symbols-outlined text-[26px]">account_balance</span>
                        </div>
                        <span className="text-xs text-on-surface dark:text-inverse-on-surface">
                            Top Up
                        </span>
                    </Link>
                    <Link href="/transactions" className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary group-active:scale-90 transition-transform">
                            <span className="material-symbols-outlined text-[26px]">history</span>
                        </div>
                        <span className="text-xs text-on-surface dark:text-inverse-on-surface">
                            Riwayat
                        </span>
                    </Link>
                    <Link href="/profile" className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 rounded-full bg-outline/10 flex items-center justify-center text-outline group-active:scale-90 transition-transform">
                            <span className="material-symbols-outlined text-[26px]">person</span>
                        </div>
                        <span className="text-xs text-on-surface dark:text-inverse-on-surface">
                            Profil
                        </span>
                    </Link>
                </div>

                {/* Recent Transactions */}
                <section className="bg-surface-container-lowest dark:bg-inverse-surface rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-bold text-on-surface dark:text-inverse-on-surface">
                            Transaksi Terakhir
                        </h3>
                        <Link
                            href="/transactions"
                            className="text-primary dark:text-primary-fixed-dim text-sm font-bold hover:underline"
                        >
                            Lihat Semua
                        </Link>
                    </div>

                    <div className="space-y-2">
                        {loading && (
                            <p className="text-center text-outline text-sm py-6">Memuat...</p>
                        )}

                        {!loading && recentTx.length === 0 && (
                            <p className="text-center text-outline text-sm py-6">
                                Belum ada transaksi
                            </p>
                        )}

                        {!loading &&
                            recentTx.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container dark:hover:bg-on-background transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-11 h-11 rounded-full flex items-center justify-center ${tx.type === 'credit'
                                                ? 'bg-tertiary/10 text-tertiary'
                                                : 'bg-error/10 text-error'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined">
                                                {tx.type === 'credit' ? 'south_west' : 'north_east'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-on-surface dark:text-inverse-on-surface">
                                                {tx.description}
                                            </p>
                                            <p className="text-xs text-outline">
                                                {new Date(tx.createdAt).toLocaleString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`font-bold text-sm ${tx.type === 'credit' ? 'text-tertiary' : 'text-error'
                                            }`}
                                    >
                                        {tx.type === 'credit' ? '+' : '-'} Rp{' '}
                                        {new Intl.NumberFormat('id-ID').format(Number(tx.amount))}
                                    </span>
                                </div>
                            ))}
                    </div>
                </section>
            </main>

            <BottomNav />
        </div>
    );
}