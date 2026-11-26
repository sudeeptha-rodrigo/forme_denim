-- ============================================================================
-- FORME DENIM — Luxury Denim E-Commerce Database Schema
-- Migration: 20261123000001_create_denim_ecommerce_schema.sql
-- ============================================================================

-- Ensure pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. HELPER FUNCTIONS & TRIGGERS (Hardened with search_path = '')
-- ============================================================================

-- Generic timestamp updater function with fully-qualified empty search_path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = pg_catalog.now();
  RETURN NEW;
END;
$$;

-- Restrict execution permissions
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_updated_at() TO authenticated, service_role;

-- ============================================================================
-- 2. ADMIN AUTHORIZATION (Protected Table & Security Definer Function)
-- ============================================================================

CREATE TABLE public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Security Definer function with fully-qualified empty search_path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

-- Restrict function execution: Never expose to anon; strictly authenticated and service_role
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- RLS: Only admins can view the admin registry; no client-side inserts/updates
CREATE POLICY "Admins can view admin registry"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ============================================================================
-- 3. CUSTOMER PROFILES
-- ============================================================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trigger to auto-provision profile on Supabase auth.users signup
-- Hardened with empty search_path and fully qualified table/function references
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    updated_at = pg_catalog.now();
  RETURN NEW;
END;
$$;

-- Restrict trigger function execution to service_role only
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profiles RLS Policies
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 4. PRODUCTS
-- ============================================================================

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('wide-leg', 'straight-fit', 'relaxed-fit', 'limited-edition')),
  base_price NUMERIC(12, 2) NOT NULL CHECK (base_price >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'LKR' CHECK (currency IN ('LKR', 'USD')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Note: slug already has an implicit unique index created by UNIQUE constraint
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_active ON public.products(is_active);

-- Products RLS: Separate policies for anon and authenticated to avoid is_admin() execution errors
CREATE POLICY "Anon can view active products"
  ON public.products
  FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Authenticated can view active products or admin view all"
  ON public.products
  FOR SELECT
  TO authenticated
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can insert products"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete products"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================================
-- 5. PRODUCT VARIANTS (Sizes, Measurements & Stock)
-- ============================================================================

CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  size_label TEXT NOT NULL,
  waist_inches NUMERIC(5, 2),
  hip_inches NUMERIC(5, 2),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  price_override NUMERIC(12, 2) CHECK (price_override IS NULL OR price_override >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now(),
  CONSTRAINT uq_product_size UNIQUE (product_id, size_label)
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Note: sku already has an implicit unique index created by UNIQUE constraint
CREATE INDEX idx_product_variants_product ON public.product_variants(product_id);

-- Product Variants RLS: Separated anon and authenticated policies
CREATE POLICY "Anon can view active variants of active products"
  ON public.product_variants
  FOR SELECT
  TO anon
  USING (
    is_active = true AND EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_variants.product_id AND p.is_active = true
    )
  );

CREATE POLICY "Authenticated can view active variants or admin view all"
  ON public.product_variants
  FOR SELECT
  TO authenticated
  USING (
    (is_active = true AND EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_variants.product_id AND p.is_active = true
    )) OR public.is_admin()
  );

CREATE POLICY "Admins can manage variants"
  ON public.product_variants
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- 6. PRODUCT IMAGES
-- ============================================================================

CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  alt_text TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now(),
  CONSTRAINT uq_product_image UNIQUE (product_id, image_url)
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_product_images_product ON public.product_images(product_id, display_order);

-- Product Images RLS: Only images belonging to active products are visible to the public
CREATE POLICY "Anon can view images of active products"
  ON public.product_images
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_images.product_id AND p.is_active = true
    )
  );

CREATE POLICY "Authenticated can view images of active products or admin view all"
  ON public.product_images
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_images.product_id AND p.is_active = true
    ) OR public.is_admin()
  );

