// ═══════════════════════════════════════════════════════
// Migration Runner — Run via: node supabase/run-migration.mjs
// Uses Supabase REST API (no database password needed)
// ═══════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://khkshqtpcpwyjhgoxbld.supabase.co';
// Service role key is needed for DDL operations - get from Supabase Dashboard > Settings > API > service_role
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.error('   Get it from: Supabase Dashboard → Settings → API → service_role (secret)');
  console.error('   Run: $env:SUPABASE_SERVICE_ROLE_KEY="your_key_here"; node supabase/run-migration.mjs');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

// SQL statements to run (indexes, RLS, triggers)
const SQL_STATEMENTS = [
  // ─── INDEXES ───
  `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)`,
  `CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug)`,
  `CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true`,
  `CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number)`,
  `CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`,
  `CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id)`,
  `CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id)`,
  `CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id)`,
  `CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON stock_movements(product_id)`,
  `CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id)`,
  `CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id)`,

  // ─── ENABLE RLS ───
  `ALTER TABLE categories ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE products ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE product_images ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE orders ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE order_items ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE reviews ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE banners ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE users ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE conversations ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE messages ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY`,

  // ─── PUBLIC READ POLICIES ───
  `CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true)`,
  `CREATE POLICY "Public can read available products" ON products FOR SELECT USING (is_available = true)`,
  `CREATE POLICY "Public can read product variants" ON product_variants FOR SELECT USING (true)`,
  `CREATE POLICY "Public can read product images" ON product_images FOR SELECT USING (true)`,
  `CREATE POLICY "Public can read active banners" ON banners FOR SELECT USING (is_active = true)`,
  `CREATE POLICY "Public can read approved reviews" ON reviews FOR SELECT USING (is_approved = true)`,
  `CREATE POLICY "Public can read active vouchers" ON vouchers FOR SELECT USING (is_active = true)`,
  `CREATE POLICY "Public can read store settings" ON store_settings FOR SELECT USING (true)`,

  // ─── PUBLIC WRITE POLICIES ───
  `CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true)`,
  `CREATE POLICY "Anyone can read orders" ON orders FOR SELECT USING (true)`,
  `CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true)`,
  `CREATE POLICY "Anyone can read order items" ON order_items FOR SELECT USING (true)`,
  `CREATE POLICY "Anyone can create reviews" ON reviews FOR INSERT WITH CHECK (true)`,
  `CREATE POLICY "Anyone can create conversations" ON conversations FOR INSERT WITH CHECK (true)`,
  `CREATE POLICY "Anyone can read conversations" ON conversations FOR SELECT USING (true)`,
  `CREATE POLICY "Anyone can send messages" ON messages FOR INSERT WITH CHECK (true)`,
  `CREATE POLICY "Anyone can read messages" ON messages FOR SELECT USING (true)`,

  // ─── ADMIN POLICIES ───
  `CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (auth.role() = 'authenticated')`,
  `CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.role() = 'authenticated')`,
  `CREATE POLICY "Admin full access product_variants" ON product_variants FOR ALL USING (auth.role() = 'authenticated')`,
  `CREATE POLICY "Admin full access product_images" ON product_images FOR ALL USING (auth.role() = 'authenticated')`,
  `CREATE POLICY "Admin full access orders" ON orders FOR ALL USING (auth.role() = 'authenticated')`,
  `CREATE POLICY "Admin full access order_items" ON order_items FOR ALL USING (auth.role() = 'authenticated')`,
  `CREATE POLICY "Admin full access order_status_history" ON order_status_history FOR ALL USING (auth.role() = 'authenticated')`,
  `CREATE POLICY "Admin full access reviews" ON reviews FOR ALL USING (auth.role() = 'authenticated')`,
  `CREATE POLICY "Admin full access vouchers" ON vouchers FOR ALL USING (auth.role() = 'authenticated')`,
  `CREATE POLICY "Admin full access banners" ON banners FOR ALL USING (auth.role() = 'authenticated')`,
  `CREATE POLICY "Admin read users" ON users FOR SELECT USING (auth.role() = 'authenticated')`,
  `CREATE POLICY "Admin manage users" ON users FOR ALL USING (auth.uid() = id OR auth.role() = 'authenticated')`,
  `CREATE POLICY "Admin full access stock_movements" ON stock_movements FOR ALL USING (auth.role() = 'authenticated')`,
  `CREATE POLICY "Admin full access conversations" ON conversations FOR ALL USING (auth.role() = 'authenticated')`,
  `CREATE POLICY "Admin full access messages" ON messages FOR ALL USING (auth.role() = 'authenticated')`,
  `CREATE POLICY "Admin full access store_settings" ON store_settings FOR ALL USING (auth.role() = 'authenticated')`,

  // ─── TRIGGERS ───
  `CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql`,
  `CREATE TRIGGER trigger_categories_updated BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at()`,
  `CREATE TRIGGER trigger_products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at()`,
  `CREATE TRIGGER trigger_orders_updated BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at()`,
  `CREATE TRIGGER trigger_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at()`,

  // ─── REALTIME ───
  `ALTER PUBLICATION supabase_realtime ADD TABLE messages`,
  `ALTER PUBLICATION supabase_realtime ADD TABLE conversations`,
];

async function runMigration() {
  console.log('🚀 Running migration: Indexes, RLS Policies, Triggers, Realtime...\n');

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const sql of SQL_STATEMENTS) {
    const shortLabel = sql.substring(0, 80).replace(/\n/g, ' ');
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
      if (error) {
        // Check if it's a "already exists" error — that's OK
        if (error.message?.includes('already exists')) {
          console.log(`⏭️  Skipped (exists): ${shortLabel}...`);
          skipped++;
        } else {
          console.error(`❌ Failed: ${shortLabel}...`);
          console.error(`   Error: ${error.message}`);
          failed++;
        }
      } else {
        console.log(`✅ OK: ${shortLabel}...`);
        success++;
      }
    } catch (err) {
      console.error(`❌ Error: ${shortLabel}...`);
      console.error(`   ${err.message}`);
      failed++;
    }
  }

  console.log(`\n═══════════════════════════════════════`);
  console.log(`✅ Success: ${success}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed:  ${failed}`);
  console.log(`═══════════════════════════════════════`);
}

runMigration();
