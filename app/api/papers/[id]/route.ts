import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data: paper, error } = await supabase.from('rolling_papers').select('id,title,creator_name,is_closed,created_at').eq('id', id).single();
  if (error || !paper) return NextResponse.json({ error: '없는 롤링페이퍼예요.' }, { status: 404 });
  const { data: messages } = await supabase.from('messages').select('id,author,content,color,created_at').eq('rolling_paper_id', id).order('created_at', { ascending: true });
  return NextResponse.json({ paper, messages: messages || [] });
}
