import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { hashToken, randomAdminToken, randomId } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = String(body.title || '').trim();
    const creatorName = String(body.creatorName || '').trim();
    if (!title || title.length > 80 || !creatorName || creatorName.length > 30) {
      return NextResponse.json({ error: '입력 내용을 확인해 주세요.' }, { status: 400 });
    }
    const id = randomId(6);
    const adminToken = randomAdminToken();
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('rolling_papers').insert({
      id, title, creator_name: creatorName, admin_token_hash: hashToken(adminToken)
    });
    if (error) throw error;
    return NextResponse.json({ id, adminToken });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '롤링페이퍼를 만들지 못했어요.' }, { status: 500 });
  }
}
