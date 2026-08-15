# Customer Service Chat — Next.js + Supabase + Vercel

Versi ini menggantikan PHP/MySQL dan ditujukan untuk deployment:
**GitHub → Vercel → Supabase**.

## Fitur
- Halaman pelanggan tanpa nomor HP/email.
- ID chat acak.
- Chat pelanggan ↔ admin.
- Login admin.
- Panel daftar percakapan.
- Tutup/buka percakapan.
- Database Supabase.
- Polling otomatis untuk pesan baru.
- Secret service-role key hanya digunakan di server API.

## 1. Buat database Supabase
Buat project Supabase, lalu buka SQL Editor dan jalankan isi `supabase.sql`.

## 2. Ambil key Supabase
Di project Supabase, buka Project Settings → API.
Siapkan:
- Project URL
- anon/public key
- service_role key

Jangan pernah memasukkan service_role key ke kode frontend atau GitHub.

## 3. Upload ke GitHub
Upload seluruh isi folder ini ke repository GitHub.

## 4. Deploy ke Vercel
Import repository GitHub tersebut ke Vercel.

Tambahkan Environment Variables:
NEXT_PUBLIC_SUPABASE_URL = URL project
NEXT_PUBLIC_SUPABASE_ANON_KEY = anon/public key
SUPABASE_SERVICE_ROLE_KEY = service_role key
ADMIN_USERNAME = admin
ADMIN_PASSWORD = buat-password-yang-kuat

Setelah itu Deploy.

## 5. URL
Pelanggan: /
Admin: /admin/login

## Catatan keamanan penting
Versi ini menyimpan sesi pelanggan dalam cookie httpOnly. Admin menggunakan cookie sesi sederhana berbasis random token. Untuk penggunaan publik skala besar, sebaiknya tambahkan Supabase Auth/NextAuth, rate limiting, CAPTCHA, audit log, dan manajemen admin yang lebih lengkap.

Sistem tidak meminta nomor HP/email, tetapi Vercel/Supabase dan browser dapat memiliki log teknis. Jadi ini mengurangi data pribadi yang dikumpulkan, bukan anonimitas absolut.
