-- ============================================================================
-- FORME DENIM — Development Catalog Seed
-- File: supabase/seed.sql
--
-- Loaded automatically by Supabase CLI during "supabase db reset" (local development only).
-- This file is NOT deployed to remote environments via "supabase db push".
-- ============================================================================

DO $$
DECLARE
  prod1_id UUID;
  prod2_id UUID;
  prod3_id UUID;
BEGIN

  -- --------------------------------------------------------------------------
  -- PRODUCT 1: The 01 Selvedge Straight [SAMPLE TEST DATA]
  -- --------------------------------------------------------------------------
  -- Retrieve existing ID by unique slug if already present (to prevent overwriting prices/stock)
  SELECT id INTO prod1_id FROM public.products WHERE slug = 'the-01-selvedge-straight';
  
  IF prod1_id IS NULL THEN
    INSERT INTO public.products (
      name, slug, description, category, base_price, currency, is_active
    ) VALUES (
      'The 01 Selvedge Straight',
      'the-01-selvedge-straight',
      'Woven on vintage 1960s Toyoda mechanical shuttle looms with distinctive redline selvedge ticker. 14.5oz densified raw indigo denim from Kojima, Japan.',
      'straight-fit',
      24500.00,
      'LKR',
      true
    )
    RETURNING id INTO prod1_id;
  ELSE
    RAISE NOTICE 'Product [the-01-selvedge-straight] already exists (id: %). Preserving existing prices and stock.', prod1_id;
  END IF;

  -- Variants for Product 1 (Sizes 28 to 36) - DO NOTHING on conflict preserves active inventory
  INSERT INTO public.product_variants (product_id, sku, size_label, waist_inches, hip_inches, stock_quantity) VALUES
    (prod1_id, 'FD-01-RAW-28', '28', 28.00, 36.50, 12),
    (prod1_id, 'FD-01-RAW-30', '30', 30.00, 38.50, 20),
    (prod1_id, 'FD-01-RAW-32', '32', 32.00, 40.50, 25),
    (prod1_id, 'FD-01-RAW-34', '34', 34.00, 42.50, 15),
    (prod1_id, 'FD-01-RAW-36', '36', 36.00, 44.50, 8)
  ON CONFLICT (sku) DO NOTHING;

  -- Images for Product 1 - DO NOTHING on conflict prevents duplicate gallery entries
  INSERT INTO public.product_images (product_id, image_url, display_order, alt_text, is_primary) VALUES
    (prod1_id, '/images/product-1.jpg', 1, 'The 01 Selvedge Straight in Raw Kuroki Indigo', true),
    (prod1_id, '/images/fabric-texture.jpg', 2, 'Macro weave of 14.5oz Japanese redline selvedge denim', false)
  ON CONFLICT (product_id, image_url) DO NOTHING;


  -- --------------------------------------------------------------------------
  -- PRODUCT 2: The 02 Palazzo Wide-Leg [SAMPLE TEST DATA]
  -- --------------------------------------------------------------------------
  SELECT id INTO prod2_id FROM public.products WHERE slug = 'the-02-palazzo-wide-leg';
  
  IF prod2_id IS NULL THEN
    INSERT INTO public.products (
      name, slug, description, category, base_price, currency, is_active
    ) VALUES (
      'The 02 Palazzo Wide-Leg',
      'the-02-palazzo-wide-leg',
      'Cut with an exaggerated architectural sweep that pools cleanly over footwear. Engineered from 13.5oz organic cotton twill treated with zero-water ozone enzyme finishing.',
      'wide-leg',
      22000.00,
      'LKR',
      true
    )
    RETURNING id INTO prod2_id;
  ELSE
    RAISE NOTICE 'Product [the-02-palazzo-wide-leg] already exists (id: %). Preserving existing prices and stock.', prod2_id;
  END IF;

  -- Variants for Product 2 (Sizes 26 to 34)
  INSERT INTO public.product_variants (product_id, sku, size_label, waist_inches, hip_inches, stock_quantity) VALUES
    (prod2_id, 'FD-02-OZN-26', '26', 26.00, 35.50, 8),
    (prod2_id, 'FD-02-OZN-28', '28', 28.00, 37.50, 18),
    (prod2_id, 'FD-02-OZN-30', '30', 30.00, 39.50, 22),
    (prod2_id, 'FD-02-OZN-32', '32', 32.00, 41.50, 14),
    (prod2_id, 'FD-02-OZN-34', '34', 34.00, 43.50, 6)
  ON CONFLICT (sku) DO NOTHING;

  -- Images for Product 2
  INSERT INTO public.product_images (product_id, image_url, display_order, alt_text, is_primary) VALUES
    (prod2_id, '/images/product-2.jpg', 1, 'The 02 Palazzo Wide-Leg in Ozone Mid-Blue', true),
    (prod2_id, '/images/collection-wide-leg.jpg', 2, 'Editorial drape of the Palazzo Wide-Leg silhouette', false)
  ON CONFLICT (product_id, image_url) DO NOTHING;


  -- --------------------------------------------------------------------------
  -- PRODUCT 3: The 03 Studio Relaxed [SAMPLE TEST DATA]
  -- --------------------------------------------------------------------------
  SELECT id INTO prod3_id FROM public.products WHERE slug = 'the-03-studio-relaxed';
  
  IF prod3_id IS NULL THEN
    INSERT INTO public.products (
      name, slug, description, category, base_price, currency, is_active
    ) VALUES (
      'The 03 Studio Relaxed',
      'the-03-studio-relaxed',
      'Contemporary slouch designed for ease without sacrificing structure. 13oz ring-spun twill treated with pumice-free laser fading and reinforced tobacco seams.',
      'relaxed-fit',
      19800.00,
      'LKR',
      true
    )
    RETURNING id INTO prod3_id;
  ELSE
    RAISE NOTICE 'Product [the-03-studio-relaxed] already exists (id: %). Preserving existing prices and stock.', prod3_id;
  END IF;

  -- Variants for Product 3 (Sizes 28 to 36)
  INSERT INTO public.product_variants (product_id, sku, size_label, waist_inches, hip_inches, stock_quantity) VALUES
    (prod3_id, 'FD-03-VNT-28', '28', 28.00, 37.00, 10),
    (prod3_id, 'FD-03-VNT-30', '30', 30.00, 39.00, 16),
    (prod3_id, 'FD-03-VNT-32', '32', 32.00, 41.00, 24),
    (prod3_id, 'FD-03-VNT-34', '34', 34.00, 43.00, 12),
    (prod3_id, 'FD-03-VNT-36', '36', 36.00, 45.00, 5)
  ON CONFLICT (sku) DO NOTHING;

  -- Images for Product 3
  INSERT INTO public.product_images (product_id, image_url, display_order, alt_text, is_primary) VALUES
    (prod3_id, '/images/product-3.jpg', 1, 'The 03 Studio Relaxed in Vintage Stonewash', true),
    (prod3_id, '/images/hero-campaign.jpg', 2, 'Lifestyle campaign view of the Studio Relaxed denim', false)
  ON CONFLICT (product_id, image_url) DO NOTHING;

END $$;
