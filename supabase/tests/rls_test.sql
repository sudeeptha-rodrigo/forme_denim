-- ============================================================================
-- FORME DENIM — Automated pgTAP Security & RLS Test Suite
-- File: supabase/tests/rls_test.sql
--
-- This suite performs strict automated assertions across 5 role contexts:
-- 1. Anonymous visitor (anon)
-- 2. Customer A (authenticated)
-- 3. Customer B (authenticated)
-- 4. Store Administrator (authenticated + admin_users)
-- 5. Backend Service Role (service_role)
-- ============================================================================

BEGIN;

-- Load pgTAP testing extension
CREATE EXTENSION IF NOT EXISTS pgtap;

-- Declare total planned assertions (46 automated assertions)
SELECT plan(46);

-- ============================================================================
-- TEST FIXTURES SETUP
-- ============================================================================
DO $$
DECLARE
  v_admin_id UUID := '11111111-1111-1111-1111-111111111111';
  v_customer_a_id UUID := '22222222-2222-2222-2222-222222222222';
  v_customer_b_id UUID := '33333333-3333-3333-3333-333333333333';
  v_active_prod_id UUID := 'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa';
  v_inactive_prod_id UUID := 'bbbbbbbb-2222-2222-2222-bbbbbbbbbbbb';
  v_order_a_id UUID := 'cccccccc-3333-3333-3333-cccccccccccc';
  v_order_b_id UUID := 'dddddddd-4444-4444-4444-dddddddddddd';
BEGIN
  -- 1. Provision Auth Users Fixtures
  INSERT INTO auth.users (id, email) VALUES
    (v_admin_id, 'admin@formedenim.com'),
    (v_customer_a_id, 'customer.a@test.com'),
    (v_customer_b_id, 'customer.b@test.com')
  ON CONFLICT (id) DO NOTHING;

  -- 2. Assign Administrator Role
  INSERT INTO public.admin_users (user_id, role)
  VALUES (v_admin_id, 'admin')
  ON CONFLICT (user_id) DO NOTHING;

  -- 3. Provision Products (1 Active, 1 Inactive Draft) with guaranteed baseline prices
  INSERT INTO public.products (id, name, slug, description, category, base_price, is_active)
  VALUES 
    (v_active_prod_id, 'Active Denim Jeans', 'active-denim-jeans', 'Live catalog item', 'straight-fit', 24500.00, true),
    (v_inactive_prod_id, 'Draft Secret Jeans', 'draft-secret-jeans', 'Unreleased prototype', 'wide-leg', 32000.00, false)
  ON CONFLICT (slug) DO UPDATE SET
    base_price = EXCLUDED.base_price,
    is_active = EXCLUDED.is_active;

  -- 4. Provision Product Images (1 for active, 1 for draft)
  INSERT INTO public.product_images (product_id, image_url, display_order)
  VALUES
    (v_active_prod_id, '/images/test-active.jpg', 1),
    (v_inactive_prod_id, '/images/test-draft.jpg', 1)
  ON CONFLICT (product_id, image_url) DO NOTHING;

  -- 5. Provision Variants with guaranteed baseline inventory
  INSERT INTO public.product_variants (product_id, sku, size_label, stock_quantity)
  VALUES 
    (v_active_prod_id, 'TEST-ACT-30', '30', 10),
    (v_inactive_prod_id, 'TEST-DFT-30', '30', 5)
  ON CONFLICT (sku) DO UPDATE SET
    stock_quantity = EXCLUDED.stock_quantity;

  -- 6. Provision Orders with sensitive shipping information
  INSERT INTO public.orders (id, customer_id, order_number, subtotal, total_amount, contact_email, shipping_address)
  VALUES 
    (v_order_a_id, v_customer_a_id, 'FD-ORD-A001', 24500.00, 24500.00, 'customer.a@test.com', '{"city": "Colombo 07", "address": "Secret Villa A"}'::jsonb),
    (v_order_b_id, v_customer_b_id, 'FD-ORD-B001', 19800.00, 19800.00, 'customer.b@test.com', '{"city": "Kandy", "address": "Private Residence B"}'::jsonb)
  ON CONFLICT (order_number) DO NOTHING;

