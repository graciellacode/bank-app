'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';
import { LoginResponse } from '@/types';
import { loginWithBiometric } from '@/lib/webauthn';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post<LoginResponse>('/auth/login', form);
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            if (res.data.user.role === 'admin') {
                router.push('/admin/users');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login gagal, cek email/password');
        } finally {
            setLoading(false);
        }
    };

    const handleBiometric = async () => {
        const email = form.email || prompt('Masukkan email Anda untuk login biometrik:');
        if (!email) return;

        setError('');
        setLoading(true);
        try {
            const res = await loginWithBiometric(email);
            localStorage.setItem('accessToken', res.accessToken);
            localStorage.setItem('refreshToken', res.refreshToken);
            localStorage.setItem('user', JSON.stringify(res.user));
            router.push(res.user.role === 'admin' ? '/admin/users' : '/dashboard');
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                err.message ||
                'Login biometrik gagal atau dibatalkan',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background dark:bg-on-background flex flex-col justify-center items-center p-5 relative overflow-hidden">
            <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="fixed -top-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />

            <header className="fixed top-0 left-0 w-full h-16 flex justify-between items-center px-5 z-50">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Bankku
                </span>
                <ThemeToggle />
            </header>

            <main className="w-full max-w-[440px] mt-16 mb-8 relative z-10">
                <div className="glass-card rounded-3xl p-8 md:p-10 flex flex-col items-center">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold text-on-surface dark:text-inverse-on-surface mb-2">
                            Selamat Datang
                        </h1>
                        <p className="text-on-surface-variant dark:text-outline-variant text-sm">
                            Silakan masuk untuk melanjutkan transaksi Anda.
                        </p>
                    </div>

                    {error && (
                        <div className="w-full bg-error-container text-on-error-container text-sm p-3 rounded-xl mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-on-surface-variant dark:text-outline-variant px-1">
                                Email
                            </label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                                    mail
                                </span>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="nama@email.com"
                                    className="w-full h-14 pl-12 pr-4 bg-surface-container-low dark:bg-inverse-surface border-2 border-transparent rounded-xl text-on-surface dark:text-inverse-on-surface focus:bg-surface-container-lowest dark:focus:bg-inverse-surface focus:border-primary focus:ring-0 focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-on-surface-variant dark:text-outline-variant px-1">
                                Password
                            </label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                                    lock
                                </span>
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full h-14 pl-12 pr-12 bg-surface-container-low dark:bg-inverse-surface border-2 border-transparent rounded-xl text-on-surface dark:text-inverse-on-surface focus:bg-surface-container-lowest dark:focus:bg-inverse-surface focus:border-primary focus:ring-0 focus:outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant"
                                >
                                    <span className="material-symbols-outlined">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                            <div className="flex justify-end">
                                <Link href="#" className="text-sm text-primary font-bold hover:underline">
                                    Lupa password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 rounded-2xl text-white font-bold flex items-center justify-center gap-2 mt-2 shadow-lg bg-gradient-to-br from-primary to-secondary active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Memproses...' : 'Masuk'}
                            {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                        </button>

                        <button
                            type="button"
                            onClick={handleBiometric}
                            className="w-full h-14 border-2 border-primary/20 rounded-2xl flex items-center justify-center gap-3 text-primary font-bold hover:bg-primary/5 active:scale-95 transition-all"
                        >
                            <span className="material-symbols-outlined">fingerprint</span>
                            <span>Masuk dengan Sidik Jari</span>
                        </button>
                    </form>

                    <div className="w-full flex items-center gap-4 my-8">
                        <div className="h-px flex-1 bg-outline-variant" />
                        <span className="text-sm text-outline">atau</span>
                        <div className="h-px flex-1 bg-outline-variant" />
                    </div>

                    <div className="w-full grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => alert('Google OAuth belum tersedia — akan segera hadir')}
                            className="h-14 border border-outline-variant rounded-2xl flex items-center justify-center gap-3 hover:bg-surface-container-high dark:hover:bg-inverse-surface active:scale-95 transition-all"
                        >
                            <span className="text-sm text-on-surface dark:text-inverse-on-surface">Google</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => alert('Apple Sign In belum tersedia — akan segera hadir')}
                            className="h-14 border border-outline-variant rounded-2xl flex items-center justify-center gap-3 hover:bg-surface-container-high dark:hover:bg-inverse-surface active:scale-95 transition-all"
                        >
                            <span className="text-sm text-on-surface dark:text-inverse-on-surface">Apple</span>
                        </button>
                    </div>

                    <div className="mt-10 text-center">
                        <p className="text-sm text-on-surface-variant dark:text-outline-variant">
                            Belum punya akun?{' '}
                            <Link href="/register" className="text-primary font-bold hover:underline">
                                Daftar di sini
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 opacity-50">
                    <span className="material-symbols-outlined text-[20px] text-on-background dark:text-background">
                        verified_user
                    </span>
                    <span className="text-[12px] uppercase tracking-widest text-on-background dark:text-background">
                        Terenkripsi & Aman
                    </span>
                </div>
            </main>
        </div>
    );
}