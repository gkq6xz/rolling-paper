'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function createPaper(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/papers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, creatorName })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '생성에 실패했어요.');
      localStorage.setItem(`rolling-admin-${data.id}`, data.adminToken);
      router.push(`/r/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했어요.');
    } finally { setLoading(false); }
  }

  return <main className="wrap">
    <nav className="nav"><div className="brand">💌 몽글 롤링페이퍼</div><span className="pill">회원가입 없이 바로 시작</span></nav>
    <section className="hero">
      <div>
        <h1>마음을 모아<br/>한 장의 편지로.</h1>
        <p>링크 하나만 공유하면 친구들이 바로 메시지를 남길 수 있어요. 생일, 졸업, 퇴사, 응원 메시지를 예쁜 카드로 모아 보세요.</p>
        <form className="panel stack" onSubmit={createPaper}>
          <div><div className="label">롤링페이퍼 제목</div><input className="input" maxLength={80} required value={title} onChange={e=>setTitle(e.target.value)} placeholder="예: 은영이 생일 축하해 🎂"/></div>
          <div><div className="label">만든 사람</div><input className="input" maxLength={30} required value={creatorName} onChange={e=>setCreatorName(e.target.value)} placeholder="예: 미래"/></div>
          {error && <div className="status">{error}</div>}
          <button className="button" disabled={loading}>{loading ? '만드는 중...' : '롤링페이퍼 만들기'}</button>
        </form>
      </div>
      <div className="preview">
        <div className="note yellow"><strong>미래</strong>생일 축하해!! 올해도 재밌는 추억 많이 만들자 💛</div>
        <div className="note pink"><strong>설아</strong>늘 건강하고 행복해야 돼. 맛있는 거 먹으러 가자 🎀</div>
        <div className="note blue"><strong>은영</strong>이렇게 모아 보니까 더 귀엽지 ☁️</div>
      </div>
    </section>
    <div className="footer">작고 귀엽고 간단한 롤링페이퍼 서비스</div>
  </main>
}
