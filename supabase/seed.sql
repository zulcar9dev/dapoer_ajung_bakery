-- ═══════════════════════════════════════════════════════
-- Dapoer Ajung Cookies & Bakery — Seed Data
-- ═══════════════════════════════════════════════════════
-- Run this AFTER 001_initial_schema.sql
-- NOTE: Admin users must be created via Supabase Auth first,
--       then insert into users table with the auth.users UUID.

-- ─── Categories ───

INSERT INTO categories (id, name, slug, description, image, product_count, sort_order) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Kue Basah', 'kue-basah', 'Kue basah modern & tradisional khas Gorontalo', '/images/categories/kue-basah.jpg', 3, 1),
  ('a1b2c3d4-0001-0001-0001-000000000002', 'Kue Kering', 'kue-kering', 'Kue kering toples untuk momen spesial', '/images/categories/kue-kering.jpg', 2, 2),
  ('a1b2c3d4-0001-0001-0001-000000000003', 'Roti & Pastry', 'roti-pastry', 'Roti segar dan pastry artisan harian', '/images/categories/roti-pastry.jpg', 1, 3),
  ('a1b2c3d4-0001-0001-0001-000000000004', 'Hampers & Paket', 'hampers-paket', 'Hampers cantik untuk hadiah dan acara spesial', '/images/categories/hampers.jpg', 1, 4),
  ('a1b2c3d4-0001-0001-0001-000000000005', 'Bekal Sekolah', 'bekal-sekolah', 'Paket bekal makan siang sehat untuk anak sekolah (MBG)', '/images/categories/bekal-sekolah.jpg', 1, 5);

-- ─── Products ───

