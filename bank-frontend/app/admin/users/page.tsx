'use client';

import { useEffect, useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import api from '@/lib/api';
import { AdminUsersResponse } from '@/types';

export default function AdminUsersPage() {
    const { ready } = useAdminAuth();
    const [result, setResult] = useState<AdminUsersResponse | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get<AdminUsersResponse>(`/admin/users?page=${page}&limit=10`);
            setResult(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!ready) return;
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, page]);

    const handleToggleFreeze = async (accountId: number) => {
        setActionLoadingId(accountId);
        try {
            await api.patch(`/admin/accounts/${accountId}/freeze`);
            await fetchUsers(); // refresh data biar status terbaru muncul
        } catch (err: any) {
            alert(err.response?.data?.message || 'Gagal update status akun');
        } finally {
            setActionLoadingId(null);
        }
    };

    if (!ready) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar />
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-xl font-bold mb-6">Semua User</h1>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-3">Nama</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">No. Rekening</th>
                                <th className="p-3">Saldo</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading && (
                                <tr>
                                    <td colSpan={7} className="p-6 text-center text-gray-500">
                                        Memuat...
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                result?.data.map((user) => (
                                    <tr key={user.id}>
                                        <td className="p-3 font-medium">{user.fullName}</td>
                                        <td className="p-3 text-gray-600">{user.email}</td>
                                        <td className="p-3 font-mono">{user.account?.accountNumber || '-'}</td>
                                        <td className="p-3">
                                            Rp{' '}
                                            {new Intl.NumberFormat('id-ID').format(
                                                parseFloat(user.account?.balance || '0'),
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`text-xs px-2 py-1 rounded ${user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            {user.account?.isFrozen ? (
                                                <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">
                                                    Dibekukan
                                                </span>
                                            ) : (
                                                <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                                                    Aktif
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            {user.account && (
                                                <button
                                                    onClick={() => handleToggleFreeze(user.account.id)}
                                                    disabled={actionLoadingId === user.account.id}
                                                    className={`text-xs px-3 py-1 rounded disabled:opacity-50 ${user.account.isFrozen
                                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                                        : 'bg-red-600 text-white hover:bg-red-700'
                                                        }`}
                                                >
                                                    {actionLoadingId === user.account.id
                                                        ? '...'
                                                        : user.account.isFrozen
                                                            ? 'Aktifkan'
                                                            : 'Bekukan'}
                                                </button>
                                            )}
                                        </td>
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