CREATE POLICY "Admins can manage product images"
  ON public.product_images
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- 7. ORDERS
-- ============================================================================

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number TEXT NOT NULL UNIQUE,
  order_status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (order_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (payment_status IN ('pending', 'authorized', 'paid', 'failed', 'refunded')),
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (shipping_fee >= 0),
  total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'LKR' CHECK (currency IN ('LKR', 'USD')),
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  customer_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Protect critical financial and ownership fields from direct client updates
CREATE OR REPLACE FUNCTION public.protect_order_financial_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  -- Service role (e.g. backend serverless functions, payment webhooks) has full authority.
  -- Authorization depends on the effective database role (CURRENT_USER).
  IF (CURRENT_USER = 'service_role') THEN
    RETURN NEW;
  END IF;

  -- Authenticated administrators and clients are restricted from altering monetary totals,
  -- order number, customer assignment, and payment status directly.
  IF (
    NEW.subtotal IS DISTINCT FROM OLD.subtotal OR
    NEW.total_amount IS DISTINCT FROM OLD.total_amount OR
    NEW.shipping_fee IS DISTINCT FROM OLD.shipping_fee OR
    NEW.currency IS DISTINCT FROM OLD.currency OR
    NEW.customer_id IS DISTINCT FROM OLD.customer_id OR
    NEW.order_number IS DISTINCT FROM OLD.order_number OR
    NEW.payment_status IS DISTINCT FROM OLD.payment_status
  ) THEN
    RAISE EXCEPTION 'Direct modifications to financial fields, payment status, or order ownership are restricted'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.protect_order_financial_fields() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.protect_order_financial_fields() TO authenticated, service_role;

CREATE TRIGGER trg_protect_order_financial_fields
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_order_financial_fields();

-- Note: order_number already has an implicit unique index created by UNIQUE constraint
CREATE INDEX idx_orders_customer ON public.orders(customer_id);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);

-- Orders RLS: Customers read only their own orders; Admins can read/update all
CREATE POLICY "Customers can view own orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = customer_id OR public.is_admin());

CREATE POLICY "Admins can update orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- CRITICAL SECURITY RULE:
-- ZERO client-side INSERT policy exists on public.orders.
-- Order creation is strictly reserved for the secure serverless backend endpoint
-- (/api/orders/create) running with service_role privileges to ensure all prices,
-- shipping charges, and inventory quantities are re-validated against the database.

-- ============================================================================
-- 8. ORDER ITEMS (Snapshot Integrity for Receipts & Audits)
-- ============================================================================

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name_snapshot TEXT NOT NULL,
  sku_snapshot TEXT NOT NULL,
  size_snapshot TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_snapshot NUMERIC(12, 2) NOT NULL CHECK (unit_price_snapshot >= 0),
  line_total NUMERIC(12, 2) NOT NULL CHECK (line_total >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now(),
  CONSTRAINT check_item_line_total CHECK (line_total = quantity * unit_price_snapshot)
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- Order Items RLS: Only visible to the order's owner or admins
CREATE POLICY "Customers can view items of own orders"
  ON public.order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND (o.customer_id = auth.uid() OR public.is_admin())
    )
  );

-- ============================================================================
-- 9. PAYMENTS (Customer-Facing Receipt Records)
-- ============================================================================

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'payhere' CHECK (provider IN ('payhere', 'bank_transfer', 'cod')),
  provider_transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'successful', 'failed', 'refunded')),
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'LKR' CHECK (currency IN ('LKR', 'USD')),
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_payments_order ON public.payments(order_id);
CREATE INDEX idx_payments_transaction ON public.payments(provider_transaction_id);

-- Payments RLS: Customers read payment receipts for their own orders; writes locked to service_role
CREATE POLICY "Customers can view payments of own orders"
  ON public.payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = payments.order_id AND (o.customer_id = auth.uid() OR public.is_admin())
    )
  );

-- ============================================================================
-- 10. PRIVATE SCHEMA FOR SENSITIVE PAYMENT GATEWAY LOGS
-- ============================================================================

-- Create a dedicated private schema completely isolated from Supabase PostgREST
CREATE SCHEMA IF NOT EXISTS private;

