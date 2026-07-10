'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';
import BottomNav from '@/components/BottomNav';
import { Account, TopUpResponse } from '@/types';

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000, 1000000];

export default function TopUpPage() {
    const router = useRouter();
    const { ready } = useAuth();
    const [account, setAccount] = useState<Account | null>(null);
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState<TopUpResponse | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!ready) return;
        api.get<Account>('/accounts/me').then((res) => setAccount(res.data));
    }, [ready]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(null);
        setLoading(true);
        try {
            const res = await api.post<TopUpResponse>('/topup', {
                amount: Number(amount),
            });
            setSuccess(res.data);
            setAmount('');
            // Refresh saldo yang ditampilkan
            const accRes = await api.get<Account>('/accounts/me');
            setAccount(accRes.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Top up gagal');
        } finally {
            setLoading(false);
        }
    };

    const displayAmount = amount
        ? new Intl.NumberFormat('id-ID').format(Number(amount))
        : '';

    if (!ready) return null;

    return (
        <div className="min-h-screen bg-background dark:bg-on-background pb-32">
            <header className="bg-surface/80 dark:bg-on-background/80 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center px-5 h-16 w-full border-b border-white/20 dark:border-outline-variant/10 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high dark:hover:bg-inverse-surface active:scale-90 transition-all"
                    >
                        <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim">
                            arrow_back
                        </span>
                    </button>
                    <h1 className="text-lg font-bold text-on-surface dark:text-inverse-on-surface">
                        Top Up
                    </h1>
                </div>
                <ThemeToggle />
            </header>

            <main className="max-w-[600px] mx-auto px-5 py-6 space-y-6">
                {/* Info Banner */}
                <section className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary shrink-0">info</span>
                    <p className="text-primary text-sm">
                        Top up simulasi, tidak terhubung ke bank asli
                    </p>
                </section>

                {error && (
                    <div className="bg-error-container text-on-error-container text-sm p-3 rounded-xl">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-tertiary/10 border border-tertiary/20 text-tertiary text-sm p-3 rounded-xl flex items-center gap-2">
                        <span className="material-symbols-outlined">check_circle</span>
                        Top up berhasil! Saldo baru: Rp{' '}
                        {new Intl.NumberFormat('id-ID').format(success.newBalance)}
                    </div>
                )}

                {/* Current Balance Preview */}
                <section className="space-y-2">
                    <h3 className="text-sm text-on-surface-variant dark:text-outline-variant px-1">
                        Saldo Saat Ini
                    </h3>
                    <div className="glass-card p-4 rounded-3xl flex items-center justify-between shadow-sm border border-outline-variant/30 dark:border-outline-variant/10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <span
                                    className="material-symbols-outlined text-primary"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                    account_balance_wallet
                                </span>
                            </div>
                            <div>
                                <p className="font-bold text-on-surface dark:text-inverse-on-surface">
                                    Rp{' '}
                                    {new Intl.NumberFormat('id-ID').format(
                                        parseFloat(account?.balance || '0'),
                                    )}
                                </p>
                                <p className="text-xs text-outline">
                                    {account?.accountNumber}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Amount Input */}
                <form onSubmit={handleSubmit}>
                    <section className="space-y-4">
                        <h3 className="text-sm text-on-surface-variant dark:text-outline-variant px-1">
                            Nominal Top Up
                        </h3>
                        <div className="glass-card p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] text-center relative overflow-hidden">
                            <label className="block text-xs uppercase tracking-widest text-outline font-bold mb-4">
                                Input Jumlah
                            </label>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-2xl font-bold text-primary dark:text-primary-fixed-dim">
                                    Rp
                                </span>
                                <input
                                    value={displayAmount}
                                    onChange={(e) => {
                                        const raw = e.target.value.replace(/\D/g, '');
                                        setAmount(raw);
                                    }}
                                    placeholder="0"
                                    inputMode="numeric"
                                    className="bg-transparent border-none focus:ring-0 focus:outline-none text-3xl font-bold w-48 text-left p-0 text-on-surface dark:text-inverse-on-surface placeholder:text-surface-dim"
                                />
                            </div>

                            <div className="h-px w-full bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent my-6" />

                            <div className="grid grid-cols-3 gap-3">
                                {QUICK_AMOUNTS.slice(0, 4).map((val) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setAmount(String(val))}
                                        className={`px-4 py-2 rounded-xl border font-medium text-sm transition-all active:scale-95 ${Number(amount) === val
                                            ? 'bg-primary-container text-on-primary-container border-primary'
                                            : 'border-outline-variant/50 text-on-surface-variant dark:text-outline-variant hover:bg-primary-container/20'
                                            }`}
                                    >
                                        {val / 1000}rb
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setAmount(String(QUICK_AMOUNTS[4]))}
                                    className={`col-span-2 px-4 py-2 rounded-xl border font-medium text-sm transition-all active:scale-95 ${Number(amount) === QUICK_AMOUNTS[4]
                                        ? 'bg-primary-container text-on-primary-container border-primary'
                                        : 'border-outline-variant/50 text-on-surface-variant dark:text-outline-variant hover:bg-primary-container/20'
                                        }`}
                                >
                                    1jt
                                </button>
                            </div>
                        </div>
                    </section>

                    <div className="fixed bottom-20 left-0 w-full px-5 z-40 md:static md:mt-6 md:px-0">
                        <div className="max-w-[600px] mx-auto">
                            <button
                                type="submit"
                                disabled={loading || Number(amount) < 10000}
                                className="w-full py-4 bg-gradient-to-br from-primary to-secondary text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <span>{loading ? 'Memproses...' : 'Top Up Sekarang'}</span>
                                {!loading && <span className="material-symbols-outlined">bolt</span>}
                            </button>
                        </div>
                    </div>
                </form>
            </main>

            <BottomNav />
        </div>
    );
}