INSERT INTO products (id, name, slug, description, short_description, category_id, base_price, discount_price, tags, rating, review_count, total_stock, is_available, is_featured, is_pre_order_only, pre_order_lead_days, weight, ingredients, allergens, shelf_life) VALUES
  ('b1b2c3d4-0002-0002-0002-000000000001', 'Bingka Kentang', 'bingka-kentang', 'Kue tradisional khas Gorontalo yang terbuat dari kentang pilihan, santan kelapa, dan telur ayam kampung, dipanggang hingga kecoklatan sempurna dengan bagian atas yang charred khas. Resep turun-temurun dari tahun 1990.', 'Kue tradisional Gorontalo dengan kentang dan santan', 'a1b2c3d4-0001-0001-0001-000000000001', 25000, NULL, ARRAY['Best Seller', 'Heritage Recipe'], 4.8, 124, 60, true, true, false, NULL, 500, 'Kentang, santan kelapa, telur, gula pasir, tepung terigu, margarin', ARRAY['Telur', 'Gluten', 'Susu'], '3 hari'),

  ('b1b2c3d4-0002-0002-0002-000000000002', 'Nastar Klasik', 'nastar-klasik', 'Nastar premium isi selai nanas homemade yang lembut dan buttery. Dibuat dengan mentega Wijsman asli dan dipanggang sempurna. Favorit pelanggan saat Lebaran dan Natal.', 'Nastar premium dengan selai nanas homemade', 'a1b2c3d4-0001-0001-0001-000000000002', 85000, NULL, ARRAY['Best Seller', 'Seasonal'], 4.9, 89, 40, true, true, false, NULL, 250, 'Tepung terigu, mentega Wijsman, gula halus, kuning telur, susu bubuk, selai nanas', ARRAY['Telur', 'Gluten', 'Susu'], '2 minggu'),

  ('b1b2c3d4-0002-0002-0002-000000000003', 'Kastengel Keju', 'kastengel-keju', 'Kastengel premium double cheese dengan keju Edam dan Parmesan asli. Renyah di luar, gurih meleleh di dalam. Wajib ada di setiap perayaan.', 'Kastengel double cheese Edam & Parmesan', 'a1b2c3d4-0001-0001-0001-000000000002', 90000, NULL, ARRAY['Premium'], 4.7, 56, 32, true, true, false, NULL, 250, 'Tepung terigu, mentega, keju Edam, keju Parmesan, kuning telur', ARRAY['Telur', 'Gluten', 'Susu'], '2 minggu'),

  ('b1b2c3d4-0002-0002-0002-000000000004', 'Roti Abon', 'roti-abon', 'Roti manis lembut bertabur abon sapi premium dan mayonnaise. Freshly baked setiap pagi. Cocok untuk sarapan dan bekal.', 'Roti manis lembut dengan abon sapi premium', 'a1b2c3d4-0001-0001-0001-000000000003', 12000, NULL, ARRAY['Daily Fresh'], 4.5, 34, 50, true, false, false, NULL, 120, 'Tepung terigu, ragi, gula, mentega, telur, susu, abon sapi, mayonnaise', ARRAY['Telur', 'Gluten', 'Susu'], '2 hari'),

  ('b1b2c3d4-0002-0002-0002-000000000005', 'Lapis Legit', 'lapis-legit', 'Lapis legit 20 lapis premium. Dibuat dengan resep tradisional menggunakan mentega Wijsman, rempah-rempah pilihan, dan dipanggang lapis demi lapis secara manual.', 'Lapis legit 20 lapis premium resep tradisional', 'a1b2c3d4-0001-0001-0001-000000000001', 250000, 225000, ARRAY['Premium', 'Heritage Recipe'], 4.9, 42, 8, true, true, true, 2, 800, 'Mentega Wijsman, kuning telur, gula pasir, tepung terigu, susu kental manis, kayu manis, cengkeh, pala', ARRAY['Telur', 'Gluten', 'Susu'], '5 hari'),

  ('b1b2c3d4-0002-0002-0002-000000000006', 'Kue Sabongi', 'kue-sabongi', 'Kue khas Gorontalo yang unik dengan cita rasa manis legit. Dibuat dari resep warisan keluarga dengan bahan-bahan pilihan lokal.', 'Kue tradisional khas Gorontalo warisan keluarga', 'a1b2c3d4-0001-0001-0001-000000000001', 35000, NULL, ARRAY['Heritage Recipe', 'Gorontalo Special'], 4.6, 28, 25, true, false, false, NULL, 400, NULL, NULL, '3 hari'),

  ('b1b2c3d4-0002-0002-0002-000000000007', 'Hampers Lebaran Exclusive', 'hampers-lebaran-exclusive', 'Paket hampers premium berisi 4 toples kue kering pilihan (Nastar, Kastengel, Putri Salju, Lidah Kucing) dalam kemasan eksklusif. Cocok untuk hadiah dan silaturahmi.', 'Hampers 4 toples kue kering premium', 'a1b2c3d4-0001-0001-0001-000000000004', 450000, 399000, ARRAY['Seasonal', 'Gift Set'], 4.8, 18, 15, true, true, true, 3, 2000, NULL, NULL, '2 minggu'),

  ('b1b2c3d4-0002-0002-0002-000000000008', 'Paket Bekal Sekolah', 'paket-bekal-sekolah', 'Paket bekal makan siang bergizi untuk anak sekolah. Berisi nasi, lauk pilihan, sayur, dan snack sehat. Mendukung program Makan Bergizi Gratis (MBG).', 'Paket bekal bergizi untuk anak sekolah', 'a1b2c3d4-0001-0001-0001-000000000005', 20000, NULL, ARRAY['Daily Fresh', 'MBG'], 4.4, 15, 90, true, false, true, 1, 350, NULL, NULL, '1 hari');

-- ─── Product Variants ───

