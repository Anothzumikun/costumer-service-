import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

function db() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function auth() {
  const jar = await cookies();
  return !!jar.get('admin_session')?.value;
}

export async function GET(request) {
  if (!(await auth())) return NextResponse.json({ ok: false }, { status: 401 });
  const id = new URL(request.url).searchParams.get('conversation');
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });

  const { data, error } = await db().from('messages')
    .select('id, sender_type, message, created_at')
    .eq('conversation_id', id).order('id', { ascending: true });

  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true, messages: data });
}

export async function POST(request) {
  if (!(await auth())) return NextResponse.json({ ok: false }, { status: 401 });

  const { conversationId, message, action } = await request.json();
  const supabase = db();

  if (action === 'status') {
    const status = message === 'closed' ? 'closed' : 'open';
    const { error } = await supabase.from('conversations').update({ status }).eq('id', conversationId);
    if (error) return NextResponse.json({ ok: false }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  const text = String(message || '').trim();
  if (!conversationId || !text || text.length > 2000) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId, sender_type: 'admin', message: text
  });

  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true });
}
