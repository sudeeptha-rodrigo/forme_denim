import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ShopByCollection from './components/ShopByCollection';
import FeaturedDenim from './components/FeaturedDenim';
import BrandStatement from './components/BrandStatement';
import DenimAnatomy from './components/DenimAnatomy';
import Footer from './components/Footer';
import QuickViewModal from './components/QuickViewModal';
import SearchModal from './components/SearchModal';
import BagDrawer from './components/BagDrawer';
import { products } from './data/denimData';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info } from 'lucide-react';

export default function App() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [bagItems, setBagItems] = useState([
    {
      ...products[0],
      size: '30',
      quantity: 1,
    }
  ]);
  const [toast, setToast] = useState(null);

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const handleAddToBag = (product) => {
    setBagItems((prev) => [...prev, { ...product, quantity: 1 }]);
    showToast(`Added ${product.name} (Waist ${product.size || '30'}) to bag.`);
  };

  const handleRemoveFromBag = (indexToRemove) => {
    setBagItems((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCheckoutNotice = () => {
    showToast('Visual Prototype: Checkout is disabled for this frontend preview.', 'info');
  };

  const scrollToCollections = () => {
    const el = document.getElementById('collections');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCollection = (collectionId) => {
    const el = document.getElementById('featured');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(`Filtering archive for ${collectionId.replace('-', ' ').toUpperCase()} silhouettes.`);
  };

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-ivory selection:bg-denim-600 selection:text-white relative">
      
      {/* Toast Notification Pill */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-20 left-1/2 z-50 px-5 py-3 bg-[#161a22] border border-white/20 shadow-2xl backdrop-blur-xl flex items-center space-x-3 text-xs font-mono tracking-wider text-white"
          >
            {toast.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Info className="w-4 h-4 text-denim-300" />
            )}
            <span>{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBag={() => setIsBagOpen(true)}
        bagCount={bagItems.length}
      />

      <main>
        {/* Section 2: Cinematic Hero */}
        <Hero onExploreClick={scrollToCollections} />

        {/* Section 3: Shop By Collection */}
        <ShopByCollection onSelectCollection={handleSelectCollection} />

        {/* Section 4: Featured Denim Showcase */}
        <FeaturedDenim
          onQuickView={(prod) => setQuickViewProduct(prod)}
          onAddToBag={handleAddToBag}
        />

        {/* Bonus Luxury Feature: The Anatomy & Craft of Denim */}
        <DenimAnatomy />

        {/* Section 5: Brand Statement & Manifesto */}
        <BrandStatement />
      </main>

      {/* Section 6: Footer */}
      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onAddToBag={handleAddToBag}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(prod) => {
          setQuickViewProduct(prod);
        }}
      />

      {/* Shopping Bag Drawer */}
      <BagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        items={bagItems}
        onRemoveItem={handleRemoveFromBag}
        onCheckoutNotice={handleCheckoutNotice}
      />
    </div>
  );
}