INSERT INTO product_variants (id, product_id, name, type, price, stock, sku) VALUES
  -- Bingka Kentang
  ('c1c2c3d4-0003-0003-0003-000000000001', 'b1b2c3d4-0002-0002-0002-000000000001', 'Mini', 'SIZE', 15000, 30, 'BK-MINI'),
  ('c1c2c3d4-0003-0003-0003-000000000002', 'b1b2c3d4-0002-0002-0002-000000000001', 'Regular', 'SIZE', 25000, 20, 'BK-REG'),
  ('c1c2c3d4-0003-0003-0003-000000000003', 'b1b2c3d4-0002-0002-0002-000000000001', 'Large', 'SIZE', 45000, 10, 'BK-LRG'),
  -- Nastar Klasik
  ('c1c2c3d4-0003-0003-0003-000000000004', 'b1b2c3d4-0002-0002-0002-000000000002', 'Toples Kecil (250g)', 'SIZE', 85000, 25, 'NS-S'),
  ('c1c2c3d4-0003-0003-0003-000000000005', 'b1b2c3d4-0002-0002-0002-000000000002', 'Toples Besar (500g)', 'SIZE', 150000, 15, 'NS-L'),
  -- Kastengel Keju
  ('c1c2c3d4-0003-0003-0003-000000000006', 'b1b2c3d4-0002-0002-0002-000000000003', 'Toples Kecil (250g)', 'SIZE', 90000, 20, 'KS-S'),
  ('c1c2c3d4-0003-0003-0003-000000000007', 'b1b2c3d4-0002-0002-0002-000000000003', 'Toples Besar (500g)', 'SIZE', 165000, 12, 'KS-L'),
  -- Lapis Legit
  ('c1c2c3d4-0003-0003-0003-000000000008', 'b1b2c3d4-0002-0002-0002-000000000005', 'Setengah Loyang', 'SIZE', 250000, 5, 'LL-HALF'),
  ('c1c2c3d4-0003-0003-0003-000000000009', 'b1b2c3d4-0002-0002-0002-000000000005', 'Full Loyang', 'SIZE', 450000, 3, 'LL-FULL'),
  -- Kue Sabongi
  ('c1c2c3d4-0003-0003-0003-000000000010', 'b1b2c3d4-0002-0002-0002-000000000006', 'Original', 'FLAVOR', 35000, 15, 'SB-ORI'),
  ('c1c2c3d4-0003-0003-0003-000000000011', 'b1b2c3d4-0002-0002-0002-000000000006', 'Pandan', 'FLAVOR', 35000, 10, 'SB-PND'),
  -- Hampers Lebaran
  ('c1c2c3d4-0003-0003-0003-000000000012', 'b1b2c3d4-0002-0002-0002-000000000007', 'Silver Package', 'SIZE', 399000, 10, 'HL-SLV'),
  ('c1c2c3d4-0003-0003-0003-000000000013', 'b1b2c3d4-0002-0002-0002-000000000007', 'Gold Package', 'SIZE', 599000, 5, 'HL-GLD'),
  -- Bekal Sekolah
  ('c1c2c3d4-0003-0003-0003-000000000014', 'b1b2c3d4-0002-0002-0002-000000000008', 'Paket A (Ayam)', 'FLAVOR', 20000, 30, 'BS-A'),
  ('c1c2c3d4-0003-0003-0003-000000000015', 'b1b2c3d4-0002-0002-0002-000000000008', 'Paket B (Ikan)', 'FLAVOR', 20000, 25, 'BS-B'),
  ('c1c2c3d4-0003-0003-0003-000000000016', 'b1b2c3d4-0002-0002-0002-000000000008', 'Paket C (Telur)', 'FLAVOR', 18000, 35, 'BS-C');

-- ─── Product Images ───

INSERT INTO product_images (product_id, url, sort_order) VALUES
  ('b1b2c3d4-0002-0002-0002-000000000001', '/images/products/bingka-kentang-1.jpg', 0),
  ('b1b2c3d4-0002-0002-0002-000000000001', '/images/products/bingka-kentang-2.jpg', 1),
  ('b1b2c3d4-0002-0002-0002-000000000002', '/images/products/nastar-1.jpg', 0),
  ('b1b2c3d4-0002-0002-0002-000000000002', '/images/products/nastar-2.jpg', 1),
  ('b1b2c3d4-0002-0002-0002-000000000003', '/images/products/kastengel-1.jpg', 0),
  ('b1b2c3d4-0002-0002-0002-000000000004', '/images/products/roti-abon-1.jpg', 0),
  ('b1b2c3d4-0002-0002-0002-000000000005', '/images/products/lapis-legit-1.jpg', 0),
  ('b1b2c3d4-0002-0002-0002-000000000005', '/images/products/lapis-legit-2.jpg', 1),
  ('b1b2c3d4-0002-0002-0002-000000000006', '/images/products/sabongi-1.jpg', 0),
  ('b1b2c3d4-0002-0002-0002-000000000007', '/images/products/hampers-lebaran-1.jpg', 0),
  ('b1b2c3d4-0002-0002-0002-000000000007', '/images/products/hampers-lebaran-2.jpg', 1),
  ('b1b2c3d4-0002-0002-0002-000000000008', '/images/products/bekal-sekolah-1.jpg', 0);

