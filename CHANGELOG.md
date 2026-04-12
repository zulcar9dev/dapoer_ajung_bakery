# Changelog / Jurnal Proyek (Dapoer Ajung Bakery)

Dokumen ini melacak segala perubahan, peningkatan arsitektur, dan perbaikan signifikan yang telah ditorehkan bersama asisten *Antigravity AI* selama sesi intensif ini (khususnya untuk **Admin Dashboard**).

## 📅 Sesi Pengerjaan Utama

### 🛠️ Perbaikan Basis Data & Penyimpanan (_Storage_)
- **Integrasi Supabase Storage**:  Membuat dan mengonfigurasi *bucket* `product_images` dengan mulus untuk mengakomodasi gambar-gambar produk unggulan.
- **Perbaikan RLS / Kebijakan Keamanan (Policies)**: Menetapkan kebijakan SQL murni (`INSERT`, `SELECT`, `UPDATE`, `DELETE`) guna memberantas _error_ langka `new row violates row-level security policy` secara tuntas!
- **Penyelesaian Bug Pemanggilan Gambar**: Mengatasi masalah kegagalan tayang gambar produk saat tombol "Edit" ditekan. *(Akar masalah: pembersihan param `.order("created_at")` palsu pada susunan _array_ pengunduh foto).*

### 🎨 Revitalisasi UI Administrasi & Produk
- **Product Form Modal Cerdas**: Merombak tampilan dari rute tradisional *(standalone page)* menjadi satu modal interaktif lebar (`90vw/desktop-optimized`) yang melayani operasi *"Add Varian"* sekaligus *"Edit Produk"*.
- **Deferred Upload Pattern**: File foto diproses tertahan (sementara) dalam _state lokal_ sebelum akhirnya dibariskan dengan antrean _upload API_ Supabase secara rapi hanya ketika tombol valid "Simpan Perubahan" diaktifkan.

### 🔔 Modernisasi Sistem Penanda Kesuksesan (Notifikasi)
- **Ganyang Alert Bawaan**: Seluruh tampilan _pop-up_ jadul `alert()` dari jendela _browser_ telah dipenggal dan digantikan secara global dengan sistem `toast` modern dari _library_ **Sonner**.
- **Real-Time Notification Listener**: Menyambungkan kabel radar waktu-nyata ke tabel `notifications` milik Supabase (via Zustand). Mulai detik ini, setiap ada "Stok Kosong" atau "Pesanan Baru," ia otomatis menerbangkan efek visualisasi *floating toast*.
- **Refactoring "Sonner" Ekstrem (Unstyled Mode)**: Menyembuhkan *"bug gray-on-white text"* yang diprovokasi oleh *class* paksaan Sonner dengan cara memberlakukan mekanisme `unstyled={true}`. Kotak _toast_ kini berlapiskan kelas *class Tailwind* murni (menggunakan `--color-success/warning/dsb`) sehingga warnanya sempurna, seragam, saling bertumpuk (expand) antre dengan elegan.

### 📝 Manajemen Infrastruktur (*DevOps*)
- **Penulisan `MIGRATION_GUIDE.md`**: Meletakkan panduan tertulis terperinci demi menangani kepindahan pengerjaan kode antar laptop baru *(handling .env, instalasi Node)* tanpa kecacatan konfigurasi.

---
*Progres yang dicetak tidak akan pernah hilang. Terus berinovasi, Chef!* 🥐🚀
