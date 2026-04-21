-- =============================================================
-- EnigmAI – Seed Data (development only)
-- Run AFTER 001_initial_schema.sql
-- =============================================================

-- Demo store
insert into stores (id, name, domain, phone, address, about, agent_name)
values (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'מתנות עם לב',
  'giftswithlove.co.il',
  '03-1234567',
  'תל אביב, ישראל',
  'חנות מתנות ועיצוב הבית המתמחה במוצרים ייחודיים ואישיים.',
  'ארי'
);

-- Customers
insert into customers (store_id, name, email, status, total_spent, orders_count, rating, last_chat_at) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'שרה לוי',    'sarah@example.com',  'vip',     1240, 8,  4.9, now() - interval '2 hours'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'יוסף כהן',   'yosef@example.com',  'regular',  420, 3,  3.5, now() - interval '1 day'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'מירה שמש',   'mira@example.com',   'vip',     2180, 12, 5.0, now() - interval '7 days'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'דוד מזרחי',  'david@example.com',  'new',      190, 1,  4.0, now() - interval '30 days'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'רחל גולן',   'rachel@example.com', 'regular',  780, 5,  4.7, now() - interval '7 days'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'אבי נתן',    'avi@example.com',    'vip',     3600, 20, 4.8, now() - interval '2 days'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'נועה ברק',   'noa@example.com',    'regular',  320, 2,  4.2, now() - interval '3 days');

-- Products
insert into products (store_id, name, sku, price, original_price, stock, status, sold_count, rating, description) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'נר ריחני לבנדר מינימליסטי', 'CND-001', 89,  129,  24, 'active',      142, 4.8, 'נר סויה טבעי בריח לבנדר, זמן בעירה 45 שעות'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'ערכת DIY לעיצוב בית – אביב', 'DIY-009', 149, null,  5, 'active',       38, 4.6, 'ערכת יצירה מלאה לעיצוב הבית בסגנון אביב'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'ארנק עור אמיתי – גברים',    'WLT-003', 199, 249,   1, 'active',       87, 4.9, 'ארנק עור איטלקי, 8 כיסי כרטיסים'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'תמונת קנבס – פריז בשחור לבן','ART-017', 320, null,  12, 'active',      55, 4.7, 'הדפסת UV על קנבס מתוח, מסגרת עץ'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'מארז מתנה – ספא ביתי',       'GFT-024', 249, 299,   0, 'out_of_stock',201, 5.0, 'מארז ספא מפנק: מלח אמבט, שמן ניחוחות ונר'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'פנס עץ עם נר LED',           'DEC-011', 119, null,  18, 'active',       72, 4.5, 'פנס עץ בעיצוב כפרי עם נר LED נטען');
