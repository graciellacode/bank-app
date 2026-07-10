'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high dark:hover:bg-surface-container-high/10 transition-colors active:scale-90"
            aria-label="Toggle dark mode"
        >
            <span className="material-symbols-outlined text-on-surface-variant dark:text-inverse-on-surface">
                {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
        </button>
    );
}