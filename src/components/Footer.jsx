import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer id="about" className="bg-[#070809] text-ivory relative border-t border-white/10 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Top Newsletter & Brand Editorial Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Philosophy Left */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex flex-col items-start mb-6">
                <span className="font-display tracking-[0.28em] text-3xl font-bold uppercase text-white">
                  FORME
                </span>
                <span className="font-mono text-[10px] tracking-[0.45em] text-white/50 uppercase mt-0.5">
                  DENIM ATELIER
                </span>
              </div>
              <p className="font-sans text-sm text-white/60 font-light max-w-sm leading-relaxed mb-6">
                Redefining the standard of contemporary denim through authentic heritage shuttle looms, architectural silhouettes, and conscious slow craft.
              </p>
            </div>

            <div className="text-xs font-mono text-white/40 tracking-wider">
              <span>DESIGNED IN TOKYO & PARIS</span>
              <span className="mx-2">•</span>
              <span>EST. 2026</span>
            </div>
          </div>

          {/* Newsletter Signup Visual Right */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-charcoal/60 border border-white/10 p-8 sm:p-10 backdrop-blur-md">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-denim-300 block mb-2">
                FORME PRIVÉ DISPATCH
              </span>
              <h3 className="font-display text-xl sm:text-2xl uppercase tracking-wider text-white mb-2">
                JOIN THE PRIVATE REGISTER
              </h3>
              <p className="font-sans text-xs text-white/60 font-light mb-6 max-w-md">
                Receive private notices for small-batch shuttle loom allocations, archive releases, and editorial essays.
              </p>

              {subscribed ? (
                <div className="flex items-center space-x-2 text-denim-300 text-xs font-mono tracking-wider py-3 px-4 bg-denim-950/60 border border-denim-500/30">
                  <Check className="w-4 h-4 text-denim-300" />
                  <span>YOU ARE ADDED TO THE PRIVÉ REGISTER. WELCOME.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL FOR ARCHIVE ACCESS"
                    required
                    className="flex-1 bg-black/50 border border-white/20 px-4 py-3.5 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-white text-charcoal-dark font-sans text-xs font-semibold tracking-[0.25em] uppercase hover:bg-ivory transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>JOIN</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Navigation Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-14 border-b border-white/10 text-xs">
          
          {/* Col 1 */}
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40 mb-4">
              COLLECTIONS
            </h4>
            <ul className="space-y-3 font-sans font-light text-white/70">
              <li><a href="#collections" className="hover:text-white transition-colors">Wide Leg Denim</a></li>
              <li><a href="#collections" className="hover:text-white transition-colors">Architectural Straight</a></li>
              <li><a href="#collections" className="hover:text-white transition-colors">Relaxed Slouch</a></li>
              <li><a href="#featured" className="hover:text-white transition-colors">Raw Japanese Selvedge</a></li>
              <li><a href="#featured" className="hover:text-white transition-colors">Archive Editions</a></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40 mb-4">
              ATELIER CRAFT
            </h4>
            <ul className="space-y-3 font-sans font-light text-white/70">
              <li><a href="#manifesto" className="hover:text-white transition-colors">Kojima Shuttle Looms</a></li>
              <li><a href="#manifesto" className="hover:text-white transition-colors">Zero-Water Ozone Finishing</a></li>
              <li><a href="#manifesto" className="hover:text-white transition-colors">Raw Indigo Care Guide</a></li>
              <li><a href="#manifesto" className="hover:text-white transition-colors">Lifetime Repair Guarantee</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40 mb-4">
              CLIENT SERVICES
            </h4>
            <ul className="space-y-3 font-sans font-light text-white/70">
              <li><a href="#hero" className="hover:text-white transition-colors">Bespoke Size Consultation</a></li>
              <li><a href="#hero" className="hover:text-white transition-colors">Global Priority Courier</a></li>
              <li><a href="#hero" className="hover:text-white transition-colors">Complimentary Alterations</a></li>
              <li><a href="#hero" className="hover:text-white transition-colors">Store Locator & Stockists</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40 mb-4">
              SOCIAL & DISPATCH
            </h4>
            <ul className="space-y-3 font-sans font-light text-white/70">
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center space-x-2"><span>Instagram</span></a></li>
              <li><a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center space-x-2"><span>TikTok</span></a></li>
              <li><a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center space-x-2"><span>Pinterest Moodboard</span></a></li>
              <li><a href="https://spotify.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center space-x-2"><span>Atelier Soundscape</span></a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Currency, Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] font-mono text-white/40 space-y-4 md:space-y-0">
          <div>
            © 2026 FORME DENIM. ALL RIGHTS RESERVED. INITIAL PROTOTYPE.
          </div>

          <div className="flex items-center space-x-6">
            <span>CURRENCY: LKR (RS)</span>
            <span>•</span>
            <a href="#hero" className="hover:text-white transition-colors">PRIVACY POLICY</a>
            <span>•</span>
            <a href="#hero" className="hover:text-white transition-colors">TERMS OF SERVICE</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