-- ─── Reviews ───

INSERT INTO reviews (id, product_id, customer_name, rating, comment, is_approved, created_at) VALUES
  ('d1d2d3d4-0004-0004-0004-000000000001', 'b1b2c3d4-0002-0002-0002-000000000001', 'Aisyah R.', 5, 'Bingka kentang terenak yang pernah saya coba! Teksturnya lembut, aromanya wangi, dan rasa tradisionalnya benar-benar terasa. Akan order lagi!', true, '2026-04-10T10:00:00Z'),
  ('d1d2d3d4-0004-0004-0004-000000000002', 'b1b2c3d4-0002-0002-0002-000000000002', 'Muhammad F.', 5, 'Nastar-nya premium banget, selai nanasnya homemade dan tidak terlalu manis. Cocok untuk Lebaran. Sudah pesan 10 toples untuk dibagikan ke keluarga.', true, '2026-04-09T14:00:00Z'),
  ('d1d2d3d4-0004-0004-0004-000000000003', 'b1b2c3d4-0002-0002-0002-000000000005', 'Indah S.', 5, 'Lapis legit Dapoer Ajung tidak pernah mengecewakan. 20 lapis sempurna, empuk dan rich. Worth every penny!', true, '2026-04-08T09:00:00Z'),
  ('d1d2d3d4-0004-0004-0004-000000000004', 'b1b2c3d4-0002-0002-0002-000000000004', 'Herman W.', 4, 'Roti-nya enak dan fresh, abon-nya banyak. Pengiriman juga cepat. Cuma kadang rotinya agak kempes kalau antar jauh.', true, '2026-04-07T16:00:00Z'),
  ('d1d2d3d4-0004-0004-0004-000000000005', 'b1b2c3d4-0002-0002-0002-000000000003', 'Yuliana M.', 5, 'Kastengel paling gurih! Keju-nya kerasa banget, renyah di luar lembut di dalam. Packaging-nya juga cantik.', true, '2026-04-06T11:00:00Z');

-- ─── Vouchers ───

INSERT INTO vouchers (id, code, name, description, type, value, min_order_amount, max_discount, usage_limit, used_count, is_active, start_date, end_date) VALUES
  ('e1e2e3e4-0005-0005-0005-000000000001', 'WELCOME25K', 'Diskon Pelanggan Baru', 'Potongan Rp 25.000 untuk pembelian pertama', 'FIXED', 25000, 100000, NULL, 100, 45, true, '2026-01-01T00:00:00Z', '2026-12-31T23:59:59Z'),
  ('e1e2e3e4-0005-0005-0005-000000000002', 'LEBARAN15', 'Diskon Lebaran 15%', 'Diskon 15% untuk semua produk selama Ramadhan', 'PERCENTAGE', 15, 150000, 75000, 200, 78, true, '2026-03-01T00:00:00Z', '2026-04-30T23:59:59Z'),
  ('e1e2e3e4-0005-0005-0005-000000000003', 'HAMPERS50K', 'Potongan Hampers', 'Potongan Rp 50.000 khusus pembelian hampers', 'FIXED', 50000, 300000, NULL, 50, 12, true, '2026-03-15T00:00:00Z', '2026-05-15T23:59:59Z'),
  ('e1e2e3e4-0005-0005-0005-000000000004', 'GRATIS10', 'Diskon 10%', 'Diskon 10% untuk semua produk', 'PERCENTAGE', 10, 50000, 30000, 500, 234, false, '2026-01-01T00:00:00Z', '2026-03-31T23:59:59Z'),
  ('e1e2e3e4-0005-0005-0005-000000000005', 'BEKAL20', 'Promo Bekal Sekolah', 'Potongan Rp 20.000 untuk paket bekal sekolah', 'FIXED', 20000, 80000, NULL, 100, 8, true, '2026-04-01T00:00:00Z', '2026-06-30T23:59:59Z');

