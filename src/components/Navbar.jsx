import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onOpenSearch, onOpenBag, bagCount = 0 }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Collections', href: '#collections' },
    { name: 'Featured', href: '#featured' },
    { name: 'Craft & Manifesto', href: '#manifesto' },
    { name: 'About', href: '#about' },
  ];

  const scrollToSection = (e, href, name) => {
    e.preventDefault();
    setActiveLink(name);
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${
          scrolled
            ? 'bg-[#0c0d0f]/90 backdrop-blur-md py-4 border-b border-white/10 shadow-2xl'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          
          {/* Brand Logo - Editorial Luxury Serif */}
          <a
            href="#hero"
            onClick={(e) => scrollToSection(e, '#hero', 'Home')}
            className="group flex flex-col items-start cursor-pointer select-none"
          >
            <span className="font-display tracking-[0.28em] text-xl sm:text-2xl font-bold uppercase text-ivory group-hover:text-denim-300 transition-colors duration-300">
              FORME
            </span>
            <span className="font-mono text-[9px] tracking-[0.45em] text-white/50 -mt-1 uppercase group-hover:text-white/80 transition-colors">
              DENIM ATELIER
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href, link.name)}
                className="relative py-1 text-xs tracking-[0.2em] uppercase font-medium text-white/80 hover:text-white transition-colors duration-200 group"
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 w-full h-[1px] bg-ivory origin-left transition-transform duration-300 ${
                    activeLink === link.name ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            ))}
          </nav>

          {/* Action Icons Right */}
          <div className="flex items-center space-x-5 sm:space-x-6">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-white/80 hover:text-white transition-colors duration-200 relative group"
              aria-label="Open Search"
            >
              <Search className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 stroke-[1.5]" />
              <span className="sr-only">Search</span>
            </button>

            {/* Shopping Bag Trigger */}
            <button
              onClick={onOpenBag}
              className="p-2 text-white/80 hover:text-white transition-colors duration-200 relative group flex items-center"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 stroke-[1.5]" />
              {bagCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-charcoal-dark font-mono text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {bagCount}
                </span>
              )}
              <span className="sr-only">Shopping Bag</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/90 hover:text-white focus:outline-none"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#0c0d0f]/98 backdrop-blur-xl md:hidden pt-28 px-8 flex flex-col justify-between pb-12"
          >
            <div className="flex flex-col space-y-7">
              <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/40">
                NAVIGATION
              </span>
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href, link.name)}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="text-2xl font-display uppercase tracking-widest text-ivory hover:text-denim-300 flex items-center justify-between border-b border-white/10 pb-4"
                >
                  <span>{link.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-white/40" />
                </motion.a>
              ))}
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-col space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-white/50 tracking-wider">
                <span>CURRENCY: LKR (RS)</span>
                <span>GLOBAL ATELIER</span>
              </div>
              <p className="text-xs text-white/40 tracking-wide font-sans">
                FORME DENIM © 2026. Everyday essentials. Extraordinary attitude.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
