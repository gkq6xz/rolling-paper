'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';

type Data = { paper: { id:string; title:string; creator_name:string; is_closed:boolean }; messages: { id:string; author:string; content:string; color:string }[] };

export default function PaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<Data|null>(null);
  const [error, setError] = useState('');
  const [adminToken, setAdminToken] = useState('');

  async function load() {
    const res = await fetch(`/api/papers/${id}`, { cache: 'no-store' });
    const json = await res.json();
    if (!res.ok) setError(json.error || '불러오지 못했어요.'); else setData(json);
  }
  useEffect(()=>{ setAdminToken(localStorage.getItem(`rolling-admin-${id}`) || ''); load(); },[id]);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    alert('링크를 복사했어요!');
  }
  async function toggleClosed() {
    if (!data) return;
    const res = await fetch(`/api/papers/${id}/close`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({adminToken,isClosed:!data.paper.is_closed})});
    if (!res.ok) return alert('변경하지 못했어요.');
    load();
  }

  if (error) return <main className="wrap"><div className="panel empty">{error}</div></main>;
  if (!data) return <main className="wrap"><div className="panel empty">불러오는 중...</div></main>;
  return <main className="wrap">
    <nav className="nav"><Link className="brand" href="/">💌 몽글 롤링페이퍼</Link><span className="pill">{data.messages.length}개의 마음</span></nav>
    <section className="paper-head">
      <div className="muted">{data.paper.creator_name}님이 만든 롤링페이퍼</div>
      <h1>{data.paper.title}</h1>
      <div className="actions">
        {!data.paper.is_closed && <Link className="button" href={`/r/${id}/write`}>💌 메시지 남기기</Link>}
        <button className="button secondary" onClick={copyLink}>🔗 링크 복사</button>
      </div>
      {data.paper.is_closed && <p className="status">이 롤링페이퍼는 작성이 마감되었어요.</p>}
    </section>
    {data.messages.length ? <section className="grid">{data.messages.map(m=><article key={m.id} className={`note ${m.color}`}><strong>{m.author}</strong><div style={{whiteSpace:'pre-wrap',lineHeight:1.65}}>{m.content}</div></article>)}</section> : <div className="panel empty">아직 메시지가 없어요. 첫 번째 마음을 남겨 보세요 ✨</div>}
    {adminToken && <section className="panel admin"><strong>방장 관리</strong><p className="muted">이 기기에만 관리 권한이 저장되어 있어요.</p><button className="button danger" onClick={toggleClosed}>{data.paper.is_closed ? '작성 다시 열기' : '작성 마감하기'}</button></section>}
    <div className="footer">💌 몽글 롤링페이퍼</div>
  </main>
}
