import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

function db() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function ownedConversation() {
  const jar = await cookies();
  const id = jar.get('customer_conversation_id')?.value;
  const publicId = jar.get('customer_public_id')?.value;
  if (!id || !publicId) return null;

  const { data } = await db().from('conversations')
    .select('id, public_id, display_name, status')
    .eq('id', id).eq('public_id', publicId).single();
  return data || null;
}

export async function GET() {
  try {
    const c = await ownedConversation();
    if (!c) return NextResponse.json({ ok: false }, { status: 401 });

    const { data, error } = await db().from('messages')
      .select('id, sender_type, message, created_at')
      .eq('conversation_id', c.id).order('id', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ ok: true, conversation: c, messages: data });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const c = await ownedConversation();
    if (!c) return NextResponse.json({ ok: false }, { status: 401 });

    const { message } = await request.json();
    const text = String(message || '').trim();
    if (!text || text.length > 2000 || c.status !== 'open') {
      return NextResponse.json({ ok: false, error: 'Pesan tidak valid.' }, { status: 400 });
    }

    const { error } = await db().from('messages')
      .insert({ conversation_id: c.id, sender_type: 'customer', message: text });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Gagal mengirim pesan.' }, { status: 500 });
  }
}
