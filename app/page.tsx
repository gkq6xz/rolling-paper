'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const members = [
  ['육은영', '🐶', 'lime'],
  ['010', '🐰', 'pink'],
  ['노크', '🐻', 'blue'],
  ['모래', '🐱', 'mint'],
  ['미래', '🐧', 'sky'],
  ['버디', '🐸', 'green'],
  ['설아', '🐑', 'yellow'],
  ['시노', '🐇', 'rose'],
] as const;

export default function Home() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  async function createPaper(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, creatorName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '생성에 실패했어요.');
      localStorage.setItem(`rolling-admin-${data.id}`, data.adminToken);
      router.push(`/r/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했어요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="band-shell">
      <header className="topbar">
        <div className="site-title">두가쟈두가쟈 (8) &lt;</div>
        <div className="search">⌕ <span>게시글, 작성자 검색</span></div>
        <div className="top-actions"><span>♢</span><span className="top-avatar">🐶</span></div>
      </header>

      <div className="band-layout">
        <aside className="left-nav">
          <button className="nav-item active">⌂ <span>홈</span></button>
          <button className="nav-item" onClick={() => setShowCreate(true)}>✎ <span>롤링페이퍼 만들기</span></button>
          <button className="nav-item">♙ <span>멤버</span></button>
          <button className="nav-item">⚙ <span>설정</span></button>
        </aside>

        <section className="center-column">
          <section className="band-cover">
            <div className="cover-cloud cloud-1" />
            <div className="cover-cloud cloud-2" />
            <div className="cover-avatar">🐶</div>
            <div className="cover-info">
              <h1>두가쟈두가쟈 (8) &lt;</h1>
              <p>멤버 8명&nbsp;&nbsp;|&nbsp;&nbsp;만든 사람 육은영&nbsp;&nbsp;|&nbsp;&nbsp;2026. 7. 9. 생성</p>
              <strong>은영이의말안들려?</strong>
            </div>
            <div className="cover-actions">
              <button onClick={() => navigator.clipboard?.writeText(window.location.href)}>↗ 공유하기</button>
              <button>•••</button>
            </div>
          </section>

          <section className="composer">
            <div className="mini-avatar">🐶</div>
            <button className="composer-input" onClick={() => setShowCreate(true)}>
              지금, 두가쟈두가쟈에 롤링페이퍼를 만들어보세요!
            </button>
            <button className="composer-button" onClick={() => setShowCreate(true)}>만들기</button>
          </section>

          {showCreate && (
            <section className="create-card">
              <div className="create-head">
                <div>
                  <strong>새 롤링페이퍼 만들기</strong>
                  <p>친구들에게 공유할 롤링페이퍼를 만들어 보세요.</p>
                </div>
                <button className="close" onClick={() => setShowCreate(false)}>×</button>
              </div>
              <form onSubmit={createPaper} className="create-form">
                <label>
                  롤링페이퍼 제목
                  <input required maxLength={80} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 은영이 생일 축하해 🎂" />
                </label>
                <label>
                  만든 사람
                  <input required maxLength={30} value={creatorName} onChange={(e) => setCreatorName(e.target.value)} placeholder="예: 미래" />
                </label>
                {error && <div className="form-error">{error}</div>}
                <button className="primary" disabled={loading}>{loading ? '만드는 중...' : '롤링페이퍼 만들기'}</button>
              </form>
            </section>
          )}

          <div className="sort-row">최신순⌄</div>

          <article className="feed-card">
            <div className="feed-head">
              <div className="feed-avatar">🐶</div>
              <div>
                <strong>육은영</strong>
                <span>2026. 7. 9. 12:30</span>
              </div>
              <button>•••</button>
            </div>
            <div className="feed-copy">
              <p>순장팟 MT</p>
              <p>처음부터 이렇게 될 줄 알았던 사람은 아무도 없었다.</p>
              <p>육은영, 010, 노크, 모래, 미래, 버디, 설아, 시노.</p>
              <p>고작 8 명이 2 박 3 일로 놀러 왔을 뿐이었다.</p>
              <p>문제는 방 배정을 시작하면서부터였다.</p>
              <p>“야, 잠깐만”</p>
            </div>
            <div className="lake-photo" aria-label="호수 풍경 이미지">
              <div className="lake-sky" />
              <div className="mountain m1" />
              <div className="mountain m2" />
              <div className="lake" />
            </div>
            <div className="reactions"><span>♥ <b>8</b></span><span>▢ 댓글</span></div>
          </article>
        </section>

        <aside className="right-column">
          <section className="side-card">
            <div className="side-title"><strong>멤버 <em>8</em></strong><span>전체 보기 ›</span></div>
            <div className="member-grid">
              {members.map(([name, emoji, color]) => (
                <div className="member" key={name}>
                  <div className={`member-avatar ${color}`}>{emoji}</div>
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="side-card">
            <div className="side-title"><strong>최근 사진</strong><span>전체 보기 ›</span></div>
            <div className="photo-grid">
              <div className="thumb thumb-lake" />
              <div className="thumb thumb-sky" />
              <div className="thumb thumb-flower" />
              <div className="thumb thumb-road" />
            </div>
          </section>

          <section className="side-card">
            <div className="side-title"><strong>공지사항</strong><span>＋</span></div>
            <div className="notice">📢 <span>등록된 공지사항이 없습니다.</span></div>
          </section>
        </aside>
      </div>
    </main>
  );
}
