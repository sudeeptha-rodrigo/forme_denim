import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

export default function BagDrawer({ isOpen, onClose, items = [], onRemoveItem, onCheckoutNotice }) {
  if (!isOpen) return null;

  const totalLKR = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const totalFormatted = `LKR ${totalLKR.toLocaleString()}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Drawer panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-[#0d0e12] border-l border-white/10 text-ivory h-full shadow-2xl flex flex-col justify-between z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-denim-300 stroke-[1.5]" />
              <span className="font-display text-lg uppercase tracking-wider text-white">
                SHOPPING BAG ({items.length})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/60 hover:text-white transition-colors"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary courier notification bar */}
          <div className="bg-charcoal px-6 py-2.5 border-b border-white/5 flex items-center justify-between text-[10px] font-mono tracking-wider text-denim-300">
            <span>COMPLIMENTARY GLOBAL COURIER</span>
            <span className="text-white/60">INCLUDED</span>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-white/10">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-white/50">
                <ShoppingBag className="w-12 h-12 stroke-[1] mb-4 text-white/30" />
                <p className="font-display uppercase tracking-widest text-sm text-white/70 mb-2">
                  YOUR BAG IS CURRENTLY EMPTY
                </p>
                <p className="font-sans text-xs text-white/40 max-w-xs font-light">
                  Explore our curated collection of architectural denim silhouettes to begin.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 border border-white/20 text-xs font-mono uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors"
                >
                  EXPLORE ARCHIVE
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="py-4 flex space-x-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-20 object-cover object-center bg-charcoal border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[9px] tracking-widest text-denim-300 uppercase block">
                      WAIST: {item.size || '30'} • {item.fit}
                    </span>
                    <h4 className="font-display text-sm uppercase text-white truncate">
                      {item.name}
                    </h4>
                    <p className="font-mono text-xs text-white/70 mt-1">
                      {item.priceFormatted}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem?.(idx)}
                    className="text-white/40 hover:text-red-400 p-2 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout button */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-charcoal-dark flex flex-col space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/60 tracking-widest uppercase">ESTIMATED TOTAL</span>
                <span className="text-white font-bold text-base tracking-widest">
                  {totalFormatted}
                </span>
              </div>

              <button
                onClick={onCheckoutNotice}
                className="w-full py-4 bg-white text-charcoal-dark font-sans text-xs font-semibold tracking-[0.25em] uppercase hover:bg-ivory transition-all flex items-center justify-center space-x-2"
              >
                <span>PROCEED TO ATELIER CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-white/40 tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-denim-400" />
                <span>VISUAL PROTOTYPE • NO PAYMENT REQUIRED</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
