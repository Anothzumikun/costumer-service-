 'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerStart() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function start(e) {
    e.preventDefault();
    setLoading(true);
    const r = await fetch('/api/customer/start', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({displayName: name})
    });
    if (r.ok) router.push('/chat');
    else alert('Gagal membuat chat.');
    setLoading(false);
  }

  return <main className="center"><section className="card">
    <div className="logo">CS</div>
    <h1>Customer Service</h1>
    <p className="muted">Chat dengan CS tanpa perlu memberikan nomor WhatsApp atau email.</p>
    <form onSubmit={start}>
      <label>Nama panggilan <span>(opsional)</span></label>
      <input value={name} onChange={e=>setName(e.target.value)} maxLength={40} placeholder="Contoh: Andi"/>
      <button className="primary" disabled={loading}>{loading?'Membuat...':'Mulai Chat'}</button>
    </form>
    <p className="privacy">🔒 Jangan kirim password, PIN, OTP, atau data sensitif.</p>
  </section></main>;
}
