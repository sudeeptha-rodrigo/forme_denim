import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Plus, Check } from 'lucide-react';
import { products } from '../data/denimData';

export default function FeaturedDenim({ onQuickView, onAddToBag }) {
  const [addedId, setAddedId] = useState(null);

  const handleQuickAdd = (product, e) => {
    e.stopPropagation();
    setAddedId(product.id);
    onAddToBag?.(product);
    setTimeout(() => {
      setAddedId(null);
    }, 1800);
  };

  return (
    <section id="featured" className="py-24 sm:py-32 bg-[#08090a] text-ivory relative border-b border-white/5">
      
      {/* Background grain texture */}
      <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="w-8 h-[1px] bg-denim-400" />
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-denim-300">
                ATELIER SHOWCASE
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-wider text-white">
              FEATURED <span className="font-editorial italic font-normal text-denim-200">DENIM</span>
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-6 text-xs font-mono text-white/50 tracking-widest uppercase">
            <span>CURATED SELECTION</span>
            <span>•</span>
            <span>PRICED IN LKR</span>
          </div>
        </div>

        {/* 4 Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col cursor-pointer"
              onClick={() => onQuickView?.(product)}
            >
              {/* Image Container with Elegant Hover Effects */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal mb-5 border border-white/10 group-hover:border-white/30 transition-all duration-300">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center filter brightness-[0.92] group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                />

                {/* Badge Tag */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-1 bg-black/70 backdrop-blur-md border border-white/15 text-white/90">
                    {product.badge}
                  </span>
                </div>

                {/* Quick Action Overlay (Slide-Up on Hover) */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex items-center justify-between gap-2 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickView?.(product);
                    }}
                    className="flex-1 py-2 px-3 bg-white/10 hover:bg-white text-white hover:text-charcoal-dark backdrop-blur-md text-[10px] font-mono tracking-widest uppercase transition-all duration-200 flex items-center justify-center space-x-1.5 border border-white/20"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>QUICK VIEW</span>
                  </button>

                  <button
                    onClick={(e) => handleQuickAdd(product, e)}
                    className={`py-2 px-3 backdrop-blur-md text-[10px] font-mono tracking-widest uppercase transition-all duration-200 flex items-center justify-center border ${
                      addedId === product.id
                        ? 'bg-denim-600 border-denim-400 text-white'
                        : 'bg-white text-charcoal-dark border-white hover:bg-ivory'
                    }`}
                    title="Add to Bag"
                  >
                    {addedId === product.id ? (
                      <Check className="w-3.5 h-3.5 text-white animate-scale-up" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Product Information */}
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">
                    {product.fit}
                  </span>
                  <div className="flex items-center space-x-1.5" title={product.color}>
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/30"
                      style={{ backgroundColor: product.colorHex }}
                    />
                  </div>
                </div>

                <h3 className="font-display text-base uppercase tracking-wider text-white group-hover:text-denim-200 transition-colors">
                  {product.name}
                </h3>

                <p className="font-mono text-sm tracking-widest text-white/90 pt-0.5">
                  {product.priceFormatted}
                </p>

                <p className="text-[11px] font-sans text-white/40 tracking-wide pt-1">
                  {product.fabric}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Editorial Callout */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-white/60 tracking-wider">
          <p className="uppercase">ALL FORME DENIM GARMENTS ARE NUMBERED & INDIVIDUALLY INSPECTED</p>
          <a
            href="#manifesto"
            className="mt-3 sm:mt-0 uppercase text-white hover:text-denim-300 underline underline-offset-4 tracking-widest transition-colors"
          >
            LEARN ABOUT RAW JAPANESE SELVEDGE →
          </a>
        </div>

      </div>
    </section>
  );
}