END $$;

-- ============================================================================
-- SUITE 1: ANONYMOUS VISITOR VERIFICATION
-- ============================================================================
SET LOCAL ROLE anon;
SET LOCAL "request.jwt.claim.sub" TO '';

-- Assertion 1: Anonymous visitor CAN read specific active catalog product
SELECT is(
  (SELECT count(*)::int FROM public.products WHERE slug = 'active-denim-jeans' AND is_active = true),
  1,
  'Anon: Specific active product fixture is visible in catalog'
);

-- Assertion 2: Anonymous visitor CANNOT read inactive/draft products
SELECT is(
  (SELECT count(*)::int FROM public.products WHERE is_active = false),
  0,
  'Anon: Cannot view inactive or unreleased draft products'
);

-- Assertion 3: Anonymous visitor CANNOT read images belonging to draft products
SELECT is(
  (SELECT count(*)::int FROM public.product_images WHERE image_url = '/images/test-draft.jpg'),
  0,
  'Anon: Cannot view gallery images of inactive products'
);

-- Assertion 4: Anonymous visitor CANNOT query the isolated private payment logs schema
SELECT throws_ok(
  'SELECT count(*) FROM private.payment_gateway_logs',
  '42501', -- Insufficient privilege code
  NULL,
  'Anon: Query to private.payment_gateway_logs schema must be blocked'
);

-- Assertion 5: Anonymous visitor CANNOT insert orders directly
SELECT throws_ok(
  $$INSERT INTO public.orders (order_number, subtotal, total_amount, contact_email) VALUES ('FD-HACK-ANON', 10.00, 10.00, 'hack@test.com')$$,
  '42501',
  NULL,
  'Anon: Direct client order creation must be rejected'
);

-- ============================================================================
-- SUITE 2: AUTHENTICATED CUSTOMER PRIVACY & TAMPER-RESISTANCE
-- ============================================================================
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" TO '22222222-2222-2222-2222-222222222222'; -- Customer A

-- Assertion 6: Customer A CAN read their own order
SELECT is(
  (SELECT count(*)::int FROM public.orders WHERE customer_id = '22222222-2222-2222-2222-222222222222'),
  1,
  'Customer A: Can view their own order history'
);

-- Assertion 7: Customer A CANNOT view Customer B's order or shipping address
SELECT is(
  (SELECT count(*)::int FROM public.orders WHERE customer_id = '33333333-3333-3333-3333-333333333333'),
  0,
  'Customer A: Cannot view Customer B order or private shipping address'
);

-- Assertion 8: Customer A CANNOT query the isolated private payment logs schema
SELECT throws_ok(
  'SELECT count(*) FROM private.payment_gateway_logs',
  '42501',
  NULL,
  'Customer A: Query to private.payment_gateway_logs schema must be blocked'
);

-- Assertion 9: Customer A CANNOT directly insert order with client-manipulated totals
SELECT throws_ok(
  $$INSERT INTO public.orders (customer_id, order_number, subtotal, total_amount, contact_email) VALUES ('22222222-2222-2222-2222-222222222222', 'FD-TAMPER-001', 1.00, 1.00, 'customer.a@test.com')$$,
  '42501',
  NULL,
  'Customer A: Direct client order creation with manipulated total must be rejected'
);

-- Assertion 10: Customer A unauthorized price UPDATE affects 0 rows (RLS blocks row visibility for UPDATE)
WITH upd AS (
  UPDATE public.products SET base_price = 100.00 WHERE slug = 'active-denim-jeans' RETURNING 1
)
SELECT is(
  (SELECT count(*)::int FROM upd),
  0,
  'Customer A: Unauthorized price UPDATE affects 0 rows'
);