-- ─── Banners ───

INSERT INTO banners (id, title, subtitle, image, cta_text, cta_link, is_active, sort_order) VALUES
  ('f1f2f3f4-0006-0006-0006-000000000001', 'Artisanal Goodness Since 1990', 'Handmade with Love in Gorontalo', '/images/banners/hero-main.jpg', 'Lihat Produk', '/products', true, 1),
  ('f1f2f3f4-0006-0006-0006-000000000002', 'Hampers Lebaran 2026', 'Pesan sekarang, dapatkan diskon hingga 15%', '/images/banners/hampers-promo.jpg', 'Pesan Hampers', '/products?category=hampers-paket', true, 2),
  ('f1f2f3f4-0006-0006-0006-000000000003', 'Paket Bekal Sekolah', 'Makan bergizi untuk si buah hati', '/images/banners/bekal-sekolah.jpg', 'Pesan Sekarang', '/products?category=bekal-sekolah', true, 3);

-- ─── Store Settings ───

INSERT INTO store_settings (store_name, tagline, phone, whatsapp, email, address, city, province, operating_hours, social_media, bank_accounts, qris_image) VALUES
  ('Dapoer Ajung Cookies & Bakery',
   'Handmade with Love in Gorontalo — Since 1990',
   '+6281234567890',
   '6281234567890',
   'info@dapoerajung.co.id',
   'Jl. Nani Wartabone No. 123, Kota Gorontalo',
   'Gorontalo',
   'Gorontalo',
   '{"days": "Senin - Jumat", "open": "08:00", "close": "22:00"}',
   '{"instagram": "https://instagram.com/dapoerajung", "facebook": "https://facebook.com/dapoerajung", "tiktok": "https://tiktok.com/@dapoerajung"}',
   '[{"id": "bank-1", "bankName": "Bank BRI", "accountNumber": "1234-5678-9012-3456", "accountHolder": "Dapoer Ajung Bakery"}, {"id": "bank-2", "bankName": "Bank BNI", "accountNumber": "9876-5432-1098-7654", "accountHolder": "Dapoer Ajung Bakery"}]',
   '/images/qris-dapoer-ajung.png');

-- ─── Orders (sample) ───

INSERT INTO orders (id, order_number, customer_name, customer_phone, customer_email, customer_address, subtotal, delivery_fee, discount, total, voucher_code, delivery_method, delivery_date, delivery_time_slot, payment_method, payment_status, status, created_at, updated_at) VALUES
  ('aa00bb00-0007-0007-0007-000000000001', 'DA-20260411-001', 'Fatimah Hasan', '081234567891', 'fatimah@gmail.com', 'Jl. Sultan Botutihe No. 45, Kota Gorontalo', 245000, 15000, 0, 260000, NULL, 'DELIVERY', '2026-04-12', '10:00 - 12:00', 'TRANSFER', 'PAID', 'PROCESSING', '2026-04-11T08:00:00Z', '2026-04-11T09:00:00Z'),
  ('aa00bb00-0007-0007-0007-000000000002', 'DA-20260411-002', 'Ahmad Rizal', '081234567892', 'ahmad.rizal@gmail.com', 'Jl. Agus Salim No. 12, Kota Gorontalo', 225000, 0, 25000, 200000, 'WELCOME25K', 'PICKUP', '2026-04-13', '14:00 - 16:00', 'QRIS', 'PAID', 'PENDING', '2026-04-11T09:30:00Z', '2026-04-11T09:30:00Z'),
  ('aa00bb00-0007-0007-0007-000000000003', 'DA-20260410-005', 'Sri Wahyuni', '081234567893', 'sri.w@gmail.com', 'Jl. Nani Wartabone No. 78, Kota Gorontalo', 2995000, 25000, 0, 3020000, NULL, 'DELIVERY', '2026-04-14', '08:00 - 10:00', 'TRANSFER', 'PAID', 'CONFIRMED', '2026-04-10T14:00:00Z', '2026-04-10T15:00:00Z'),
  ('aa00bb00-0007-0007-0007-000000000004', 'DA-20260409-003', 'Dewi Lestari', '081234567894', 'dewi@gmail.com', 'Jl. Pangeran Hidayat No. 33, Kota Gorontalo', 190000, 10000, 0, 200000, NULL, 'DELIVERY', '2026-04-10', '16:00 - 18:00', 'COD', 'PAID', 'COMPLETED', '2026-04-09T10:00:00Z', '2026-04-10T17:30:00Z'),
  ('aa00bb00-0007-0007-0007-000000000005', 'DA-20260408-002', 'Budi Santoso', '081234567895', '', '', 165000, 0, 0, 165000, NULL, 'PICKUP', '2026-04-09', '12:00 - 14:00', 'QRIS', 'REFUNDED', 'CANCELLED', '2026-04-08T11:00:00Z', '2026-04-08T14:00:00Z');

