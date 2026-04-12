-- ═══════════════════════════════════════════════════════
-- Dapoer Ajung Cookies & Bakery — Notifications System
-- ═══════════════════════════════════════════════════════

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN (
    'NEW_ORDER', 'LOW_STOCK', 'OUT_OF_STOCK',
    'NEW_REVIEW', 'NEW_CHAT'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  reference_id UUID,
  reference_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage notifications"
  ON notifications FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Public can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
