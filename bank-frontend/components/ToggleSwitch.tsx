'use client';

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export default function ToggleSwitch({ checked, onChange, disabled }: ToggleSwitchProps) {
    return (
        <button
            type="button"
            onClick={() => !disabled && onChange(!checked)}
            disabled={disabled}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                } ${checked ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-outline-variant dark:bg-inverse-surface'}`}
        >
            <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
            />
        </button>
    );
}