-- ─── Order Items ───

INSERT INTO order_items (order_id, product_id, product_name, product_image, variant_name, quantity, unit_price, subtotal) VALUES
  ('aa00bb00-0007-0007-0007-000000000001', 'b1b2c3d4-0002-0002-0002-000000000001', 'Bingka Kentang (Regular)', '/images/products/bingka-kentang-1.jpg', 'Regular', 3, 25000, 75000),
  ('aa00bb00-0007-0007-0007-000000000001', 'b1b2c3d4-0002-0002-0002-000000000002', 'Nastar Klasik (Toples Kecil)', '/images/products/nastar-1.jpg', 'Toples Kecil (250g)', 2, 85000, 170000),
  ('aa00bb00-0007-0007-0007-000000000002', 'b1b2c3d4-0002-0002-0002-000000000005', 'Lapis Legit (Setengah Loyang)', '/images/products/lapis-legit-1.jpg', 'Setengah Loyang', 1, 225000, 225000),
  ('aa00bb00-0007-0007-0007-000000000003', 'b1b2c3d4-0002-0002-0002-000000000007', 'Hampers Lebaran (Gold Package)', '/images/products/hampers-lebaran-1.jpg', 'Gold Package', 5, 599000, 2995000),
  ('aa00bb00-0007-0007-0007-000000000004', 'b1b2c3d4-0002-0002-0002-000000000004', 'Roti Abon', '/images/products/roti-abon-1.jpg', NULL, 10, 12000, 120000),
  ('aa00bb00-0007-0007-0007-000000000004', 'b1b2c3d4-0002-0002-0002-000000000006', 'Kue Sabongi (Original)', '/images/products/sabongi-1.jpg', 'Original', 2, 35000, 70000),
  ('aa00bb00-0007-0007-0007-000000000005', 'b1b2c3d4-0002-0002-0002-000000000003', 'Kastengel Keju (Toples Besar)', '/images/products/kastengel-1.jpg', 'Toples Besar (500g)', 1, 165000, 165000);

-- ─── Order Status History ───

