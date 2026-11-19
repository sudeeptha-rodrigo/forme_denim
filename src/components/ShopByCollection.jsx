import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { collections } from '../data/denimData';

export default function ShopByCollection({ onSelectCollection }) {
  return (
    <section id="collections" className="py-24 sm:py-32 bg-[#0c0d0f] text-ivory relative border-b border-white/5">
      
      {/* Background grain texture */}
      <div className="absolute inset-0 bg-grain opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header - Editorial Fashion Layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="w-8 h-[1px] bg-denim-400" />
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-denim-300">
                CURATED SILHOUETTES
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-wider text-white">
              SHOP BY <span className="font-editorial italic font-normal text-denim-200">COLLECTION</span>
            </h2>
          </div>

          <p className="mt-4 md:mt-0 font-sans text-sm text-white/60 max-w-sm font-light leading-relaxed tracking-wide">
            Three defined architectural cuts. Woven with heritage craftsmanship for exceptional longevity and structure.
          </p>
        </div>

        {/* Asymmetrical Editorial Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: Wide Leg (Dominant Spanning 7 Columns) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 group relative flex flex-col justify-end overflow-hidden min-h-[580px] sm:min-h-[640px] bg-charcoal cursor-pointer border border-white/10 hover:border-white/30 transition-all duration-500"
            onClick={() => onSelectCollection?.('wide-leg')}
          >
            {/* Background Image with Zoom on Hover */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src={collections[0].image}
                alt={collections[0].title}
                className="w-full h-full object-cover object-top filter brightness-90 group-hover:scale-105 group-hover:brightness-95 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-85 transition-opacity" />
            </div>

            {/* Top metadata tags */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
              <span className="font-mono text-xs tracking-[0.3em] uppercase px-3 py-1 bg-black/60 backdrop-blur-md border border-white/15 text-white/90">
                {collections[0].number} — {collections[0].tag}
              </span>
              <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-charcoal transition-all duration-300">
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 p-8 sm:p-10">
              <div className="flex flex-wrap gap-2 mb-3">
                {collections[0].specs.map((spec) => (
                  <span key={spec} className="font-mono text-[10px] tracking-wider text-denim-200 uppercase bg-denim-900/60 px-2.5 py-0.5 rounded border border-denim-500/20">
                    {spec}
                  </span>
                ))}
              </div>

              <h3 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-white mb-2 group-hover:text-denim-200 transition-colors">
                {collections[0].title}
              </h3>
              
              <p className="font-sans text-sm text-white/70 max-w-md mb-6 font-light">
                {collections[0].description}
              </p>

              <div className="inline-flex items-center space-x-2 text-xs font-mono tracking-[0.25em] uppercase text-white font-medium border-b border-white/40 pb-1 group-hover:border-white transition-colors">
                <span>VIEW WIDE LEG CATALOG</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>

          {/* Column for Cards 2 and 3 (5 Columns stacked) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Card 2: Straight Fit */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex-1 min-h-[300px] sm:min-h-[320px] flex flex-col justify-end overflow-hidden bg-charcoal cursor-pointer border border-white/10 hover:border-white/30 transition-all duration-500"
              onClick={() => onSelectCollection?.('straight-fit')}
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={collections[1].image}
                  alt={collections[1].title}
                  className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 group-hover:brightness-95 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-90 group-hover:opacity-85 transition-opacity" />
              </div>

              {/* Top tag */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                <span className="font-mono text-[11px] tracking-[0.25em] uppercase px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/15 text-white/90">
                  {collections[1].number} — {collections[1].tag}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-charcoal transition-all duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Bottom text */}
              <div className="relative z-10 p-6 sm:p-7">
                <h3 className="font-display text-2xl uppercase tracking-wider text-white mb-1 group-hover:text-denim-200 transition-colors">
                  {collections[1].title}
                </h3>
                <p className="font-sans text-xs text-white/70 max-w-sm mb-4 font-light">
                  {collections[1].subtitle}
                </p>
                <div className="inline-flex items-center space-x-2 text-[11px] font-mono tracking-[0.25em] uppercase text-white font-medium border-b border-white/40 pb-0.5 group-hover:border-white transition-colors">
                  <span>DISCOVER FIT</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            </motion.div>

            {/* Card 3: Relaxed Fit */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex-1 min-h-[300px] sm:min-h-[320px] flex flex-col justify-end overflow-hidden bg-charcoal cursor-pointer border border-white/10 hover:border-white/30 transition-all duration-500"
              onClick={() => onSelectCollection?.('relaxed-fit')}
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={collections[2].image}
                  alt={collections[2].title}
                  className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 group-hover:brightness-95 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-90 group-hover:opacity-85 transition-opacity" />
              </div>

              {/* Top tag */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                <span className="font-mono text-[11px] tracking-[0.25em] uppercase px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/15 text-white/90">
                  {collections[2].number} — {collections[2].tag}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-charcoal transition-all duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Bottom text */}
              <div className="relative z-10 p-6 sm:p-7">
                <h3 className="font-display text-2xl uppercase tracking-wider text-white mb-1 group-hover:text-denim-200 transition-colors">
                  {collections[2].title}
                </h3>
                <p className="font-sans text-xs text-white/70 max-w-sm mb-4 font-light">
                  {collections[2].subtitle}
                </p>
                <div className="inline-flex items-center space-x-2 text-[11px] font-mono tracking-[0.25em] uppercase text-white font-medium border-b border-white/40 pb-0.5 group-hover:border-white transition-colors">
                  <span>DISCOVER FIT</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