-- Assertion 11: Product base_price remains strictly unchanged at original 24500.00
SELECT is(
  (SELECT base_price FROM public.products WHERE slug = 'active-denim-jeans'),
  24500.00,
  'Customer A: Product base_price remains unchanged at 24500.00'
);

-- Assertion 12: Customer A unauthorized stock UPDATE affects 0 rows
WITH upd AS (
  UPDATE public.product_variants SET stock_quantity = 9999 WHERE sku = 'TEST-ACT-30' RETURNING 1
)
SELECT is(
  (SELECT count(*)::int FROM upd),
  0,
  'Customer A: Unauthorized inventory stock UPDATE affects 0 rows'
);

-- Assertion 13: Variant stock_quantity remains strictly unchanged at original 10
SELECT is(
  (SELECT stock_quantity FROM public.product_variants WHERE sku = 'TEST-ACT-30'),
  10,
  'Customer A: Variant stock_quantity remains unchanged at 10'
);

-- Assertion 14: Customer A unauthorized order update affects 0 rows (RLS prevents customer order updates)
WITH upd AS (
  UPDATE public.orders SET customer_notes = 'tampered note' WHERE id = 'cccccccc-3333-3333-3333-cccccccccccc' RETURNING 1
)
SELECT is(
  (SELECT count(*)::int FROM upd),
  0,
  'Customer A: Unauthorized direct order UPDATE affects 0 rows'
);

-- Assertion 15: Customer A CANNOT insert artificial payment records
SELECT throws_ok(
  $$INSERT INTO public.payments (order_id, provider, status, amount) VALUES ('cccccccc-3333-3333-3333-cccccccccccc', 'payhere', 'successful', 10.00)$$,
  '42501',
  NULL,
  'Customer A: Inserting fake payment confirmations must be rejected'
);

-- Assertion 16: Customer A CANNOT grant themselves administrator role
SELECT throws_ok(
  $$INSERT INTO public.admin_users (user_id, role) VALUES ('22222222-2222-2222-2222-222222222222', 'admin')$$,
  '42501',
  NULL,
  'Customer A: Self-provisioning administrator role must be rejected'
);

-- ============================================================================
-- SUITE 3: STORE ADMINISTRATOR OPERATIONS & RESTRICTIONS
-- ============================================================================
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" TO '11111111-1111-1111-1111-111111111111'; -- Real Store Admin

-- Assertion 17: Administrator CAN view specific inactive draft product fixture
SELECT is(
  (SELECT count(*)::int FROM public.products WHERE slug = 'draft-secret-jeans' AND is_active = false),
  1,
  'Admin: Specific draft product fixture (draft-secret-jeans) is visible to administrator'
);

-- Assertion 18: Administrator CAN view both customer order fixtures
SELECT is(
  (SELECT count(*)::int FROM public.orders WHERE order_number IN ('FD-ORD-A001', 'FD-ORD-B001')),
  2,
  'Admin: Both customer order fixtures (FD-ORD-A001, FD-ORD-B001) are visible to administrator'
);

-- Assertion 19: Administrator is_admin() must return true
SELECT ok(
  (SELECT public.is_admin()),
  'Admin: is_admin() must return true for verified admin user'
);

-- Assertion 20: Administrator CAN update product base price (affects exactly 1 row)
WITH upd AS (
  UPDATE public.products SET base_price = 26000.00 WHERE slug = 'active-denim-jeans' RETURNING 1
)
SELECT is(
  (SELECT count(*)::int FROM upd),
  1,
  'Admin: Can successfully update product base_price (1 row affected)'
);

-- Assertion 21: Administrator price update correctly persisted
SELECT is(
  (SELECT base_price FROM public.products WHERE slug = 'active-denim-jeans'),
  26000.00,
  'Admin: Product base_price successfully updated to 26000.00'
);

-- Assertion 22: Administrator CAN update variant stock (affects exactly 1 row)
WITH upd AS (
  UPDATE public.product_variants SET stock_quantity = 50 WHERE sku = 'TEST-ACT-30' RETURNING 1
)
SELECT is(
  (SELECT count(*)::int FROM upd),
  1,
  'Admin: Can successfully update variant stock_quantity (1 row affected)'
);

