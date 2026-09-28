'use client';

import Link from 'next/link';
import { FormEvent, use, useState } from 'react';
import { useRouter } from 'next/navigation';

const colorMap: Record<string,string> = {yellow:'#fff3a7',pink:'#ffdce5',blue:'#dff1ff',green:'#e5f6dd',purple:'#ece2ff'};

export default function WritePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); const router = useRouter();
  const [author,setAuthor]=useState(''); const [content,setContent]=useState(''); const [color,setColor]=useState('yellow'); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
  async function submit(e: FormEvent){e.preventDefault();setLoading(true);setError('');const res=await fetch(`/api/papers/${id}/messages`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({author,content,color})});const data=await res.json();setLoading(false);if(!res.ok)return setError(data.error||'저장하지 못했어요.');router.push(`/r/${id}`);}
  return <main className="wrap">
    <nav className="nav"><Link className="brand" href={`/r/${id}`}>← 롤링페이퍼로</Link><span className="pill">메시지 작성</span></nav>
    <div className="panel" style={{maxWidth:660,margin:'0 auto'}}>
      <h1 style={{marginTop:0}}>마음을 남겨 주세요 💌</h1>
      <form className="stack" onSubmit={submit}>
        <div><div className="label">이름</div><input className="input" maxLength={30} required value={author} onChange={e=>setAuthor(e.target.value)} placeholder="누가 보냈는지 알려 주세요"/></div>
        <div><div className="label">메시지</div><textarea className="textarea" maxLength={500} required value={content} onChange={e=>setContent(e.target.value)} placeholder="따뜻한 말을 적어 주세요"/><div className="muted" style={{textAlign:'right'}}>{content.length}/500</div></div>
        <div><div className="label">카드 색</div><div className="colors">{Object.entries(colorMap).map(([name,bg])=><button aria-label={name} type="button" key={name} className={`swatch ${color===name?'selected':''}`} style={{background:bg}} onClick={()=>setColor(name)}/>)}</div></div>
        {error&&<div className="status">{error}</div>}
        <button className="button" disabled={loading}>{loading?'저장 중...':'메시지 남기기'}</button>
      </form>
    </div>
  </main>
}
