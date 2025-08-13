'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Sparkles } from 'lucide-react';

const FLAG_KEY = 'patiks_welcome_shown_v1';

export default function WelcomePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const shown = localStorage.getItem(FLAG_KEY);
    if (!shown) {
      setTimeout(() => setOpen(true), 400);
    }
  }, []);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(FLAG_KEY, '1');
    } catch {}
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />
      <Card className="relative w-full max-w-md shadow-xl border-blue-200 dark:border-blue-700 animate-in fade-in zoom-in-95">
        <Button
          variant="ghost"
          size="icon"
            aria-label="Close"
          className="absolute top-2 right-2"
          onClick={close}
        >
          <X className="w-4 h-4" />
        </Button>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Welcome to PATIKS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p>
            PATIKS is your lab companion for quick, reversible chemical calculations
            and streamlined documentation.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Explore calculators, export branded PDF reports, and keep your recent work saved locally.
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Crafted by{' '}
            <a
              href="https://www.linkedin.com/in/mihir-chandratre-155345173/"
              target="_blank"
              className="text-blue-600 dark:text-blue-300 hover:underline"
            >
              Mihir Chandratre
            </a>
          </div>
          <div className="flex justify-end">
            <Button onClick={close} className="bg-blue-500 hover:bg-blue-600">
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
