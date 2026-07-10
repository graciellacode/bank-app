'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';
import BottomNav from '@/components/BottomNav';
import { Account, InquiryResponse, TransferResponse } from '@/types';

type Step = 'form' | 'confirm' | 'success';

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000];

export default function TransferPage() {
    const router = useRouter();
    const { ready } = useAuth();
    const [step, setStep] = useState<Step>('form');

    const [account, setAccount] = useState<Account | null>(null);
    const [form, setForm] = useState({ toAccountNumber: '', amount: '', note: '' });
    const [recipient, setRecipient] = useState<InquiryResponse | null>(null);
    const [result, setResult] = useState<TransferResponse | null>(null);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [inquiryLoading, setInquiryLoading] = useState(false);

    useEffect(() => {
        if (!ready) return;
        api.get<Account>('/accounts/me').then((res) => setAccount(res.data));
    }, [ready]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleQuickAmount = (val: number) => {
        setForm({ ...form, amount: String(val) });
    };

    const isFormValid = form.toAccountNumber.length >= 5 && Number(form.amount) > 0;

    const handleCheckAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        setError('');
        setInquiryLoading(true);
        try {
            const res = await api.get<InquiryResponse>(
                `/accounts/inquiry/${form.toAccountNumber}`,
            );
            setRecipient(res.data);
            setStep('confirm');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Nomor rekening tidak ditemukan');
        } finally {
            setInquiryLoading(false);
        }
    };

    const handleConfirmTransfer = async () => {
        setError('');
        setLoading(true);
        try {
            const res = await api.post<TransferResponse>('/transfer', {
                toAccountNumber: form.toAccountNumber,
                amount: Number(form.amount),
                note: form.note || undefined,
            });
            setResult(res.data);
            setStep('success');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Transfer gagal');
            setStep('form');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToForm = () => {
        setStep('form');
        setError('');
    };

    const initials = recipient?.accountHolderName
        ?.split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    if (!ready) return null;

    // ================= STEP: SUCCESS =================
    if (step === 'success' && result) {
        return (
            <div className="min-h-screen bg-background dark:bg-on-background flex flex-col items-center justify-center px-5 py-12 relative overflow-hidden">
                <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-tertiary/10 flex items-center justify-center relative">
                            <div className="absolute inset-0 rounded-full border-4 border-tertiary border-dashed opacity-20 animate-spin [animation-duration:10s]" />
                            <div className="w-16 h-16 rounded-full bg-tertiary flex items-center justify-center shadow-xl">
                                <span
                                    className="material-symbols-outlined text-white text-5xl"
                                    style={{ fontVariationSettings: "'wght' 700" }}
                                >
                                    check
                                </span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold text-on-background dark:text-background mb-2 text-center">
                        Transfer Berhasil!
                    </h1>
                    <p className="text-on-surface-variant dark:text-outline-variant text-center mb-6 max-w-[280px]">
                        Dana Anda telah sukses terkirim ke rekening tujuan.
                    </p>

                    <div className="w-full bg-surface-container-lowest dark:bg-inverse-surface border border-white/40 dark:border-outline-variant/10 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] mb-6">
                        <div className="flex flex-col items-center pb-4 border-b border-outline-variant/30">
                            <span className="text-xs text-outline mb-1 uppercase tracking-widest">
                                Jumlah Terkirim
                            </span>
                            <span className="text-2xl font-bold text-primary dark:text-primary-fixed-dim">
                                Rp {new Intl.NumberFormat('id-ID').format(Number(form.amount))}
                            </span>
                        </div>

                        <div className="space-y-3 py-4">
                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant dark:text-outline-variant text-sm">
                                    Penerima
                                </span>
                                <span className="text-on-surface dark:text-inverse-on-surface font-medium text-right">
                                    {recipient?.accountHolderName}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant dark:text-outline-variant text-sm">
                                    No. Rekening
                                </span>
                                <span className="text-on-surface dark:text-inverse-on-surface text-sm font-mono">
                                    {form.toAccountNumber}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant dark:text-outline-variant text-sm">
                                    ID Transaksi
                                </span>
                                <span className="font-mono text-sm text-on-surface dark:text-inverse-on-surface">
                                    TRX-{result.transferId.toString().padStart(6, '0')}
                                </span>
                            </div>
                        </div>

                        <div className="bg-surface-container-low dark:bg-on-background rounded-xl p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-outline text-lg">
                                    account_balance_wallet
                                </span>
                                <span className="text-on-surface-variant dark:text-outline-variant text-sm">
                                    Sisa Saldo
                                </span>
                            </div>
                            <span className="text-on-surface dark:text-inverse-on-surface font-bold">
                                Rp {new Intl.NumberFormat('id-ID').format(result.newBalance)}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full py-4 px-6 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        Kembali ke Dashboard
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                </div>
            </div>
        );
    }

    // ================= STEP: FORM & CONFIRM =================
    return (
        <div className="min-h-screen bg-background dark:bg-on-background pb-32">
            <header className="bg-surface/80 dark:bg-on-background/80 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center px-5 h-16 w-full border-b border-white/20 dark:border-outline-variant/10 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => (step === 'confirm' ? handleBackToForm() : router.back())}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high dark:hover:bg-inverse-surface active:scale-90 transition-all"
                    >
                        <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim">
                            arrow_back
                        </span>
                    </button>
                    <h1 className="text-lg font-bold text-on-surface dark:text-inverse-on-surface">
                        Transfer
                    </h1>
                </div>
                <ThemeToggle />
            </header>

            <main className="max-w-[600px] mx-auto px-5 py-6">
                {error && (
                    <div className="bg-error-container text-on-error-container text-sm p-3 rounded-xl mb-4">
                        {error}
                    </div>
                )}

                {/* ===== STEP FORM ===== */}
                {step === 'form' && (
                    <>
                        <div className="w-full p-6 rounded-3xl bg-gradient-to-br from-primary to-secondary text-white shadow-xl mb-6 relative overflow-hidden">
                            <p className="text-white/70 text-sm mb-1">Saldo Aktif</p>
                            <span className="text-2xl font-bold">
                                Rp {new Intl.NumberFormat('id-ID').format(parseFloat(account?.balance || '0'))}
                            </span>
                        </div>

                        <form onSubmit={handleCheckAccount} className="space-y-6">
                            <section className="space-y-2">
                                <label className="text-sm text-on-surface-variant dark:text-outline-variant px-1">
                                    Rekening Tujuan
                                </label>
                                <div className="relative flex items-center">
                                    <span className="material-symbols-outlined absolute left-4 text-outline">
                                        account_balance_wallet
                                    </span>
                                    <input
                                        name="toAccountNumber"
                                        value={form.toAccountNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder="Masukkan nomor rekening"
                                        className="w-full h-14 pl-12 pr-4 bg-surface-container-low dark:bg-inverse-surface border-none rounded-xl text-on-surface dark:text-inverse-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                    />
                                </div>
                            </section>

                            <section className="space-y-2">
                                <label className="text-sm text-on-surface-variant dark:text-outline-variant px-1">
                                    Nominal Transfer
                                </label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-bold text-primary dark:text-primary-fixed-dim">
                                        Rp
                                    </span>
                                    <input
                                        name="amount"
                                        type="number"
                                        value={form.amount}
                                        onChange={handleChange}
                                        required
                                        min={1000}
                                        placeholder="0"
                                        className="w-full h-24 pl-16 pr-6 bg-surface-container-low dark:bg-inverse-surface border-none rounded-3xl text-2xl font-bold text-on-surface dark:text-inverse-on-surface placeholder:text-outline/30 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-4 gap-2 mt-3">
                                    {QUICK_AMOUNTS.map((val) => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => handleQuickAmount(val)}
                                            className={`h-11 flex items-center justify-center border rounded-xl text-sm transition-all active:scale-95 ${Number(form.amount) === val
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white dark:bg-inverse-surface border-outline-variant text-on-surface dark:text-inverse-on-surface hover:border-primary hover:text-primary'
                                                }`}
                                        >
                                            {val / 1000}rb
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-2">
                                <label className="text-sm text-on-surface-variant dark:text-outline-variant px-1">
                                    Catatan (opsional)
                                </label>
                                <textarea
                                    name="note"
                                    value={form.note}
                                    onChange={handleChange}
                                    placeholder="Tambahkan pesan..."
                                    rows={3}
                                    className="w-full p-4 bg-surface-container-low dark:bg-inverse-surface border-none rounded-2xl text-on-surface dark:text-inverse-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
                                />
                            </section>

                            <button
                                type="submit"
                                disabled={!isFormValid || inquiryLoading}
                                className="w-full h-14 bg-gradient-to-br from-primary to-secondary text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {inquiryLoading ? 'Mengecek...' : 'Lanjutkan'}
                                {!inquiryLoading && (
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                )}
                            </button>
                        </form>
                    </>
                )}

                {/* ===== STEP CONFIRM ===== */}
                {step === 'confirm' && recipient && (
                    <section className="space-y-6">
                        <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg ring-4 ring-white dark:ring-inverse-surface">
                                    {initials}
                                </div>
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <h2 className="text-xl font-bold text-on-surface dark:text-inverse-on-surface">
                                        {recipient.accountHolderName}
                                    </h2>
                                    <span
                                        className="material-symbols-outlined text-primary text-xl"
                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                    >
                                        verified
                                    </span>
                                </div>
                                <p className="font-mono text-outline tracking-wider text-sm">
                                    {recipient.accountNumber}
                                </p>
                            </div>
                        </div>

                        <div className="glass-card rounded-3xl p-6 space-y-4">
                            <h3 className="text-sm text-on-surface-variant dark:text-outline-variant border-b border-outline-variant/20 pb-2">
                                Detail Transaksi
                            </h3>
                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant dark:text-outline-variant text-sm">
                                    Jumlah
                                </span>
                                <span className="text-on-surface dark:text-inverse-on-surface font-bold">
                                    Rp {new Intl.NumberFormat('id-ID').format(Number(form.amount))}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant dark:text-outline-variant text-sm">
                                    Biaya Admin
                                </span>
                                <span className="text-tertiary font-bold text-sm px-2 py-0.5 bg-tertiary/10 rounded-lg">
                                    Gratis
                                </span>
                            </div>
                            {form.note && (
                                <div className="flex justify-between items-center">
                                    <span className="text-on-surface-variant dark:text-outline-variant text-sm">
                                        Catatan
                                    </span>
                                    <span className="text-on-surface dark:text-inverse-on-surface text-sm">
                                        {form.note}
                                    </span>
                                </div>
                            )}
                            <div className="pt-4 mt-2 border-t border-dashed border-outline-variant/50 flex justify-between items-center">
                                <span className="text-on-surface dark:text-inverse-on-surface font-bold">
                                    Total Pembayaran
                                </span>
                                <span className="text-primary dark:text-primary-fixed-dim font-extrabold text-xl">
                                    Rp {new Intl.NumberFormat('id-ID').format(Number(form.amount))}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 px-2">
                            <span className="material-symbols-outlined text-outline text-xl">info</span>
                            <p className="italic text-outline text-sm leading-tight">
                                Pastikan nama penerima sudah benar untuk menghindari kesalahan pengiriman
                                dana. Transaksi yang sudah diproses tidak dapat dibatalkan.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <button
                                onClick={handleBackToForm}
                                disabled={loading}
                                className="h-14 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-inverse-surface text-on-surface-variant dark:text-outline-variant font-bold border border-slate-200 dark:border-outline-variant/20 active:scale-95 transition-all disabled:opacity-50"
                            >
                                Kembali
                            </button>
                            <button
                                onClick={handleConfirmTransfer}
                                disabled={loading}
                                className="h-14 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white font-bold shadow-lg active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Memproses...' : 'Kirim Transfer'}
                                {!loading && <span className="material-symbols-outlined text-xl">send</span>}
                            </button>
                        </div>
                    </section>
                )}
            </main>

            {step === 'form' && <BottomNav />}
        </div>
    );
}