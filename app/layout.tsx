import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '몽글 롤링페이퍼',
  description: '친구들과 링크로 주고받는 간단한 롤링페이퍼'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
