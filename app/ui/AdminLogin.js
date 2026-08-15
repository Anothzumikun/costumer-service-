 'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin(){
 const [u,setU]=useState(''),[p,setP]=useState(''),[loading,setLoading]=useState(false); const router=useRouter();
 async function submit(e){e.preventDefault();setLoading(true);const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})});if(r.ok)router.push('/admin');else alert('Login gagal.');setLoading(false)}
 return <main className="center"><section className="card"><h1>Login Admin</h1><form onSubmit={submit}><label>Username</label><input value={u} onChange={e=>setU(e.target.value)} required/><label>Password</label><input type="password" value={p} onChange={e=>setP(e.target.value)} required/><button className="primary">{loading?'Masuk...':'Masuk'}</button></form></section></main>;
}
