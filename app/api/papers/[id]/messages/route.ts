import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const colors = new Set(['yellow','pink','blue','green','purple']);

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const author = String(body.author || '').trim();
    const content = String(body.content || '').trim();
    const color = colors.has(body.color) ? body.color : 'yellow';
    if (!author || author.length > 30 || !content || content.length > 500) {
      return NextResponse.json({ error: '이름과 메시지를 확인해 주세요.' }, { status: 400 });
    }
    const supabase = getSupabaseAdmin();
    const { data: paper } = await supabase.from('rolling_papers').select('is_closed').eq('id', id).single();
    if (!paper) return NextResponse.json({ error: '없는 롤링페이퍼예요.' }, { status: 404 });
    if (paper.is_closed) return NextResponse.json({ error: '이미 작성이 마감된 롤링페이퍼예요.' }, { status: 403 });
    const { error } = await supabase.from('messages').insert({ rolling_paper_id: id, author, content, color });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '메시지를 저장하지 못했어요.' }, { status: 500 });
  }
}
