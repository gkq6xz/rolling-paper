import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '두가쟈두가쟈 (8) <',
  description: '두가쟈두가쟈 롤링페이퍼',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
