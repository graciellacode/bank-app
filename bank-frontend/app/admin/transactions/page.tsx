'use client';

import { useEffect, useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import api from '@/lib/api';
import { AdminTransactionsResponse } from '@/types';

export default function AdminTransactionsPage() {
    const { ready } = useAdminAuth();
    const [result, setResult] = useState<AdminTransactionsResponse | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!ready) return;

        setLoading(true);
        api
            .get<AdminTransactionsResponse>(`/admin/transactions?page=${page}&limit=20`)
            .then((res) => setResult(res.data))
            .finally(() => setLoading(false));
    }, [ready, page]);

    if (!ready) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar />
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-xl font-bold mb-6">Semua Transaksi</h1>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-3">Waktu</th>
                                <th className="p-3">Pemilik</th>
                                <th className="p-3">No. Rekening</th>
                                <th className="p-3">Tipe</th>
                                <th className="p-3">Jumlah</th>
                                <th className="p-3">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading && (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-gray-500">
                                        Memuat...
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                result?.data.map((tx) => (
                                    <tr key={tx.id}>
                                        <td className="p-3 text-gray-500 whitespace-nowrap">
                                            {new Date(tx.createdAt).toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-3 font-medium">{tx.account.user.fullName}</td>
                                        <td className="p-3 font-mono">{tx.account.accountNumber}</td>
                                        <td className="p-3">
                                            <span
                                                className={`text-xs px-2 py-1 rounded ${tx.type === 'credit'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td
                                            className={`p-3 font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                                }`}
                                        >
                                            {tx.type === 'credit' ? '+' : '-'} Rp{' '}
                                            {new Intl.NumberFormat('id-ID').format(Number(tx.amount))}
                                        </td>
                                        <td className="p-3 text-gray-600">{tx.description}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {result && result.meta.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 text-sm border rounded disabled:opacity-50 bg-white"
                        >
                            Sebelumnya
                        </button>
                        <span className="px-3 py-1 text-sm">
                            Halaman {result.meta.page} dari {result.meta.totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(result.meta.totalPages, p + 1))}
                            disabled={page === result.meta.totalPages}
                            className="px-3 py-1 text-sm border rounded disabled:opacity-50 bg-white"
                        >
                            Selanjutnya
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}