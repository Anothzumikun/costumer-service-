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

export async function GET() {
  if (!(await auth())) return NextResponse.json({ ok: false }, { status: 401 });

  const { data, error } = await db().from('conversations')
    .select('id, public_id, display_name, status, created_at, updated_at')
    .order('updated_at', { ascending: false });

  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true, conversations: data });
}
