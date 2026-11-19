import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, Compass, ShieldCheck, Droplets, Sparkles } from 'lucide-react';
import { craftsmanshipPillars } from '../data/denimData';

export default function BrandStatement() {
  const stats = [
    { label: 'WATER SAVED', value: '-84%', icon: Droplets, desc: 'via closed-loop ozone finishing' },
    { label: 'LOOM DENSITY', value: '14.5oz', icon: Sparkles, desc: 'pure vintage shuttle loom weave' },
    { label: 'ORGANIC COTTON', value: '100%', icon: Compass, desc: 'certified Aegean & Kuroki fibers' },
    { label: 'SEAM WARRANTY', value: 'LIFETIME', icon: ShieldCheck, desc: 'complimentary repair studio service' },
  ];

  return (
    <section id="manifesto" className="py-28 sm:py-36 bg-[#0a0b0d] text-ivory relative overflow-hidden border-b border-white/5">
      
      {/* Background grain */}
      <div className="absolute inset-0 bg-grain opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Editorial Sub-Header */}
        <div className="flex items-center space-x-3 mb-8">
          <span className="w-8 h-[1px] bg-denim-400" />
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-denim-300">
            THE MANIFESTO & PHILOSOPHY
          </span>
        </div>

        {/* Artistic Typography Statement - Massive Editorial Typography */}
        <div className="mb-20 sm:mb-28">
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: 80, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.08em] font-light uppercase text-white leading-tight"
            >
              NOT JUST DENIM.
            </motion.h2>
          </div>

          <div className="overflow-hidden mt-1 sm:mt-3 flex items-baseline flex-wrap gap-x-6">
            <motion.h2
              initial={{ y: 80, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-editorial italic font-normal text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.04em] text-denim-200 leading-tight"
            >
              A WAY OF LIFE.
            </motion.h2>

            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="font-mono text-xs tracking-[0.3em] uppercase text-white/50 hidden md:inline-block"
            >
              [ ARCHIVE EDITION // FORME 2026 ]
            </motion.span>
          </div>
        </div>

        {/* Editorial Composition: Image & Manifesto Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
          
          {/* Fashion Photograph Column (7 Columns) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative"
          >
            <div className="relative aspect-[4/5] sm:aspect-[16/11] overflow-hidden border border-white/10 group">
              <img
                src="/images/brand-editorial.jpg"
                alt="FORME Denim Brand Editorial"
                className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Image Overlay Label */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-mono text-white/80">
                <span className="tracking-widest uppercase">CAMPAIGN LOOK 09 — THE INDIGO DRAPE</span>
                <span className="tracking-widest text-denim-300">KOJIMA ARCHIVE</span>
              </div>
            </div>

            {/* Overlapping Decorative Badge */}
            <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-charcoal-dark border border-white/20 p-5 hidden sm:flex flex-col max-w-[200px] shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-widest text-denim-400 uppercase">SLOW CRAFT</span>
              <span className="text-xs font-sans text-white/90 mt-1">48 Hours Per Garment Assembly</span>
            </div>
          </motion.div>

          {/* Manifesto Text Column (5 Columns) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-center space-y-8"
          >
            <div className="space-y-4">
              <h3 className="font-display text-2xl uppercase tracking-wider text-white">
                WE CRAFT DENIM AS AN ARCHITECTURAL OBJECT.
              </h3>
              <p className="font-sans text-sm sm:text-base text-white/70 font-light leading-relaxed">
                Denim is the canvas of modern life — born in workwear ateliers, elevated on international runways, and personalized through every individual fold and wash.
              </p>
              <p className="font-sans text-sm sm:text-base text-white/70 font-light leading-relaxed">
                At FORME, we reject the ephemeral churn of fast fashion. Every pair is cut with deliberate geometry, engineered on heritage shuttle looms, and treated with pure water stewardship.
              </p>
            </div>

            {/* Pillars Accordion / List */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              {craftsmanshipPillars.slice(0, 2).map((pillar) => (
                <div key={pillar.number} className="flex items-start space-x-4">
                  <span className="font-mono text-xs tracking-widest text-denim-300 pt-0.5">
                    {pillar.number}
                  </span>
                  <div>
                    <h4 className="font-sans text-xs tracking-widest uppercase font-semibold text-white">
                      {pillar.title}
                    </h4>
                    <p className="font-sans text-xs text-white/60 font-light leading-relaxed mt-1">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <a
                href="#collections"
                className="inline-flex items-center space-x-2 text-xs font-mono tracking-[0.25em] uppercase text-white font-medium border-b border-white pb-1 hover:text-denim-200 hover:border-denim-200 transition-colors"
              >
                <span>EXPLORE ARCHIVE SILHOUETTES</span>
                <ArrowDownRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

        </div>

        {/* 4 Stats & Environmental Stewardship Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-white/10">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="p-6 bg-charcoal/50 border border-white/10 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-5 h-5 text-denim-300 stroke-[1.5]" />
                  <span className="font-mono text-[9px] tracking-[0.25em] text-white/40 uppercase">
                    STANDARD
                  </span>
                </div>
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-light text-white tracking-wide">
                    {s.value}
                  </div>
                  <div className="font-mono text-[10px] tracking-widest text-white/70 uppercase mt-1">
                    {s.label}
                  </div>
                  <p className="font-sans text-[11px] text-white/40 font-light mt-1.5 leading-snug">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
