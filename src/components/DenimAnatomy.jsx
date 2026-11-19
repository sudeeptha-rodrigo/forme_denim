import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Disc, Scissors, ShieldAlert } from 'lucide-react';

export default function DenimAnatomy() {
  const [activeSpot, setActiveSpot] = useState(0);

  const hotspots = [
    {
      id: 'selvedge',
      title: 'Redline Shuttle Loom Selvedge',
      tag: 'CRAFT SPEC 01',
      icon: Layers,
      description: 'Woven on restored 1960s Toyoda mechanical shuttle looms in Kojima. The slow tension produces a unique character and an iconic self-finished edge that never frays.',
      image: '/images/fabric-texture.jpg',
      stat: '14.5oz Densified Twill'
    },
    {
      id: 'hardware',
      title: 'Hand-Hammered Solid Brass',
      tag: 'CRAFT SPEC 02',
      icon: Disc,
      description: 'Custom antiqued gunmetal buttons and reinforced pocket rivets cast from recycled solid copper and brass. Finished with a satin protective patina.',
      image: '/images/craft-details.jpg',
      stat: '50-Year Corrosion Resistance'
    },
    {
      id: 'stitch',
      title: 'Heavy-Gauge Tobacco Seams',
      tag: 'CRAFT SPEC 03',
      icon: Scissors,
      description: 'Triple-needle felled chain-stitching across stress zones using bonded dual-core cotton-poly thread for maximum flexibility without blowout.',
      image: '/images/hero-campaign.jpg',
      stat: 'High-Tensile Reinforcement'
    }
  ];

  const current = hotspots[activeSpot];

  return (
    <section className="py-24 sm:py-32 bg-[#0c0d0f] text-ivory relative border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="w-8 h-[1px] bg-denim-400" />
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-denim-300">
                MATERIAL INTELLIGENCE
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-wider text-white">
              THE ANATOMY OF <span className="font-editorial italic font-normal text-denim-200">FORME</span>
            </h2>
          </div>

          <p className="mt-4 md:mt-0 font-sans text-sm text-white/60 max-w-sm font-light leading-relaxed tracking-wide">
            Inspect the tactile elements that elevate our denim from mere apparel into modern heirlooms.
          </p>
        </div>

        {/* Interactive Anatomy Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Navigation Controls on Left (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {hotspots.map((spot, idx) => {
              const Icon = spot.icon;
              const isActive = activeSpot === idx;
              return (
                <button
                  key={spot.id}
                  onClick={() => setActiveSpot(idx)}
                  className={`text-left p-6 border transition-all duration-300 flex flex-col space-y-2 relative overflow-hidden ${
                    isActive
                      ? 'bg-charcoal border-white/40 shadow-xl'
                      : 'bg-charcoal/30 border-white/10 hover:border-white/20 hover:bg-charcoal/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="anatomy-highlight"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-denim-300"
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-widest text-denim-300 uppercase">
                      {spot.tag}
                    </span>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/40'}`} />
                  </div>

                  <h3 className="font-display text-lg uppercase tracking-wider text-white">
                    {spot.title}
                  </h3>

                  <p className="font-sans text-xs text-white/60 font-light leading-relaxed">
                    {spot.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-white/40 tracking-wider">
                    <span>BENCHMARK</span>
                    <span className="text-white/80">{spot.stat}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Large Macro Photography Preview on Right (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden border border-white/10 bg-charcoal">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.image}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full relative"
                >
                  <img
                    src={current.image}
                    alt={current.title}
                    className="w-full h-full object-cover object-center filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Photo Caption Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-mono text-white/80">
                    <span className="tracking-widest uppercase">{current.title}</span>
                    <span className="tracking-widest text-denim-300 bg-black/60 px-2.5 py-1 backdrop-blur-md border border-white/10">
                      MACRO INSPECTION
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