-- Assertion 23: Administrator stock update correctly persisted
SELECT is(
  (SELECT stock_quantity FROM public.product_variants WHERE sku = 'TEST-ACT-30'),
  50,
  'Admin: Variant stock_quantity successfully updated to 50'
);

-- Assertion 24: Administrator CAN update allowed fulfillment field order_status (affects 1 row)
WITH upd AS (
  UPDATE public.orders SET order_status = 'processing' WHERE order_number = 'FD-ORD-A001' RETURNING 1
)
SELECT is(
  (SELECT count(*)::int FROM upd),
  1,
  'Admin: Can update order_status for fulfillment (1 row affected)'
);

-- Assertion 25: Administrator order_status update correctly persisted
SELECT is(
  (SELECT order_status FROM public.orders WHERE order_number = 'FD-ORD-A001'),
  'processing',
  'Admin: Order status successfully updated to processing'
);

-- Assertion 26: Administrator CANNOT directly modify order financial totals (total_amount)
SELECT throws_ok(
  $$UPDATE public.orders SET total_amount = 50.00 WHERE order_number = 'FD-ORD-A001'$$,
  '42501',
  NULL,
  'Admin: Direct modification of order total_amount is rejected'
);

-- Assertion 27: Administrator CANNOT directly modify order payment_status
SELECT throws_ok(
  $$UPDATE public.orders SET payment_status = 'paid' WHERE order_number = 'FD-ORD-A001'$$,
  '42501',
  NULL,
  'Admin: Direct modification of order payment_status is rejected'
);

-- Assertion 28: Administrator CANNOT directly reassign order ownership (customer_id)
SELECT throws_ok(
  $$UPDATE public.orders SET customer_id = '11111111-1111-1111-1111-111111111111' WHERE order_number = 'FD-ORD-A001'$$,
  '42501',
  NULL,
  'Admin: Direct reassigning of order customer_id is rejected'
);

-- ============================================================================
-- SUITE 4: BACKEND SERVICE ROLE (WEBHOOK & SERVERLESS) OPERATIONS
-- ============================================================================
SET LOCAL ROLE service_role;
SET LOCAL "request.jwt.claim.sub" TO '';

-- Assertion 29: Service Role CAN legitimately update order financial totals (total_amount)
WITH upd AS (
  UPDATE public.orders SET total_amount = 29900.00 WHERE order_number = 'FD-ORD-A001' RETURNING 1
)
SELECT is(
  (SELECT count(*)::int FROM upd),
  1,
  'Service Role: Can legitimately update order total_amount (1 row affected)'
);

-- Assertion 30: Service Role total_amount update correctly persisted
SELECT is(
  (SELECT total_amount FROM public.orders WHERE order_number = 'FD-ORD-A001'),
  29900.00,
  'Service Role: Order total_amount successfully updated to 29900.00'
);

-- Assertion 31: Service Role CAN legitimately update order payment_status upon gateway confirmation
WITH upd AS (
  UPDATE public.orders SET payment_status = 'paid' WHERE order_number = 'FD-ORD-A001' RETURNING 1
)
SELECT is(
  (SELECT count(*)::int FROM upd),
  1,
  'Service Role: Can legitimately update order payment_status to paid (1 row affected)'
);

-- Assertion 32: Service Role payment_status update correctly persisted
SELECT is(
  (SELECT payment_status FROM public.orders WHERE order_number = 'FD-ORD-A001'),
  'paid',
  'Service Role: Order payment_status successfully updated to paid'
);

-- ============================================================================
-- SUITE 5: LEAST-PRIVILEGE TABLE & COLUMN PRIVILEGES AUDIT
-- ============================================================================

