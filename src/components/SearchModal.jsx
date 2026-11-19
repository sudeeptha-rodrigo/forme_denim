import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { products, collections } from '../data/denimData';

export default function SearchModal({ isOpen, onClose, onSelectProduct }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.fit.toLowerCase().includes(query.toLowerCase()) ||
          p.fabric.toLowerCase().includes(query.toLowerCase()) ||
          p.color.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const popularSearches = ['Wide Leg', 'Selvedge Straight', 'Raw Kuroki', 'Ozone Wash', 'Noir Atelier'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-start items-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#08090b]/95 backdrop-blur-xl"
        />

        {/* Search Header Container */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl px-6 sm:px-8 pt-12 pb-8 z-10"
        >
          {/* Close button */}
          <div className="flex justify-between items-center mb-6">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/50">
              SEARCH ATELIER ARCHIVE
            </span>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white transition-colors"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Input Box */}
          <div className="relative border-b-2 border-white/30 focus-within:border-white transition-colors pb-3 flex items-center">
            <Search className="w-6 h-6 text-white/40 mr-4 stroke-[1.5]" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH SILHOUETTE, DENIM WEIGHT, WASH..."
              className="w-full bg-transparent text-xl sm:text-2xl font-light font-display tracking-widest text-white placeholder-white/30 focus:outline-none uppercase"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-white/40 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Trending / Popular Searches */}
          {!query && (
            <div className="mt-8">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40 block mb-3">
                POPULAR SEARCH TERMS
              </span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-mono tracking-wider text-white/80 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && (
            <div className="mt-8 max-h-[50vh] overflow-y-auto">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        onSelectProduct(prod);
                        onClose();
                      }}
                      className="p-3 bg-charcoal/60 border border-white/10 hover:border-white/30 flex items-center space-x-4 cursor-pointer transition-all group"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-16 h-20 object-cover object-center filter brightness-90 group-hover:brightness-100"
                      />
                      <div>
                        <span className="font-mono text-[9px] tracking-widest text-denim-300 uppercase block">
                          {prod.fit}
                        </span>
                        <h4 className="font-display text-sm uppercase text-white group-hover:text-denim-200 transition-colors">
                          {prod.name}
                        </h4>
                        <span className="font-mono text-xs text-white/70">
                          {prod.priceFormatted}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-white/50 font-mono text-xs tracking-wider">
                  NO DENIM ARCHIVE MATCH FOR "{query.toUpperCase()}". TRY "WIDE LEG" OR "SELVEDGE".
                </div>
              )}
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
