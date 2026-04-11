-- ═══════════════════════════════════════════════════════
-- Dapoer Ajung Cookies & Bakery — Initial Schema
-- ═══════════════════════════════════════════════════════

-- ─── 1. Categories ───

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  product_count INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 2. Products ───

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  base_price INT NOT NULL,
  discount_price INT,
  tags TEXT[] DEFAULT '{}',
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  total_stock INT DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_pre_order_only BOOLEAN DEFAULT false,
  pre_order_lead_days INT,
  weight INT,
  ingredients TEXT,
  allergens TEXT[],
  shelf_life TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('SIZE', 'FLAVOR')),
  price INT NOT NULL,
  stock INT DEFAULT 0,
  sku TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- ─── 3. Orders ───

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT,
  subtotal INT NOT NULL,
  delivery_fee INT DEFAULT 0,
  discount INT DEFAULT 0,
  total INT NOT NULL,
  voucher_code TEXT,
  delivery_method TEXT CHECK (delivery_method IN ('DELIVERY', 'PICKUP')),
  delivery_date DATE,
  delivery_time_slot TEXT,
  payment_method TEXT CHECK (payment_method IN ('TRANSFER', 'QRIS', 'COD')),
  payment_status TEXT DEFAULT 'UNPAID' CHECK (payment_status IN ('UNPAID', 'PAID', 'REFUNDED')),
  payment_proof_url TEXT,
  status TEXT DEFAULT 'PENDING' CHECK (status IN (
    'PENDING', 'CONFIRMED', 'PROCESSING', 'READY',
    'SHIPPING', 'DELIVERED', 'COMPLETED', 'CANCELLED'
  )),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  variant_name TEXT,
  quantity INT NOT NULL,
  unit_price INT NOT NULL,
  subtotal INT NOT NULL,
  note TEXT
);

CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  updated_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 4. Reviews ───

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_avatar TEXT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  images TEXT[],
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 5. Vouchers ───

CREATE TABLE vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('PERCENTAGE', 'FIXED')),
  value INT NOT NULL,
  min_order_amount INT DEFAULT 0,
  max_discount INT,
  usage_limit INT DEFAULT 0,
  used_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 6. Banners ───

CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image TEXT NOT NULL,
  cta_text TEXT,
  cta_link TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 7. Users (admin profile, extends auth.users) ───

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'STAFF' CHECK (role IN ('OWNER', 'STAFF', 'KASIR')),
  avatar TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 8. Stock Movements ───

CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  variant_name TEXT,
  type TEXT CHECK (type IN ('IN', 'OUT', 'ADJUSTMENT')),
  quantity INT NOT NULL,
  reason TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 9. Chat ───

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_avatar TEXT,
  last_message TEXT,
  last_message_at TIMESTAMPTZ DEFAULT now(),
  unread_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_type TEXT CHECK (sender_type IN ('CUSTOMER', 'ADMIN')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 10. Store Settings (singleton) ───

CREATE TABLE store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name TEXT NOT NULL,
  tagline TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  province TEXT,
  operating_hours JSONB DEFAULT '{}',
  social_media JSONB DEFAULT '{}',
  bank_accounts JSONB DEFAULT '[]',
  qris_image TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_images_product ON product_images(product_id);

-- ═══════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- ─── PUBLIC READ policies (storefront) ───

CREATE POLICY "Public can read categories"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Public can read available products"
  ON products FOR SELECT USING (is_available = true);

CREATE POLICY "Public can read product variants"
  ON product_variants FOR SELECT USING (true);

CREATE POLICY "Public can read product images"
  ON product_images FOR SELECT USING (true);

CREATE POLICY "Public can read active banners"
  ON banners FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read approved reviews"
  ON reviews FOR SELECT USING (is_approved = true);

CREATE POLICY "Public can read active vouchers"
  ON vouchers FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read store settings"
  ON store_settings FOR SELECT USING (true);

-- ─── PUBLIC WRITE policies (storefront customers) ───

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read own order by number"
  ON orders FOR SELECT USING (true);

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read order items"
  ON order_items FOR SELECT USING (true);

CREATE POLICY "Anyone can create reviews"
  ON reviews FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create conversations"
  ON conversations FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read conversations"
  ON conversations FOR SELECT USING (true);

CREATE POLICY "Anyone can send messages"
  ON messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read messages"
  ON messages FOR SELECT USING (true);

-- ─── AUTHENTICATED (admin) policies ───

CREATE POLICY "Admin can do everything on categories"
  ON categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can do everything on products"
  ON products FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can do everything on product_variants"
  ON product_variants FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can do everything on product_images"
  ON product_images FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can do everything on orders"
  ON orders FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can do everything on order_items"
  ON order_items FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage order status history"
  ON order_status_history FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can do everything on reviews"
  ON reviews FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can do everything on vouchers"
  ON vouchers FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can do everything on banners"
  ON banners FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can read users"
  ON users FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage users"
  ON users FOR ALL USING (auth.uid() = id OR auth.role() = 'authenticated');

CREATE POLICY "Admin can manage stock movements"
  ON stock_movements FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage conversations"
  ON conversations FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage messages"
  ON messages FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage store settings"
  ON store_settings FOR ALL USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_categories_updated
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_products_updated
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_orders_updated
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_users_updated
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable Realtime for chat tables
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
