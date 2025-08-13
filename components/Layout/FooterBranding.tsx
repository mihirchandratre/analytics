'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function FooterBranding() {
  return (
    <footer
      role="contentinfo"
      aria-label="PATIKS site footer"
      className="w-full mt-12 border-t border-gray-200 dark:border-gray-700 pt-6 pb-8"
    >
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo/logo.png"
            alt="PATIKS logo"
            width={40}
            height={40}
            className="rounded-md shadow-sm border border-gray-200 dark:border-gray-600 bg-white p-1"
            priority
          />
          <div className="text-sm">
            <div className="font-semibold tracking-wide text-gray-800 dark:text-gray-100">
              PATIKS
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
              Precision Analytical Toolkit for Integrated Knowledge & Science
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="text-xs text-gray-600 dark:text-gray-400 text-center md:text-right space-y-1">
          <div>
            Crafted by{' '}
            <Link
              href="https://www.linkedin.com/in/mihir-chandratre-155345173/"
              target="_blank"
              className="text-blue-600 dark:text-blue-300 hover:underline font-medium"
            >
              Mihir Chandratre
            </Link>
          </div>
          <div className="opacity-70">
            © {new Date().getFullYear()} PATIKS. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