REVOKE ALL ON SCHEMA private FROM PUBLIC;
REVOKE ALL ON SCHEMA private FROM anon;
REVOKE ALL ON SCHEMA private FROM authenticated;
GRANT USAGE ON SCHEMA private TO service_role;

CREATE TABLE private.payment_gateway_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'payhere',
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  signature TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

ALTER TABLE private.payment_gateway_logs ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE private.payment_gateway_logs FROM PUBLIC;
REVOKE ALL ON TABLE private.payment_gateway_logs FROM anon;
REVOKE ALL ON TABLE private.payment_gateway_logs FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER ON TABLE private.payment_gateway_logs TO service_role;
REVOKE TRUNCATE ON TABLE private.payment_gateway_logs FROM service_role;

CREATE INDEX idx_private_payment_logs_payment ON private.payment_gateway_logs(payment_id);
CREATE INDEX idx_private_payment_logs_order ON private.payment_gateway_logs(order_id);

-- ============================================================================
-- 11. LEAST-PRIVILEGE PERMISSIONS & TABLE GRANTS
-- Explicitly revokes all default privileges and grants minimum required access.
-- Protects against unintended default grants and disables TRUNCATE everywhere.
-- ============================================================================

-- A. Revoke all default table privileges from PUBLIC, anon, and authenticated
REVOKE ALL ON TABLE public.admin_users FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.profiles FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.products FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.product_variants FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.product_images FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.orders FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.order_items FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.payments FROM PUBLIC, anon, authenticated;

-- B. Anonymous role (anon) — strictly read-only catalog access
GRANT SELECT ON TABLE public.products TO anon;
GRANT SELECT ON TABLE public.product_variants TO anon;
GRANT SELECT ON TABLE public.product_images TO anon;

-- C. Authenticated role (authenticated)
-- Catalog: SELECT for all authenticated; write operations governed by RLS (is_admin)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.products TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.product_variants TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.product_images TO authenticated;

-- Admin Registry: SELECT only (governed by is_admin RLS); zero client write
GRANT SELECT ON TABLE public.admin_users TO authenticated;

-- Profiles: SELECT and UPDATE own profile (governed by RLS); insertion handled by auth trigger
GRANT SELECT, UPDATE ON TABLE public.profiles TO authenticated;

-- Orders: SELECT own orders or admin view all (governed by RLS).
-- Critical: Restrict UPDATE exclusively to order_status, customer_notes, shipping_address, and updated_at.
-- Financial fields (subtotal, total_amount, shipping_fee, currency), customer ownership, and payment_status
-- are completely excluded from client UPDATE grants and protected by trigger trg_protect_order_financial_fields.
GRANT SELECT ON TABLE public.orders TO authenticated;
GRANT UPDATE (order_status, customer_notes, shipping_address, updated_at) ON TABLE public.orders TO authenticated;

-- Order Items & Payments: Strictly read-only for clients; creation/updates reserved for service_role
GRANT SELECT ON TABLE public.order_items TO authenticated;
GRANT SELECT ON TABLE public.payments TO authenticated;

-- D. Service Role (service_role) — Full administrative backend access (without TRUNCATE)
-- In accordance with least-privilege principles, catastrophic TRUNCATE is stripped from service_role.
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER ON TABLE public.admin_users TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER ON TABLE public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER ON TABLE public.products TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER ON TABLE public.product_variants TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER ON TABLE public.product_images TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER ON TABLE public.orders TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER ON TABLE public.order_items TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER ON TABLE public.payments TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER ON TABLE private.payment_gateway_logs TO service_role;

-- Explicitly ensure TRUNCATE is denied across all roles including service_role
REVOKE TRUNCATE ON TABLE 
  public.admin_users,
  public.profiles,
  public.products,
  public.product_variants,
  public.product_images,
  public.orders,
  public.order_items,
  public.payments,
  private.payment_gateway_logs
FROM PUBLIC, anon, authenticated, service_role;
