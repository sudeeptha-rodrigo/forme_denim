# FORME DENIM — Luxury Fashion Editorial Web App

A modern, high-end homepage prototype for **FORME DENIM**, an architectural denim atelier inspired by luxury editorial fashion labels (Zara Studio, Apple minimalism, contemporary streetwear).

---

## 🌟 Highlights & Features

- **Cinematic Hero**:
  - Full-screen high-fashion denim photography
  - Editorial typography (`Cinzel` display serif + `Italiana` italic + `Inter`)
  - Headline: *"DENIM. REDEFINED."*
  - Supporting text: *"Everyday essentials. Extraordinary attitude."*
  - Interactive campaign perspective switcher (`01` / `02`) & minimalist scroll indicator
- **Navigation Bar**:
  - Transparent over hero image, transitions smoothly on scroll with backdrop-blur
  - Brand logo with atelier moniker
  - Interactive Search modal with trending denim keyword filters
  - Interactive Shopping Bag slide-out drawer with LKR price calculation & item count badge
  - Full mobile navigation drawer with smooth animations
- **Shop By Collection**:
  - Modern asymmetrical editorial grid showcasing:
    - `01 — Wide Leg` (13.5oz Organic Cotton, dramatic full length)
    - `02 — Straight Fit` (14.5oz Kuroki Mill Selvedge)
    - `03 — Relaxed Fit` (Contemporary slouch & lived-in drape)
  - Refined hover image zoom & specification pills
- **Featured Denim Product Showcase**:
  - 4 signature denim silhouettes priced in **LKR (Sri Lankan Rupees)**:
    - *The 01 Selvedge Straight* — LKR 24,500
    - *The 02 Palazzo Wide-Leg* — LKR 22,000
    - *The 03 Studio Relaxed* — LKR 19,800
    - *The 04 Noir Atelier* — LKR 21,500
  - Hover micro-interactions with **Quick View** modal (size selector `28`–`36`, fabric specs, fit guide) and **Add to Bag** interaction
- **Material Intelligence & Denim Anatomy**:
  - Interactive macro inspection comparing redline shuttle loom selvedge, hand-hammered brass hardware, and heavy-gauge tobacco seams
- **Brand Statement & Manifesto**:
  - Bold typographic statement: *"NOT JUST DENIM. A WAY OF LIFE."*
  - Editorial campaign portrait paired with craftsmanship principles and environmental stewardship metrics (-84% water, 100% organic cotton)
- **Atelier Footer**:
  - Luxury newsletter signup visual ("FORME PRIVÉ DISPATCH") with instant confirmation
  - Editorial sitemap, currency indicator, and copyright

---

## 🚀 How to Run Locally

The development server is currently live at:
**[http://localhost:3000/](http://localhost:3000/)**

To run or rebuild manually:

```bash
# 1. Navigate to the project directory
cd C:\Users\Sudeeptha\.gemini\antigravity\scratch\forme-denim

# 2. Start the development server
npm run dev

# 3. Open in your browser:
# http://localhost:3000/
```

To build for production:
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
forme-denim/
├── public/
│   ├── favicon.svg
│   └── images/                     # Curated local high-res denim fashion photography
│       ├── brand-editorial.jpg
│       ├── collection-relaxed-fit.jpg
│       ├── collection-straight-fit.jpg
│       ├── collection-wide-leg.jpg
│       ├── craft-details.jpg
│       ├── fabric-texture.jpg
│       ├── hero-campaign.jpg
│       ├── hero-campaign-alt.jpg
│       ├── product-1.jpg
│       ├── product-2.jpg
│       ├── product-3.jpg
│       └── product-4.jpg
├── src/
│   ├── components/
│   │   ├── BagDrawer.jsx           # Slide-out bag drawer
│   │   ├── BrandStatement.jsx     # Section 5: "NOT JUST DENIM. A WAY OF LIFE."
│   │   ├── DenimAnatomy.jsx       # Interactive macro fabric & hardware viewer
│   │   ├── FeaturedDenim.jsx      # Section 4: 4 Products in LKR with quick-action hover
│   │   ├── Footer.jsx             # Section 6: Luxury footer & newsletter
│   │   ├── Hero.jsx               # Section 2: Cinematic Hero with campaign switcher
│   │   ├── Navbar.jsx             # Section 1: Transparent-to-blur navigation bar
│   │   ├── QuickViewModal.jsx     # Product zoom & size selector modal
│   │   ├── SearchModal.jsx        # Archive search modal with live query filter
│   │   └── ShopByCollection.jsx   # Section 3: Asymmetrical 3-fit showcase
│   ├── data/
│   │   └── denimData.js           # Curated denim product specs, fits, and story
│   ├── App.jsx                    # Application root & interactive state
│   ├── index.css                  # Tailored typography, custom scrollbar & film grain
│   └── main.jsx
├── index.html                     # Google Fonts (Cinzel, Italiana, Inter)
├── package.json
├── tailwind.config.js             # Luxury denim color palette & typography
└── vite.config.js
```
