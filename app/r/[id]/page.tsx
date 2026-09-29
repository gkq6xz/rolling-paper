'use client';

import Link from 'next/link';
import { use, useEffect, useMemo, useState } from 'react';

type Message = { id:string; author:string; content:string; color:string };
type Data = { paper: { id:string; title:string; creator_name:string; is_closed:boolean }; messages: Message[] };

const colorLabel: Record<string,string> = {
  yellow: '햇살',
  pink: '복숭아',
  blue: '하늘',
  green: '새싹',
  purple: '라일락',
};

export default function PaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<Data|null>(null);
  const [error, setError] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [copied, setCopied] = useState(false);

  async function load() {
    const res = await fetch(`/api/papers/${id}`, { cache: 'no-store' });
    const json = await res.json();
    if (!res.ok) setError(json.error || '롤링페이퍼를 불러오지 못했어요.');
    else setData(json);
  }

  useEffect(() => {
    setAdminToken(localStorage.getItem(`rolling-admin-${id}`) || '');
    load();
  }, [id]);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function toggleClosed() {
    if (!data) return;
    const res = await fetch(`/api/papers/${id}/close`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({adminToken,isClosed:!data.paper.is_closed}),
    });
    if (!res.ok) return alert('상태를 변경하지 못했어요.');
    load();
  }

  const previewNames = useMemo(() => (data?.messages || []).slice(0, 6).map(m => m.author), [data]);

  if (error) return <main className="rp-page"><div className="rp-state-card">{error}</div></main>;
  if (!data) return <main className="rp-page"><div className="rp-state-card">롤링페이퍼를 펼치는 중...</div></main>;

  return (
    <main className="rp-page">
      <header className="rp-topbar">
        <Link href="/" className="rp-logo">두가쟈두가쟈 (8) &lt;</Link>
        <div className="rp-top-search">⌕ 롤링페이퍼 안에서 마음을 찾아보세요</div>
        <div className="rp-top-actions"><span>♡</span><span className="rp-round-avatar">🐶</span></div>
      </header>

      <div className="rp-shell">
        <aside className="rp-left-menu">
          <Link href="/" className="rp-menu-item">⌂ <span>홈</span></Link>
          <Link href={`/r/${id}`} className="rp-menu-item active">✉ <span>롤링페이퍼</span></Link>
          {!data.paper.is_closed && <Link href={`/r/${id}/write`} className="rp-menu-item">✎ <span>메시지 쓰기</span></Link>}
          <button className="rp-menu-item" onClick={copyLink}>↗ <span>공유하기</span></button>
        </aside>

        <section className="rp-main-column">
          <section className="rp-hero">
            <div className="rp-hero-cloud cloud-a" />
            <div className="rp-hero-cloud cloud-b" />
            <div className="rp-hero-grass" />
            <div className="rp-hero-content">
              <div className="rp-hero-icon">💌</div>
              <div>
                <p className="rp-kicker">{data.paper.creator_name}님이 만든 롤링페이퍼</p>
                <h1>{data.paper.title}</h1>
                <p className="rp-hero-sub">친구들의 말을 한 장씩 모아 두는 공간이에요.</p>
              </div>
            </div>
            <div className="rp-hero-buttons">
              {!data.paper.is_closed && <Link className="rp-btn primary" href={`/r/${id}/write`}>메시지 남기기</Link>}
              <button className="rp-btn light" onClick={copyLink}>{copied ? '복사했어요 ✓' : '링크 공유'}</button>
            </div>
          </section>

          <section className="rp-summary-row">
            <div className="rp-summary-card">
              <span className="rp-summary-label">모인 마음</span>
              <strong>{data.messages.length}</strong>
              <span>개</span>
            </div>
            <div className="rp-summary-card grow">
              <span className="rp-summary-label">최근 작성자</span>
              <div className="rp-name-cloud">
                {previewNames.length ? previewNames.map((name, i) => <span key={`${name}-${i}`}>{name}</span>) : <span className="empty">아직 첫 메시지를 기다리고 있어요</span>}
              </div>
            </div>
          </section>

          {data.paper.is_closed && <div className="rp-closed-banner">🔒 지금은 새 메시지를 받을 수 없어요. 이미 남겨진 마음은 그대로 볼 수 있어요.</div>}

          <div className="rp-section-title">
            <div><span>ROLLING PAPER</span><h2>도착한 마음들</h2></div>
            {!data.paper.is_closed && <Link href={`/r/${id}/write`}>+ 새 메시지</Link>}
          </div>

          {data.messages.length ? (
            <section className="rp-message-grid">
              {data.messages.map((m, i) => (
                <article key={m.id} className={`rp-message-card ${m.color}`}>
                  <div className="rp-message-top">
                    <div className="rp-message-avatar">{m.author.trim().slice(0,1) || '♡'}</div>
                    <div><strong>{m.author}</strong><span>{colorLabel[m.color] || '마음'} 카드</span></div>
                    <span className="rp-message-number">#{String(i+1).padStart(2,'0')}</span>
                  </div>
                  <div className="rp-message-body">{m.content}</div>
                  <div className="rp-message-foot">♡ 두가쟈두가쟈</div>
                </article>
              ))}
            </section>
          ) : (
            <section className="rp-empty">
              <div>💌</div>
              <h3>아직 도착한 마음이 없어요</h3>
              <p>첫 번째 메시지를 남겨서 이 롤링페이퍼를 시작해 보세요.</p>
              {!data.paper.is_closed && <Link className="rp-btn primary" href={`/r/${id}/write`}>첫 마음 남기기</Link>}
            </section>
          )}
        </section>

        <aside className="rp-right-column">
          <section className="rp-side-card">
            <div className="rp-side-title"><strong>이 롤링페이퍼</strong><span>INFO</span></div>
            <div className="rp-info-list">
              <div><span>만든 사람</span><strong>{data.paper.creator_name}</strong></div>
              <div><span>메시지</span><strong>{data.messages.length}개</strong></div>
              <div><span>상태</span><strong className={data.paper.is_closed ? 'closed' : 'open'}>{data.paper.is_closed ? '작성 마감' : '작성 중'}</strong></div>
            </div>
          </section>

          <section className="rp-side-card rp-guide">
            <div className="rp-side-title"><strong>친구에게 공유하기</strong><span>↗</span></div>
            <p>이 페이지 주소를 보내면 누구나 이름과 메시지를 남길 수 있어요.</p>
            <button onClick={copyLink}>{copied ? '링크 복사 완료 ✓' : '링크 복사하기'}</button>
          </section>

          {adminToken && (
            <section className="rp-side-card rp-admin-card">
              <div className="rp-side-title"><strong>방장 관리</strong><span>ADMIN</span></div>
              <p>이 브라우저에만 방장 권한이 저장되어 있어요.</p>
              <button onClick={toggleClosed}>{data.paper.is_closed ? '작성 다시 열기' : '작성 마감하기'}</button>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