-- Assertion 33: Anonymous visitor has NO SELECT privilege on orders
SELECT ok(
  NOT pg_catalog.has_table_privilege('anon', 'public.orders', 'SELECT'),
  'Privilege: Anon has no SELECT privilege on orders'
);

-- Assertion 34: Anonymous visitor has NO INSERT privilege on products
SELECT ok(
  NOT pg_catalog.has_table_privilege('anon', 'public.products', 'INSERT'),
  'Privilege: Anon has no INSERT privilege on products'
);

-- Assertion 35: Anonymous visitor has NO TRUNCATE privilege on products
SELECT ok(
  NOT pg_catalog.has_table_privilege('anon', 'public.products', 'TRUNCATE'),
  'Privilege: Anon has no TRUNCATE privilege on products'
);

-- Assertion 36: Authenticated role has NO TRUNCATE privilege on products
SELECT ok(
  NOT pg_catalog.has_table_privilege('authenticated', 'public.products', 'TRUNCATE'),
  'Privilege: Authenticated has no TRUNCATE privilege on products'
);

-- Assertion 37: Authenticated role has NO TRUNCATE privilege on orders
SELECT ok(
  NOT pg_catalog.has_table_privilege('authenticated', 'public.orders', 'TRUNCATE'),
  'Privilege: Authenticated has no TRUNCATE privilege on orders'
);

-- Assertion 38: Authenticated role has NO INSERT privilege on orders
SELECT ok(
  NOT pg_catalog.has_table_privilege('authenticated', 'public.orders', 'INSERT'),
  'Privilege: Authenticated has no INSERT privilege on orders'
);

-- Assertion 39: Authenticated role has NO DELETE privilege on orders
SELECT ok(
  NOT pg_catalog.has_table_privilege('authenticated', 'public.orders', 'DELETE'),
  'Privilege: Authenticated has no DELETE privilege on orders'
);

-- Assertion 40: Authenticated role has NO UPDATE privilege on orders.total_amount
SELECT ok(
  NOT pg_catalog.has_column_privilege('authenticated', 'public.orders', 'total_amount', 'UPDATE'),
  'Privilege: Authenticated has no UPDATE on orders.total_amount'
);

-- Assertion 41: Authenticated role has NO UPDATE privilege on orders.payment_status
SELECT ok(
  NOT pg_catalog.has_column_privilege('authenticated', 'public.orders', 'payment_status', 'UPDATE'),
  'Privilege: Authenticated has no UPDATE on orders.payment_status'
);

-- Assertion 42: Authenticated role HAS UPDATE privilege on orders.order_status
SELECT ok(
  pg_catalog.has_column_privilege('authenticated', 'public.orders', 'order_status', 'UPDATE'),
  'Privilege: Authenticated has UPDATE on orders.order_status'
);

-- Assertion 43: Service Role HAS UPDATE privilege on orders
SELECT ok(
  pg_catalog.has_table_privilege('service_role', 'public.orders', 'UPDATE'),
  'Privilege: service_role has UPDATE privilege on orders'
);

-- Assertion 44: Service Role has NO TRUNCATE privilege on orders
SELECT ok(
  NOT pg_catalog.has_table_privilege('service_role', 'public.orders', 'TRUNCATE'),
  'Privilege: service_role has no TRUNCATE privilege on orders'
);

-- Assertion 45: Service Role has NO TRUNCATE privilege on products
SELECT ok(
  NOT pg_catalog.has_table_privilege('service_role', 'public.products', 'TRUNCATE'),
  'Privilege: service_role has no TRUNCATE privilege on products'
);

-- Assertion 46: Service Role has NO TRUNCATE privilege on private.payment_gateway_logs
SELECT ok(
  NOT pg_catalog.has_table_privilege('service_role', 'private.payment_gateway_logs', 'TRUNCATE'),
  'Privilege: service_role has no TRUNCATE privilege on private.payment_gateway_logs'
);

-- Finish pgTAP testing and report assertions
SELECT * FROM finish();

-- Clean rollback guarantees 0 test artifacts or pollution left in database
ROLLBACK;
