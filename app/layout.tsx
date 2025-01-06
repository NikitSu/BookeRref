import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Telegram Mini App',
  description: 'TMA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Скрипт Telegram Web Apps: */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        {/* Подключаем eruda, чтобы иметь консоль на мобильном */}
        <Script src="https://cdn.jsdelivr.net/npm/eruda" strategy="afterInteractive" />
        <Script
          id="eruda-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: 'eruda.init();' }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
