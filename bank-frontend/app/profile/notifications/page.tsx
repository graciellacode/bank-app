'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';
import ToggleSwitch from '@/components/ToggleSwitch';
import { NotificationPreferences } from '@/types';

export default function NotificationSettingsPage() {
    const router = useRouter();
    const { ready } = useAuth();
    const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!ready) return;
        api
            .get<NotificationPreferences>('/notifications/preferences')
            .then((res) => setPrefs(res.data))
            .finally(() => setLoading(false));
    }, [ready]);

    const handleToggle = (key: keyof NotificationPreferences, value: boolean) => {
        if (!prefs) return;
        setPrefs({ ...prefs, [key]: value });
    };

    const handleSave = async () => {
        if (!prefs) return;
        setSaving(true);
        try {
            await api.patch('/notifications/preferences', {
                pushEnabled: prefs.pushEnabled,
                incomingTransferPush: prefs.incomingTransferPush,
                paymentReminderPush: prefs.paymentReminderPush,
                monthlyStatementEmail: prefs.monthlyStatementEmail,
                highValueSms: prefs.highValueSms,
            });
            alert('Pengaturan berhasil disimpan');
        } catch {
            alert('Gagal menyimpan pengaturan');
        } finally {
            setSaving(false);
        }
    };

    if (!ready || loading || !prefs) {
        return (
            <div className="min-h-screen bg-background dark:bg-on-background flex items-center justify-center">
                <p className="text-outline">Memuat...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background dark:bg-on-background pb-12">
            <header className="bg-surface dark:bg-on-background sticky top-0 z-50 flex justify-between items-center px-5 h-16 w-full">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low dark:bg-inverse-surface hover:bg-surface-container-high transition-colors active:scale-90"
                    >
                        <span className="material-symbols-outlined text-on-surface-variant dark:text-inverse-on-surface">
                            arrow_back
                        </span>
                    </button>
                    <h1 className="text-lg font-bold text-on-surface dark:text-inverse-on-surface">
                        Pengaturan Notifikasi
                    </h1>
                </div>
                <ThemeToggle />
            </header>

            <main className="max-w-[600px] mx-auto px-5 pt-6 space-y-6">
                {/* Hero Banner */}
                <section className="relative rounded-3xl overflow-hidden p-8 bg-primary-container text-white shadow-lg">
                    <h2 className="text-2xl font-bold mb-2">Tetap Terinformasi</h2>
                    <p className="text-sm opacity-90 max-w-[85%]">
                        Atur bagaimana dan kapan kamu menerima notifikasi aktivitas akun dan keamanan.
                    </p>
                </section>

                {/* Push Notifications */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <span
                            className="material-symbols-outlined text-primary"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            notifications_active
                        </span>
                        <h3 className="text-sm font-bold text-on-surface-variant dark:text-outline-variant">
                            Notifikasi Push
                        </h3>
                    </div>
                    <div className="bg-surface-container-lowest dark:bg-inverse-surface rounded-3xl p-2 shadow-sm border border-outline-variant/10">
                        <div className="flex items-center justify-between p-4 border-b border-outline-variant/10">
                            <div>
                                <p className="font-bold text-sm text-on-surface dark:text-inverse-on-surface">
                                    Izinkan Semua Push Notification
                                </p>
                                <p className="text-xs text-on-surface-variant dark:text-outline-variant">
                                    Aktifkan notifikasi instan di perangkatmu
                                </p>
                            </div>
                            <ToggleSwitch
                                checked={prefs.pushEnabled}
                                onChange={(v) => handleToggle('pushEnabled', v)}
                            />
                        </div>

                        <ToggleRow
                            icon="account_balance_wallet"
                            iconColor="text-primary bg-primary/10"
                            title="Transfer Masuk"
                            subtitle="Saat ada dana masuk ke rekening"
                            checked={prefs.incomingTransferPush}
                            onChange={(v) => handleToggle('incomingTransferPush', v)}
                        />
                        <ToggleRow
                            icon="event_repeat"
                            iconColor="text-secondary bg-secondary/10"
                            title="Pengingat Pembayaran"
                            subtitle="Tagihan dan cicilan terjadwal"
                            checked={prefs.paymentReminderPush}
                            onChange={(v) => handleToggle('paymentReminderPush', v)}
                        />
                    </div>
                </section>

                {/* Email Notifications */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <span
                            className="material-symbols-outlined text-secondary"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            mail
                        </span>
                        <h3 className="text-sm font-bold text-on-surface-variant dark:text-outline-variant">
                            Notifikasi Email
                        </h3>
                    </div>
                    <div className="bg-surface-container-lowest dark:bg-inverse-surface rounded-3xl p-2 shadow-sm border border-outline-variant/10">
                        <ToggleRow
                            icon="description"
                            iconColor="text-tertiary bg-tertiary/10"
                            title="Laporan Bulanan"
                            subtitle="Ringkasan lengkap aktivitas rekening"
                            checked={prefs.monthlyStatementEmail}
                            onChange={(v) => handleToggle('monthlyStatementEmail', v)}
                        />
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
                                    <span className="material-symbols-outlined">gpp_maybe</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-on-surface dark:text-inverse-on-surface">
                                        Alert Keamanan
                                    </p>
                                    <p className="text-xs text-on-surface-variant dark:text-outline-variant">
                                        Login baru atau perubahan password
                                    </p>
                                </div>
                            </div>
                            <ToggleSwitch checked={true} onChange={() => { }} disabled />
                        </div>
                    </div>
                    <p className="px-4 text-[10px] text-on-surface-variant dark:text-outline-variant uppercase tracking-widest font-bold">
                        Alert keamanan tidak dapat dinonaktifkan demi perlindunganmu.
                    </p>
                </section>

                {/* SMS Alerts */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <span
                            className="material-symbols-outlined text-primary-container"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            sms
                        </span>
                        <h3 className="text-sm font-bold text-on-surface-variant dark:text-outline-variant">
                            Alert SMS
                        </h3>
                    </div>
                    <div className="bg-surface-container-lowest dark:bg-inverse-surface rounded-3xl p-2 shadow-sm border border-outline-variant/10">
                        <ToggleRow
                            icon="payments"
                            iconColor="text-primary bg-primary-fixed-dim"
                            title="Transaksi Bernilai Tinggi"
                            subtitle="Transfer di atas Rp 5.000.000"
                            checked={prefs.highValueSms}
                            onChange={(v) => handleToggle('highValueSms', v)}
                        />
                    </div>
                </section>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full h-14 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
                >
                    {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                </button>
            </main>
        </div>
    );
}

function ToggleRow({
    icon,
    iconColor,
    title,
    subtitle,
    checked,
    onChange,
}: {
    icon: string;
    iconColor: string;
    title: string;
    subtitle: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between p-4 hover:bg-surface-container-low dark:hover:bg-on-background transition-colors rounded-xl">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColor}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div>
                    <p className="text-sm font-semibold text-on-surface dark:text-inverse-on-surface">
                        {title}
                    </p>
                    <p className="text-xs text-on-surface-variant dark:text-outline-variant">
                        {subtitle}
                    </p>
                </div>
            </div>
            <ToggleSwitch checked={checked} onChange={onChange} />
        </div>
    );
}