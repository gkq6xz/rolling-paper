import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { hashToken } from '@/lib/security';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { adminToken, isClosed } = await req.json();
    const supabase = getSupabaseAdmin();
    const { data: paper } = await supabase.from('rolling_papers').select('admin_token_hash').eq('id', id).single();
    if (!paper || hashToken(String(adminToken || '')) !== paper.admin_token_hash) {
      return NextResponse.json({ error: '관리 권한이 없어요.' }, { status: 403 });
    }
    const { error } = await supabase.from('rolling_papers').update({ is_closed: !!isClosed }).eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '상태를 변경하지 못했어요.' }, { status: 500 });
  }
}
