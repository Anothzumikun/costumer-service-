 'use client';
import { useEffect, useState } from 'react';

export default function CustomerChat() {
  const [data,setData]=useState(null), [text,setText]=useState('');

  async function load() {
    const r=await fetch('/api/customer/messages',{cache:'no-store'});
    if(r.ok) setData(await r.json());
  }
  useEffect(()=>{load(); const t=setInterval(load,4000); return()=>clearInterval(t)},[]);

  async function send(e) {
    e.preventDefault();
    if(!text.trim()) return;
    await fetch('/api/customer/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text})});
    setText(''); load();
  }

  if(!data) return <div className="center"><div className="card"><p>Memuat chat...</p></div></div>;

  return <div className="chat-wrap">
    <header className="chat-header"><div><strong>Customer Service</strong><small>ID Chat: {data.conversation.public_id}</small></div><span>● Online</span></header>
    <main className="messages">{data.messages.length===0&&<div className="empty">Silakan kirim pesan.</div>}
      {data.messages.map(m=><div key={m.id} className={'bubble '+(m.sender_type==='customer'?'mine':'theirs')}><div>{m.message}</div><small>{new Date(m.created_at).toLocaleString('id-ID')}</small></div>)}
    </main>
    {data.conversation.status==='open'?
      <form className="composer" onSubmit={send}><input value={text} onChange={e=>setText(e.target.value)} maxLength={2000} placeholder="Ketik pesan..." required/><button className="primary">Kirim</button></form>
      :<div className="closed">Percakapan ditutup oleh CS.</div>}
  </div>;
}
