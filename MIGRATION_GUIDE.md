# Panduan Migrasi & Melanjutkan Proyek (Dapoer Ajung Bakery)

Repositori sistem Dapoer Ajung Bakery bersifat termodulasi (terpisah antara `admin` dan `storefront`). Panduan ini dibuat untuk menavigasi proses pemindahan pengerjaan kode antar komputer/laptop secara aman dan utuh.

---

## 1. Persiapan Perangkat (Prasyarat)
Pastikan komputer/laptop baru Anda telah menginstal aplikasi wajib berikut:
- **Node.js** (Versi LTS terbaru v18+).
- **Git** (Digunakan untuk menarik dan menyelaraskan perubahan (*pull/push*)).
- **VS Code** (atau Text Editor favorit Anda).
- **Ekstensi Antigravity AI** (Pasang ekstensi asisten kesayangan Anda ini agar bisa melanjutkan alur kerja *coding* langsung di VS Code).

---

## 2. Kloning Repositori (Unduh Proyek)
Sistem ini disentralisasi menggunakan Git. Buka terminal atau Command Prompt (CMD) di laptop baru Anda dan unduh kode dari GitHub:
```bash
git clone https://github.com/zulcar9dev/dapoer_ajung_bakery.git
cd dapoer_ajung_bakery
```

---

## 3. Amankan "Environment Variables" (SANGAT KRUSIAL!) ⚠️
File pengaturan rahasia (`.env.local` / `.env`) **TIDAK** pernah diunggah ke GitHub demi memproteksi keamanan Database. File ini mengatur jembatan aplikasi dengan Supabase.

**Langkah Terpenting:**
1. Menyalin `.env`: Di komputer *lama*, buka folder `admin` dan `storefront`.
2. Kopi file `.env` atau `.env.local` dari *kedua folder* tersebut (Isinya harus memuat variabel seperti `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3. Cadangkan file tersebut menggunakan *Flashdisk* ataupun sarana brankas awan seperti *Google Drive*.
4. *Paste* kembali file-file tersebut ke folder `admin` dan `storefront` yang setara di laptop baru Anda secara presisi.

*(Catatan Peringatan: Apabila kunci `.env` milik Anda sampai tercecer atau tidak bisa ditemukan, aplikasi 100% tidak akan sanggup menarik data ke/dari antarmuka pengguna).*

---

## 4. Install Dependensi Modul Node (*npm install*)
Kode inti berhasil tertransfer, namun _package_ pihak ketiga belum turut dirakit karena folder `node_modules` diabaikan otomatis di jaringan.

Buka terminal dan lakukan proses kompilasi dependensi ke kedua pilar proyek ini (bergantian):
```bash
# 1. Menyalakan ulang sistem Admin
cd admin
npm install

# 2. Menyalakan ulang sistem Etalase Publik (Storefront)
cd ../storefront
npm install
```
*Gunakan jaringan internet yang stabil, karena proses penarikan library shadcn dan pustaka lainnya (seperti Sonner, Tailwind, dll) dapat memakan waktu beberapa saat.*

---

## 5. Menjalankan Uji Coba Server Lokal
Seluruh setelan telah dikonfigurasi secara sempurna. Anda dapat mengeksekusi server _development_ untuk kembali mencoba berinteraksi dengan API Supabase.
```bash
cd admin
npm run dev
```

Selamat berkarya di perangkat Anda yang baru!
*(**P.S.** Untuk Antigravity: "Baca file ini jika user meminta kelanjutan struktur proyek".)*
