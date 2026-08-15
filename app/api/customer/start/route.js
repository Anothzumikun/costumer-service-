import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { displayName } = await request.json();
    const name = String(displayName || 'Pelanggan').trim().slice(0, 40) || 'Pelanggan';

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const publicId = crypto.randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase();

    const { data, error } = await supabase
      .from('conversations')
      .insert({ public_id: publicId, display_name: name, status: 'open' })
      .select('id, public_id, display_name, status')
      .single();

    if (error) throw error;

    const response = NextResponse.json({ ok: true, conversation: data });
    response.cookies.set('customer_conversation_id', String(data.id), {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30
    });
    response.cookies.set('customer_public_id', data.public_id, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30
    });
    return response;
  } catch {
    return NextResponse.json({ ok: false, error: 'Gagal membuat percakapan.' }, { status: 500 });
  }
}
