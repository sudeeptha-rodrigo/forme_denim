import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShieldCheck, Ruler, Sparkles } from 'lucide-react';

export default function QuickViewModal({ product, isOpen, onClose, onAddToBag }) {
  const [selectedSize, setSelectedSize] = useState('30');
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  if (!isOpen || !product) return null;

  const images = [product.image, product.altImage].filter(Boolean);

  const handleAdd = () => {
    setAdded(true);
    onAddToBag?.({ ...product, size: selectedSize });
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-[#0e1013] border border-white/20 text-ivory shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/60 rounded-full hover:bg-white hover:text-black transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Product Image & View switcher */}
          <div className="md:w-1/2 bg-charcoal relative flex flex-col justify-between">
            <div className="relative aspect-[3/4] md:h-full w-full overflow-hidden">
              <img
                src={images[activeImg] || product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center filter brightness-95"
              />
              <div className="absolute top-4 left-4 z-10">
                <span className="font-mono text-[9px] tracking-[0.25em] uppercase px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/20 text-white">
                  {product.badge}
                </span>
              </div>
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-4 left-4 flex space-x-2 z-10">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-10 h-10 border overflow-hidden ${
                      activeImg === i ? 'border-white ring-1 ring-white' : 'border-white/30 opacity-60'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Specifications & Size Selection */}
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest uppercase text-denim-300 mb-2">
                <span>{product.origin}</span>
                <span>•</span>
                <span>{product.wash}</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-white mb-2">
                {product.name}
              </h2>

              <p className="font-mono text-xl tracking-widest text-white mb-4">
                {product.priceFormatted}
              </p>

              <p className="font-sans text-xs text-white/70 font-light leading-relaxed mb-6">
                {product.details}
              </p>

              {/* Specifications pills */}
              <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-charcoal/60 border border-white/10 text-xs font-mono">
                <div>
                  <span className="text-white/40 block text-[9px] uppercase">FABRIC</span>
                  <span className="text-white">{product.fabric}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[9px] uppercase">COLORWAY</span>
                  <span className="text-white">{product.color}</span>
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="uppercase text-white/70">SELECT WAIST (INCHES)</span>
                  <span className="text-denim-300 flex items-center space-x-1 cursor-pointer hover:underline text-[11px]">
                    <Ruler className="w-3 h-3" />
                    <span>FIT GUIDE</span>
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 text-xs font-mono tracking-wider transition-all duration-200 border ${
                        selectedSize === size
                          ? 'bg-white text-charcoal-dark border-white font-bold'
                          : 'bg-black/30 text-white/80 border-white/20 hover:border-white/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
              <button
                onClick={handleAdd}
                disabled={added}
                className={`w-full py-4 font-sans text-xs font-semibold tracking-[0.25em] uppercase flex items-center justify-center space-x-2 transition-all duration-300 ${
                  added
                    ? 'bg-denim-600 text-white'
                    : 'bg-white text-charcoal-dark hover:bg-ivory hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ADDED TO BAG (WAIST {selectedSize})</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-denim-600" />
                    <span>ADD TO SHOPPING BAG</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-white/50 tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-denim-400" />
                <span>COMPLIMENTARY SHIPPING & 30-DAY BESPOKE EXCHANGES</span>
              </div>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
