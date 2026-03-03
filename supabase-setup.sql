-- ==========================================================
-- SUPABASE TABLE SETUP FOR CYBER-PORTFOLIO
-- Run this in Supabase Dashboard → SQL Editor → New Query
-- ==========================================================

-- 1. Site Data (single-row JSON store for all portfolio config)
CREATE TABLE IF NOT EXISTS site_data (
  id INT PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Contact Messages
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW()
);

-- Allow public read/write (portfolio is public, admin is password-protected at app level)
ALTER TABLE site_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read site_data" ON site_data FOR SELECT USING (true);
CREATE POLICY "Allow public write site_data" ON site_data FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Allow public write messages" ON messages FOR ALL USING (true) WITH CHECK (true);