INSERT INTO order_status_history (order_id, status, note, created_at) VALUES
  ('aa00bb00-0007-0007-0007-000000000001', 'PENDING', NULL, '2026-04-11T08:00:00Z'),
  ('aa00bb00-0007-0007-0007-000000000001', 'CONFIRMED', 'Pembayaran dikonfirmasi', '2026-04-11T08:30:00Z'),
  ('aa00bb00-0007-0007-0007-000000000001', 'PROCESSING', 'Sedang diproses', '2026-04-11T09:00:00Z'),
  ('aa00bb00-0007-0007-0007-000000000002', 'PENDING', NULL, '2026-04-11T09:30:00Z'),
  ('aa00bb00-0007-0007-0007-000000000003', 'PENDING', NULL, '2026-04-10T14:00:00Z'),
  ('aa00bb00-0007-0007-0007-000000000003', 'CONFIRMED', 'Pesanan untuk acara kantor', '2026-04-10T15:00:00Z'),
  ('aa00bb00-0007-0007-0007-000000000004', 'PENDING', NULL, '2026-04-09T10:00:00Z'),
  ('aa00bb00-0007-0007-0007-000000000004', 'CONFIRMED', NULL, '2026-04-09T10:30:00Z'),
  ('aa00bb00-0007-0007-0007-000000000004', 'PROCESSING', NULL, '2026-04-09T12:00:00Z'),
  ('aa00bb00-0007-0007-0007-000000000004', 'READY', NULL, '2026-04-10T08:00:00Z'),
  ('aa00bb00-0007-0007-0007-000000000004', 'SHIPPING', NULL, '2026-04-10T16:00:00Z'),
  ('aa00bb00-0007-0007-0007-000000000004', 'DELIVERED', NULL, '2026-04-10T17:00:00Z'),
  ('aa00bb00-0007-0007-0007-000000000004', 'COMPLETED', NULL, '2026-04-10T17:30:00Z'),
  ('aa00bb00-0007-0007-0007-000000000005', 'PENDING', NULL, '2026-04-08T11:00:00Z'),
  ('aa00bb00-0007-0007-0007-000000000005', 'CANCELLED', 'Dibatalkan oleh pelanggan', '2026-04-08T14:00:00Z');

-- ─── Conversations ───

INSERT INTO conversations (id, customer_name, last_message, last_message_at, unread_count, is_active) VALUES
  ('cc00dd00-0008-0008-0008-000000000001', 'Fatimah Hasan', 'Terima kasih ya kak, sudah diterima kue-nya 😊', '2026-04-11T10:30:00Z', 0, true),
  ('cc00dd00-0008-0008-0008-000000000002', 'Ahmad Rizal', 'Kak, bisa dikonfirmasi pembayaran saya?', '2026-04-11T09:45:00Z', 1, true),
  ('cc00dd00-0008-0008-0008-000000000003', 'Sri Wahyuni', 'Untuk 5 hampers gold bisa ready kapan ya?', '2026-04-10T16:00:00Z', 2, true);

-- ─── Messages ───

INSERT INTO messages (conversation_id, sender_id, sender_name, sender_type, message, is_read, created_at) VALUES
  ('cc00dd00-0008-0008-0008-000000000002', 'cust-2', 'Ahmad Rizal', 'CUSTOMER', 'Halo kak, saya sudah transfer untuk pesanan DA-20260411-002', true, '2026-04-11T09:35:00Z'),
  ('cc00dd00-0008-0008-0008-000000000002', 'admin-1', 'Admin', 'ADMIN', 'Baik kak, mohon kirimkan bukti transfernya ya 🙏', true, '2026-04-11T09:40:00Z'),
  ('cc00dd00-0008-0008-0008-000000000002', 'cust-2', 'Ahmad Rizal', 'CUSTOMER', 'Kak, bisa dikonfirmasi pembayaran saya?', false, '2026-04-11T09:45:00Z');

-- ─── Stock Movements ───

INSERT INTO stock_movements (product_id, product_name, variant_name, type, quantity, reason, created_by, created_at) VALUES
  ('b1b2c3d4-0002-0002-0002-000000000001', 'Bingka Kentang', 'Regular', 'IN', 20, 'Produksi pagi', NULL, '2026-04-11T06:00:00Z'),
  ('b1b2c3d4-0002-0002-0002-000000000001', 'Bingka Kentang', 'Regular', 'OUT', 3, 'Pesanan DA-20260411-001', NULL, '2026-04-11T08:00:00Z'),
  ('b1b2c3d4-0002-0002-0002-000000000004', 'Roti Abon', NULL, 'IN', 50, 'Produksi pagi', NULL, '2026-04-11T05:30:00Z'),
  ('b1b2c3d4-0002-0002-0002-000000000005', 'Lapis Legit', 'Setengah Loyang', 'ADJUSTMENT', -2, 'Koreksi stok (rusak)', NULL, '2026-04-10T14:00:00Z');
