import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react';

export default function Hero({ onExploreClick }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const heroImages = [
    {
      src: '/images/hero-campaign.jpg',
      label: 'CAMPAIGN 01 — THE SCULPTURAL CUT',
      model: '14.5oz Raw Kuroki Selvedge',
    },
    {
      src: '/images/hero-campaign-alt.jpg',
      label: 'CAMPAIGN 02 — THE ARCHITECTURAL STANCE',
      model: 'Ozone-Washed Palazzo Wide Leg',
    }
  ];

  const currentImage = heroImages[activeImageIndex];

  return (
    <section id="hero" className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-charcoal-dark select-none">
      
      {/* Background Photography with smooth transition & subtle zoom */}
      <motion.div
        key={currentImage.src}
        initial={{ scale: 1.08, opacity: 0.4 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src={currentImage.src}
          alt="FORME Denim Campaign Editorial"
          className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.08]"
        />
        {/* Editorial Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d0f] via-black/40 to-[#0c0d0f]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" />
      </motion.div>

      {/* Floating High-Fashion Micro Metadata */}
      <div className="absolute top-28 left-6 sm:left-12 hidden md:flex items-center space-x-3 text-[10px] font-mono tracking-[0.3em] uppercase text-white/60">
        <span className="w-2 h-2 rounded-full bg-denim-400 animate-pulse" />
        <span>COLLECTION 04 / ATELIER 2026</span>
      </div>

      <div className="absolute top-28 right-6 sm:right-12 hidden md:flex items-center space-x-2 text-[10px] font-mono tracking-[0.3em] uppercase text-white/60">
        <span>KOJIMA LOOM — 35.67° N, 139.65° E</span>
      </div>

      {/* Hero Content Center */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center mt-12 sm:mt-16">
        
        {/* Campaign Capsule Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/20 bg-black/40 backdrop-blur-md mb-6 sm:mb-8"
        >
          <Sparkles className="w-3 h-3 text-denim-300" />
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-white/90">
            AUTUMN / WINTER 2026 EDITORIAL
          </span>
        </motion.div>

        {/* Massive Editorial Headline */}
        <div className="overflow-hidden mb-4 sm:mb-6">
          <motion.h1
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.14em] font-light uppercase text-white leading-[0.95]"
          >
            DENIM.
          </motion.h1>
          <motion.h1
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            className="font-editorial italic font-normal text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.06em] text-denim-200 leading-[0.95] mt-1"
          >
            REDEFINED.
          </motion.h1>
        </div>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="font-sans text-base sm:text-lg md:text-xl font-light tracking-[0.18em] uppercase text-white/80 max-w-xl mx-auto mb-10 sm:mb-12"
        >
          Everyday essentials. Extraordinary attitude.
        </motion.p>

        {/* Buttons / CTA */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          {/* Primary CTA */}
          <button
            onClick={onExploreClick}
            className="group relative px-8 py-4 bg-white text-charcoal-dark font-sans text-xs tracking-[0.25em] uppercase font-semibold overflow-hidden transition-all duration-300 hover:bg-ivory hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center space-x-3 cursor-pointer"
          >
            <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">
              EXPLORE COLLECTION
            </span>
            <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-denim-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          {/* Secondary CTA */}
          <a
            href="#manifesto"
            className="px-8 py-4 border border-white/30 text-white/90 hover:text-white font-sans text-xs tracking-[0.25em] uppercase font-medium backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10"
          >
            THE MANIFESTO
          </a>
        </motion.div>
      </div>

      {/* Perspective / Campaign Switcher (Bottom Right) */}
      <div className="absolute bottom-8 right-6 sm:right-12 hidden sm:flex items-center space-x-3 z-20">
        <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
          VIEW:
        </span>
        {heroImages.map((img, idx) => (
          <button
            key={img.label}
            onClick={() => setActiveImageIndex(idx)}
            className={`px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase transition-all duration-300 ${
              activeImageIndex === idx
                ? 'bg-white text-charcoal-dark font-semibold'
                : 'bg-black/40 text-white/60 hover:text-white border border-white/20'
            }`}
          >
            0{idx + 1}
          </button>
        ))}
      </div>

      {/* Minimalist Scroll Indicator (Bottom Center) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 z-20 cursor-pointer text-white/60 hover:text-white transition-colors"
        onClick={onExploreClick}
      >
        <span className="text-[9px] font-mono tracking-[0.35em] uppercase">
          DISCOVER
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ArrowDown className="w-3.5 h-3.5 stroke-[1.5]" />
        </motion.div>
      </motion.div>

      {/* Bottom subtle edge border */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
}
