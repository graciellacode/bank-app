'use client';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-background dark:bg-on-background text-on-background dark:text-background flex items-center justify-center">
      <ThemeToggle />
    </div>
  );
}