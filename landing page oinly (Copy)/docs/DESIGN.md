# Design Tokens & System: Nusava (Nusantara)

<!-- impeccable:design-tokens 1 -->

## Visual World

Tradisi Nusantara Kontemporer: Memadukan keanggunan seni klasik Indonesia (ornamen Mega Mendung, wayang kulit emas, siluet candi, ukiran kriya) dengan keterbacaan, kebersihan, dan fluiditas antarmuka web modern.

## Mode

Persuade & Experience (Membangkitkan rasa kagum terhadap warisan budaya nusantara sekaligus mendorong aksi apresiasi dan pembelian karya lokal UMKM).

## Color Tokens

```css
:root {
  /* Surfaces & Backgrounds */
  --bg-primary: #FBF3E4;       /* Warm Ivory / Krem Utama */
  --bg-primary-soft: #FCF0DA;  /* Krem Original Figma */
  --bg-surface-card: #FFFDF9;  /* Kartu & Modal Konten */
  --bg-surface-soft: #FFF8EE;  /* Input & Pill Bar */
  --bg-dark: #3E3630;          /* Charcoal / Cokelat Tua Kontras */
  --bg-dark-muted: #4D4542;    /* Dark Charcoal Asli Figma */

  /* Brand Accents */
  --accent-gold: #F1C469;      /* Emas Kunyit Cerah */
  --accent-gold-rich: #E5A93C; /* Amber Tradisional */
  --accent-gold-deep: #D99B26; /* Emas Keraton */
  --accent-olive: #AEAC79;     /* Zaitun / Sage Asli */

  /* Typography Colors */
  --text-primary: #3E3630;     /* Kontras tinggi untuk body text (≥7:1) */
  --text-muted: #6B6158;       /* Sekunder (≥4.5:1) */
  --text-light: #FCF0DA;       /* Teks di atas latar gelap */
  --text-gold: #D99B26;        /* Teks aksen emas terbaca */

  /* Borders & Dividers */
  --border-light: #EBDDC6;
  --border-gold: rgba(241, 196, 105, 0.4);
  --border-dark: rgba(255, 255, 255, 0.12);
}
```

## Typography

- **Display / Headings**: `'Playfair Display', Georgia, serif`
  - Hero Display: `font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight`
  - Section Title: `font-bold text-3xl sm:text-4xl text-[#3E3630]`
  - Subsection: `font-semibold text-xl sm:text-2xl`
- **Body & Controls**: `'Plus Jakarta Sans', system-ui, sans-serif`
  - Body Text: `font-normal text-base leading-relaxed text-[#3E3630] max-w-[70ch]`
  - Small / Badges: `font-medium text-xs sm:text-sm tracking-wide`
  - Nav / Buttons: `font-semibold text-sm sm:text-base`

## Elevation & Shadows

- `shadow-subtle`: `0 2px 8px -2px rgba(62, 54, 48, 0.08)`
- `shadow-card`: `0 10px 25px -5px rgba(62, 54, 48, 0.1), 0 8px 10px -6px rgba(62, 54, 48, 0.04)`
- `shadow-hover`: `0 20px 35px -10px rgba(217, 155, 38, 0.25)`
- `shadow-dark-card`: `0 12px 30px -8px rgba(0, 0, 0, 0.35)`

## Spacing & Rhythm

- Container max width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Section vertical padding: `py-16 sm:py-24 lg:py-28`
- Grid gaps: `gap-6 sm:gap-8`

## Motion & Transitions

- Transisi dasar: `transition-all duration-300 ease-out`
- Hover angkat kartu: `transform -translate-y-1.5 shadow-hover`
- Arch & Image mask: kurva setengah lingkaran yang responsif
