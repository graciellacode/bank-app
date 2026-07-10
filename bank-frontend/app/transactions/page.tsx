'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';
import BottomNav from '@/components/BottomNav';
import { Transaction, TransactionHistoryResponse } from '@/types';

type FilterType = 'all' | 'credit' | 'debit';

export default function TransactionsPage() {
    const router = useRouter();
    const { ready } = useAuth();
    const [result, setResult] = useState<TransactionHistoryResponse | null>(null);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState<FilterType>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!ready) return;
        setLoading(true);
        api
            .get<TransactionHistoryResponse>(`/transactions?page=${page}&limit=20`)
            .then((res) => setResult(res.data))
            .finally(() => setLoading(false));
    }, [ready, page]);

    const filtered = useMemo(() => {
        if (!result) return [];
        if (filter === 'all') return result.data;
        return result.data.filter((tx) => tx.type === filter);
    }, [result, filter]);

    // Group transaksi by tanggal (Hari Ini / Kemarin / tanggal biasa)
    const grouped = useMemo(() => {
        const groups: Record<string, Transaction[]> = {};
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        filtered.forEach((tx) => {
            const txDate = new Date(tx.createdAt).toDateString();
            let label: string;
            if (txDate === today) label = 'Hari Ini';
            else if (txDate === yesterday) label = 'Kemarin';
            else
                label = new Date(tx.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                });

            if (!groups[label]) groups[label] = [];
            groups[label].push(tx);
        });

        return groups;
    }, [filtered]);

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
                    <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Riwayat
                    </h1>
                </div>
                <ThemeToggle />
            </header>

            <main className="max-w-[600px] mx-auto pb-6">
                {/* Filter Chips */}
                <div className="px-5 py-4 sticky top-16 bg-background dark:bg-on-background z-40">
                    <div className="flex bg-surface-container-low dark:bg-inverse-surface p-1 rounded-xl items-center gap-1">
                        {(['all', 'credit', 'debit'] as FilterType[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`flex-1 py-2 text-sm rounded-lg transition-all active:scale-95 ${filter === f
                                    ? 'bg-primary text-white font-bold'
                                    : 'text-outline hover:bg-surface-container dark:hover:bg-on-background'
                                    }`}
                            >
                                {f === 'all' ? 'Semua' : f === 'credit' ? 'Masuk' : 'Keluar'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-5 space-y-6">
                    {loading && (
                        <p className="text-center text-outline text-sm py-12">Memuat...</p>
                    )}

                    {!loading && filtered.length === 0 && (
                        <div className="text-center py-16">
                            <span className="material-symbols-outlined text-5xl text-outline-variant mb-2 block">
                                receipt_long
                            </span>
                            <p className="text-outline text-sm">Belum ada transaksi</p>
                        </div>
                    )}

                    {!loading &&
                        Object.entries(grouped).map(([label, txs]) => (
                            <section key={label} className="space-y-3">
                                <h2 className="text-xs text-outline uppercase font-mono tracking-wider">
                                    {label}
                                </h2>
                                <div className="space-y-2">
                                    {txs.map((tx) => (
                                        <div
                                            key={tx.id}
                                            className="bg-surface-container-lowest dark:bg-inverse-surface p-4 rounded-2xl flex items-center justify-between shadow-sm border border-outline-variant/10 active:scale-[0.98] transition-transform"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'credit'
                                                        ? 'bg-tertiary-container/20 text-tertiary'
                                                        : 'bg-error-container text-error'
                                                        }`}
                                                >
                                                    <span className="material-symbols-outlined">
                                                        {tx.type === 'credit' ? 'north_west' : 'south_east'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-on-surface dark:text-inverse-on-surface">
                                                        {tx.description}
                                                    </p>
                                                    <p className="text-xs text-outline">
                                                        {new Date(tx.createdAt).toLocaleTimeString('id-ID', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <p
                                                className={`font-bold ${tx.type === 'credit' ? 'text-tertiary' : 'text-error'
                                                    }`}
                                            >
                                                {tx.type === 'credit' ? '+' : '-'} Rp{' '}
                                                {new Intl.NumberFormat('id-ID').format(Number(tx.amount))}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                </div>

                {/* Pagination */}
                {result && result.meta.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6 px-5">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 text-sm border border-outline-variant rounded-xl disabled:opacity-50 bg-surface-container-lowest dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface"
                        >
                            Sebelumnya
                        </button>
                        <span className="px-4 py-2 text-sm text-on-surface-variant dark:text-outline-variant">
                            {result.meta.page} / {result.meta.totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(result.meta.totalPages, p + 1))}
                            disabled={page === result.meta.totalPages}
                            className="px-4 py-2 text-sm border border-outline-variant rounded-xl disabled:opacity-50 bg-surface-container-lowest dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface"
                        >
                            Selanjutnya
                        </button>
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}