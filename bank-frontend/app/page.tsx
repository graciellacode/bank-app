'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="bg-background dark:bg-on-background text-on-background dark:text-inverse-on-surface min-h-screen flex flex-col overflow-x-hidden">
      {/* TopAppBar Navigation Shell */}
      <header className="bg-surface/80 dark:bg-on-background/80 backdrop-blur-xl border-b border-white/20 dark:border-outline-variant/20 shadow-sm fixed top-0 w-full z-50 flex justify-between items-center px-5 h-16 transition-all duration-300">
        <div className="flex items-center gap-2">
          <span className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Bankku</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a className="text-on-surface-variant dark:text-outline-variant hover:text-primary transition-colors" href="#">Tentang Kami</a>
          <a className="text-on-surface-variant dark:text-outline-variant hover:text-primary transition-colors" href="#">Layanan</a>
          <a className="text-on-surface-variant dark:text-outline-variant hover:text-primary transition-colors" href="#">Keamanan</a>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="hidden md:flex items-center justify-center p-2 hover:bg-surface-container-high dark:hover:bg-inverse-surface rounded-full transition-colors text-on-surface-variant dark:text-outline-variant">
            <span className="material-symbols-outlined">person</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow pt-16 pb-20 md:pb-0">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-5 py-8 md:py-20 flex flex-col items-center">
          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-1/2 -left-32 w-80 h-80 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
          
          <div className="max-w-screen-xl w-full mx-auto grid md:grid-cols-2 gap-6 items-center">
            {/* Text Content */}
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded-full text-sm font-medium">
                <span className="material-symbols-outlined text-[14px] mr-2">verified_user</span>
                TERPERCAYA & DIAWASI OJK
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-on-surface dark:text-inverse-on-surface leading-tight">
                Kelola keuangan Anda dengan <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">mudah dan aman</span>
              </h1>
              <p className="text-on-surface-variant dark:text-outline-variant text-lg max-w-md mx-auto md:mx-0">
                Platform perbankan digital masa kini yang dirancang untuk memberikan kendali penuh atas masa depan finansial Anda dalam satu genggaman.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link href="/register" className="w-full sm:w-auto text-center px-10 py-4 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-2xl shadow-lg shadow-primary/25 active:scale-95 transition-transform duration-200">
                  Daftar
                </Link>
                <Link href="/login" className="w-full sm:w-auto text-center px-10 py-4 bg-transparent border-2 border-outline-variant dark:border-white/10 text-on-surface dark:text-inverse-on-surface font-medium rounded-2xl hover:bg-surface-container-high dark:hover:bg-inverse-surface active:scale-95 transition-all duration-200">
                  Masuk
                </Link>
              </div>
              <div className="flex items-center gap-4 justify-center md:justify-start pt-6">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white dark:border-on-background bg-slate-200 overflow-hidden">
                    <img className="w-full h-full object-cover" alt="User 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCou47zimRq9P6uzicsgg6GaybTx1B3CCQ2muKyZ87Qddpih8lJvPeRoH29zc0H6Y3k3CrDoqzDFGaPr9qtxc2x5XxAiXFtK9Qg0avft6IunqVNtK0OAIOCJQ7rBlCRfFhEz756sKwUAtuxaIbzzp2GlBdN4YTsZTNHgi1yiiRg-TXlSILcE_2FpMuwaRkZVJayRzrHThOyID0m0Sotc9giR01gGf__BVwMGg4hPZwI5V-zR1J-xEWI" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white dark:border-on-background bg-slate-200 overflow-hidden">
                    <img className="w-full h-full object-cover" alt="User 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiXwgFBfvKKHXbGh2Pr7MdrrFhA6hmMgn52fparD40BzTQBHWPnG-aCKES1WkKMTRp0N6YGJIsfCWYkLAaPLMPKzMh4btrke-thnGZtBroTUzlqHJnX-po8vfSHQT-QAjQPzhU2hcgf9caUQ8URV2ijNj13ndk_utpeW1Fj4YLuvDHPp20GYzdodB-vVYxxZuNKKp7UL9Y7cMEQOyx937WAVVr4Jleqw7KuNkNg9FrjONNPKxh46sT" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white dark:border-on-background bg-slate-200 overflow-hidden">
                    <img className="w-full h-full object-cover" alt="User 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYQc9IkdlNMRykjRcW0F6ACpGV1aAik_aO3JH3gCd5atXc_0UtitK9LPb4XiNQYPcLCW-2zTQn7qjdQsDKEEFpcny2yX99V3DuMtt1SrEIjuMOWwOd_BUBVm3zdLyQQeARFawXAKvm1tGs1WwsZgt3a68BN6JYgQXKvaIxERm2k5JgIq0ITFBDy4ntm7ZB393nI2eFONLJhu16StFS9wUpVpBB7VfME2nd6zRlKxxAYNKcStzT3XDF" />
                  </div>
                </div>
                <p className="text-on-surface-variant dark:text-outline-variant text-sm">Dipercaya oleh <span className="font-bold text-on-surface dark:text-inverse-on-surface">500rb+</span> pengguna</p>
              </div>
            </div>

            {/* Illustration/Visual Content */}
            <div className="relative mt-12 md:mt-0 flex justify-center">
              <div className="relative w-full max-w-[400px] h-[450px]">
                {/* Hero Image Illustration */}
                <div className="absolute inset-0 rounded-[32px] overflow-hidden shadow-2xl z-0 border border-white/50 dark:border-white/10">
                  <img className="w-full h-full object-cover" alt="Illustration" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgV1Xo28zGZ_0k41Uv5u0dJlsDawnxXyzQd0HHUCUGmsWUQW3VGCRJcLxbZMrWhEThGka_XJSTP4hhkVyq-zDyEmx1I3ExKbgnVyf8fuTtGK43onvpn6JR6GpzDyYi3nMwYmRU8aQ47O_3ExCAs_0H7ekke__iT9ePckZoUWcGgr0aH7G_S9tNfeZm3lF0NcV6EGcnXtp0mrJI13g2iQ0I5m8ST6XSb-QmhdEAyJdBQteO4EFFILTG" />
                </div>
                {/* Floating Micro-UI 1 */}
                <div className="absolute -top-6 -left-8 bg-white/70 dark:bg-inverse-surface/70 backdrop-blur-md p-4 rounded-2xl shadow-xl w-48 z-10 border border-white/20 dark:border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">trending_up</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-outline dark:text-outline-variant uppercase font-bold tracking-wider">Tabungan</p>
                      <p className="text-sm font-bold text-on-surface dark:text-inverse-on-surface">+12.5%</p>
                    </div>
                  </div>
                  <div className="w-full bg-surface-container dark:bg-on-background/10 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-green-500 h-full w-3/4 rounded-full"></div>
                  </div>
                </div>
                {/* Floating Micro-UI 2 */}
                <div className="absolute -bottom-4 -right-8 bg-white/70 dark:bg-inverse-surface/70 backdrop-blur-md p-4 rounded-2xl shadow-xl w-56 z-10 border border-white/20 dark:border-white/10">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-on-surface dark:text-inverse-on-surface">Transaksi Terakhir</span>
                      <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim text-sm">history</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim text-sm">shopping_bag</span>
                      </div>
                      <div className="flex-grow">
                        <p className="text-[11px] font-bold text-on-surface dark:text-inverse-on-surface">Belanja Bulanan</p>
                        <p className="text-[10px] text-outline dark:text-outline-variant">Berhasil</p>
                      </div>
                      <p className="text-[11px] font-bold text-error">-Rp250rb</p>
                    </div>
                  </div>
                </div>
                {/* Main Balance Card Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-48 bg-gradient-to-r from-primary to-secondary rounded-3xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden group hover:scale-105 transition-transform duration-500 cursor-pointer">
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white/70 text-[11px] font-mono">SALDO TOTAL</p>
                      <p className="text-white text-2xl font-bold">Rp 45.850.000</p>
                    </div>
                    <span className="material-symbols-outlined text-white/50">contactless</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-white/80">
                      <p className="text-[10px] tracking-widest">**** **** **** 8820</p>
                      <p className="text-[12px] font-bold">ALEXA JOHNSON</p>
                    </div>
                    <div className="w-10 h-6 bg-white/20 backdrop-blur-sm rounded-md flex items-center justify-center">
                      <div className="flex -space-x-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-orange-400 opacity-80"></div>
                        <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 opacity-80"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="px-5 py-12 max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-on-surface dark:text-inverse-on-surface mb-3">Keamanan Tanpa Kompromi</h2>
            <p className="text-on-surface-variant dark:text-outline-variant text-sm max-w-lg mx-auto">Kami menggunakan teknologi enkripsi tingkat militer untuk menjaga aset dan data pribadi Anda.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white dark:bg-white/5 p-8 rounded-[24px] shadow-sm border border-outline-variant/30 dark:border-white/10 flex flex-col gap-4 group hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-fixed-dim group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">fingerprint</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface dark:text-inverse-on-surface">Akses Biometrik</h3>
              <p className="text-on-surface-variant dark:text-outline-variant text-sm">Masuk dengan cepat dan aman menggunakan sidik jari atau pengenalan wajah.</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white dark:bg-white/5 p-8 rounded-[24px] shadow-sm border border-outline-variant/30 dark:border-white/10 flex flex-col gap-4 group hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center text-secondary dark:text-secondary-fixed-dim group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">notifications_active</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface dark:text-inverse-on-surface">Notifikasi Real-time</h3>
              <p className="text-on-surface-variant dark:text-outline-variant text-sm">Pantau setiap transaksi yang terjadi di akun Anda secara instan kapanpun.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-white dark:bg-white/5 p-8 rounded-[24px] shadow-sm border border-outline-variant/30 dark:border-white/10 flex flex-col gap-4 group hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface dark:text-inverse-on-surface">Enkripsi End-to-End</h3>
              <p className="text-on-surface-variant dark:text-outline-variant text-sm">Data Anda dienkripsi sebelum dikirim untuk menjamin privasi maksimal.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-inverse-surface dark:bg-inverse-surface/40 text-surface dark:text-inverse-on-surface py-12 px-5 mt-12">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-xl font-bold text-primary-fixed-dim">Bankku</span>
            <p className="text-surface-variant dark:text-outline-variant text-sm mt-2">© 2024 Bankku Digital Indonesia. Semua hak dilindungi.</p>
          </div>
          <div className="flex gap-6">
            <a className="text-surface-variant dark:text-outline-variant hover:text-white transition-colors" href="#">Syarat & Ketentuan</a>
            <a className="text-surface-variant dark:text-outline-variant hover:text-white transition-colors" href="#">Kebijakan Privasi</a>
            <a className="text-surface-variant dark:text-outline-variant hover:text-white transition-colors" href="#">Bantuan</a>
          </div>
        </div>
      </footer>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-white/80 dark:bg-inverse-surface/80 backdrop-blur-xl border-t border-white/20 dark:border-outline-variant/20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl">
        <Link className="flex flex-col items-center justify-center text-primary dark:text-primary-fixed-dim font-bold bg-primary/10 rounded-xl px-3 py-1 active:scale-90 transition-transform duration-150" href="/">
          <span className="material-symbols-outlined">home</span>
          <span className="text-xs">Beranda</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-outline dark:text-outline-variant hover:text-primary transition-all active:scale-90 transition-transform duration-150" href="/transactions">
          <span className="material-symbols-outlined">history</span>
          <span className="text-xs">Riwayat</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-outline dark:text-outline-variant hover:text-primary transition-all active:scale-90 transition-transform duration-150" href="/transfer">
          <span className="material-symbols-outlined">swap_horiz</span>
          <span className="text-xs">Transfer</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-outline dark:text-outline-variant hover:text-primary transition-all active:scale-90 transition-transform duration-150" href="/profile">
          <span className="material-symbols-outlined">person</span>
          <span className="text-xs">Profil</span>
        </Link>
      </nav>
    </div>
  );
}