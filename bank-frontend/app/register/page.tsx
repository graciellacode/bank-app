'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';
import { RegisterResponse } from '@/types';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ fullName: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const strength = calculateStrength(form.password);

    function calculateStrength(val: string) {
        let s = 0;
        if (val.length > 5) s += 25;
        if (val.length > 8) s += 25;
        if (/[A-Z]/.test(val)) s += 25;
        if (/[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val)) s += 25;
        return s;
    }

    const strengthColor =
        strength === 0
            ? 'bg-error'
            : strength <= 25
                ? 'bg-error'
                : strength <= 75
                    ? 'bg-secondary'
                    : 'bg-tertiary-container';

    const strengthLabel =
        strength === 0
            ? 'Kekuatan: -'
            : strength <= 25
                ? 'Kekuatan: Lemah'
                : strength <= 75
                    ? 'Kekuatan: Sedang'
                    : 'Kekuatan: Sangat Kuat';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post<RegisterResponse>('/auth/register', form);
            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registrasi gagal, coba lagi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-surface-container dark:from-on-background dark:to-inverse-surface flex items-center justify-center p-5 py-12 relative">
            <header className="fixed top-0 left-0 w-full h-16 flex justify-between items-center px-5 z-50">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Bankku
                </span>
                <ThemeToggle />
            </header>

            <main className="w-full max-w-[480px] mt-8">
                <div className="glass-card rounded-3xl p-8 md:p-10">
                    <div className="flex flex-col items-center mb-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-primary text-4xl">
                                shield_person
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-on-surface dark:text-inverse-on-surface mb-2">
                            Mulai Perjalananmu
                        </h2>
                        <p className="text-on-surface-variant dark:text-outline-variant text-sm">
                            Buat akun untuk kelola keuangan lebih aman dan cerdas.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-error-container text-on-error-container text-sm p-3 rounded-xl mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-on-surface dark:text-inverse-on-surface ml-1">
                                Nama Lengkap
                            </label>
                            <div className="flex items-center bg-surface-container-low dark:bg-inverse-surface border border-transparent rounded-xl px-4 py-3 focus-within:border-primary transition-all">
                                <span className="material-symbols-outlined text-outline mr-3">person</span>
                                <input
                                    name="fullName"
                                    type="text"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Masukkan nama lengkap"
                                    className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface dark:text-inverse-on-surface placeholder:text-outline text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-on-surface dark:text-inverse-on-surface ml-1">
                                Email
                            </label>
                            <div className="flex items-center bg-surface-container-low dark:bg-inverse-surface border border-transparent rounded-xl px-4 py-3 focus-within:border-primary transition-all">
                                <span className="material-symbols-outlined text-outline mr-3">mail</span>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="contoh@email.com"
                                    className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface dark:text-inverse-on-surface placeholder:text-outline text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-on-surface dark:text-inverse-on-surface ml-1">
                                Password
                            </label>
                            <div className="flex items-center bg-surface-container-low dark:bg-inverse-surface border border-transparent rounded-xl px-4 py-3 focus-within:border-primary transition-all">
                                <span className="material-symbols-outlined text-outline mr-3">lock</span>
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    placeholder="Masukkan password"
                                    className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface dark:text-inverse-on-surface placeholder:text-outline text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-outline hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>

                            <div className="mt-3 px-1">
                                <div className="h-1.5 w-full bg-surface-container-highest dark:bg-inverse-surface rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${strengthColor}`}
                                        style={{ width: `${strength}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-[11px] text-outline uppercase tracking-wider">
                                        {strengthLabel}
                                    </span>
                                    <span className="text-[11px] text-outline">Min. 8 Karakter</span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-br from-primary to-secondary text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all disabled:opacity-50 mt-2"
                        >
                            {loading ? 'Memproses...' : 'Daftar Sekarang'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-on-surface-variant dark:text-outline-variant">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="text-primary font-bold hover:underline">
                                Login di sini
                            </Link>
                        </p>

                        <div className="mt-6 flex items-center gap-4 before:h-px before:flex-1 before:bg-outline-variant after:h-px after:flex-1 after:bg-outline-variant">
                            <span className="text-[11px] text-outline-variant uppercase">
                                Atau daftar dengan
                            </span>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <button
                                type="button"
                                onClick={() => alert('Google OAuth belum tersedia — akan segera hadir')}
                                className="flex-1 py-3 bg-white dark:bg-inverse-surface border border-outline-variant rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container active:scale-95 transition-all"
                            >
                                <span className="text-sm font-bold text-on-surface dark:text-inverse-on-surface">
                                    Google
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => alert('Apple Sign In belum tersedia — akan segera hadir')}
                                className="flex-1 py-3 bg-white dark:bg-inverse-surface border border-outline-variant rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container active:scale-95 transition-all"
                            >
                                <span className="text-sm font-bold text-on-surface dark:text-inverse-on-surface">
                                    Apple
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-outline text-[12px] px-4">
                    Dengan mendaftar, Anda menyetujui Syarat & Ketentuan serta Kebijakan Privasi kami.
                </p>
            </main>
        </div>
    );
}