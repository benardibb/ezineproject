// ==========================================================
// Konfigurasi Supabase
// ----------------------------------------------------------
// Isi dua nilai di bawah dari Supabase Dashboard →
// Project Settings → API:
//   - Project URL           → SUPABASE_URL
//   - anon / publishable key → SUPABASE_KEY
//
// Kunci "anon/publishable" memang aman ditaruh di frontend,
// karena tabel dikunci dengan RLS dan hanya bisa diakses lewat
// fungsi di supabase/schema.sql. JANGAN pernah taruh service_role
// / secret key di sini.
//
// Jika dibiarkan kosong, situs tetap berjalan dalam "mode lokal"
// (data hanya tersimpan di peramban pengunjung).
// ==========================================================
export const SUPABASE_URL = "";
export const SUPABASE_KEY = "";
