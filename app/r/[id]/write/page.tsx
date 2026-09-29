'use client';

import Link from 'next/link';
import { FormEvent, use, useState } from 'react';
import { useRouter } from 'next/navigation';

const colors = [
  {name:'yellow', label:'햇살'},
  {name:'pink', label:'복숭아'},
  {name:'blue', label:'하늘'},
  {name:'green', label:'새싹'},
  {name:'purple', label:'라일락'},
];

export default function WritePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [author,setAuthor]=useState('');
  const [content,setContent]=useState('');
  const [color,setColor]=useState('yellow');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');

  async function submit(e: FormEvent){
    e.preventDefault();
    setLoading(true);
    setError('');
    const res=await fetch(`/api/papers/${id}/messages`,{
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({author,content,color})
    });
    const data=await res.json();
    setLoading(false);
    if(!res.ok) return setError(data.error||'메시지를 저장하지 못했어요.');
    router.push(`/r/${id}`);
  }

  return (
    <main className="rp-write-page">
      <header className="rp-topbar">
        <Link href="/" className="rp-logo">두가쟈두가쟈 (8) &lt;</Link>
        <div className="rp-top-search">✎ 마음 한 장 쓰는 중</div>
        <div className="rp-top-actions"><span className="rp-round-avatar">🐶</span></div>
      </header>

      <div className="rp-write-shell">
        <Link className="rp-back-link" href={`/r/${id}`}>← 롤링페이퍼로 돌아가기</Link>
        <section className="rp-write-card">
          <div className="rp-write-intro">
            <span>LETTER</span>
            <h1>마음을 한 장 남겨 주세요</h1>
            <p>짧아도 좋아요. 받는 사람이 오래 기억할 말을 적어 주세요.</p>
          </div>

          <form onSubmit={submit} className="rp-write-form">
            <label>
              <span>이름</span>
              <input maxLength={30} required value={author} onChange={e=>setAuthor(e.target.value)} placeholder="누가 남겼는지 알려 주세요" />
            </label>

            <label>
              <span>메시지</span>
              <textarea maxLength={500} required value={content} onChange={e=>setContent(e.target.value)} placeholder={'하고 싶은 말을 자유롭게 적어 주세요.\n줄바꿈도 그대로 보여요.'} />
              <small>{content.length}/500</small>
            </label>

            <div className="rp-color-field">
              <span>카드 색</span>
              <div className="rp-color-options">
                {colors.map(item => (
                  <button type="button" key={item.name} className={`${item.name} ${color===item.name?'selected':''}`} onClick={()=>setColor(item.name)}>
                    <i />{item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`rp-preview-card ${color}`}>
              <span>미리보기</span>
              <strong>{author || '이름'}</strong>
              <p>{content || '여기에 작성한 마음이 이렇게 보여요.'}</p>
            </div>

            {error && <div className="rp-form-error">{error}</div>}
            <button className="rp-submit" disabled={loading}>{loading?'마음을 보내는 중...':'메시지 남기기'}</button>
          </form>
        </section>
      </div>
    </main>
  );
}
