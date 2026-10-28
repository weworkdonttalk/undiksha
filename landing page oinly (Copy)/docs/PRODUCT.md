# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

HTML5, Tailwind CSS (via CDN with extended configuration), custom CSS (style.css), Vanilla JavaScript (main.js).

## Users

Masyarakat umum, pemerhati budaya, wisatawan, kolektor seni, dan pembeli karya lokal Indonesia yang ingin mengenal kekayaan warisan Nusantara sekaligus mendukung UMKM pengrajin daerah secara langsung.

## Product Purpose

Platform digital kurasi dan apresiasi budaya Indonesia bertajuk "Nusava" dengan payung pelestarian "Nusantara: Merawat Budaya, Menggerakkan Karya". Nusava mendigitalisasi UMKM pengrajin lokal Indonesia, memperkenalkan keanekaragaman cagar budaya dari Sabang sampai Merauke, dan memberdayakan karya anak bangsa agar berdaya saing global. Inisiatif ini dikembangkan oleh siswa SMKN 1 Denpasar bekerja sama dengan komunitas pengrajin daerah.

## Positioning

Menghubungkan edukasi budaya interaktif (peta warisan kepulauan, ensiklopedia seni, dan kisah pengrajin) dengan etalase pasar karya lokal otentik bersertifikat pengrajin daerah dalam satu antarmuka visual yang berakar kuat pada tradisi Nusantara.

## Operating Context

Pengunjung mengakses melalui browser desktop, tablet, dan smartphone. Kebutuhan utama adalah pengalaman visual yang memikat, eksplorasi peta yang responsif dan lancar, penjelajahan katalog karya lokal dengan filter instan, serta kenyamanan membaca jurnal budaya.

## Capabilities and Constraints

- **Refactoring Eksisting**: Menghilangkan seluruh absolute positioning statis bawaan Figma (tinggi kanvas 8233px), diganti dengan sistem responsif Flexbox & Grid modern.
- **Section Asli yang Ditingkatkan**: Sticky Navbar dengan backdrop blur, Hero wayang emas & Mega Mendung, Banner Arch Borobudur, Galeri foto budaya miring (tilted cards) & transisi Arch Tari Kecak, Mari Kenali Nusava & Tentang Nusava (kolase foto sirkular), dan 4 Feature Cards Produk Nusava.
- **Fitur Baru Lengkap**:
  - Peta Interaktif Budaya Nusantara (visualisasi kepulauan & pin interaktif dengan dynamic pop-up info kartu budaya).
  - Marketplace Karya & Kriya Lokal ("Pasar Nusava") dengan filter tab kategori, harga IDR, rating, dan interaksi beli/dukung pengrajin.
  - Slider/Carousel Artikel & Kisah Budaya ("Jurnal Nusava") dengan prev/next navigasi dan dot pagination.
  - Bar Navigasi 8 Kategori Warisan Budaya Indonesia (menggantikan bar placeholder HealTech/BioSync).
  - Footer komprehensif bertema dark charcoal `#3E3630` dengan aksen ornamen Nusantara, newsletter budaya, dan media sosial.

## Brand Commitments

- **Identitas**: NUSAVA — Merawat Budaya, Menggerakkan Karya.
- **Palet Warna**:
  - Background Utama: Krem/Ivory Tradisional (`#FCF0DA`, `#FBF3E4`)
  - Aksen Emas & Kuning Kunyit: (`#F1C469`, `#E5A93C`, `#D99B26`)
  - Aksen Zaitun & Sage: (`#AEAC79`)
  - Kontras Gelap & Tipografi Utama: Cokelat Tua / Charcoal (`#3E3630`, `#4D4542`)
  - Kartu & Wadah Konten: Warm Cream (`#FFFDF9`, `#FFF8EE`)
- **Tipografi**:
  - Headings/Display: `Playfair Display` (serif megah tradisional-modern).
  - Body/UI: `Plus Jakarta Sans` (sans-serif bersih, ramah, dan sangat terbaca).
- **Aset Visual Otentik**: Wayang kulit berhias emas, ornamen awan Mega Mendung Jawa, foto Candi Borobudur, Tari Kecak, gamelan, kriya, dan ukiran tradisional.

## Product Principles

1. **Akar Tradisi yang Hidup**: Menghormati estetika visual warisan Nusantara tanpa mengorbankan standar UX web modern.
2. **Keterbacaan & Aksesibilitas Tinggi**: Kontras teks terjaga ketat (≥4.5:1), hierarki tipografi tegas, bebas positioning statis yang mudah pecah.
3. **Interaktivitas Berbobot**: Setiap animasi dan interaksi (hover kartu, pin peta, filter marketplace, slider artikel) memiliki tujuan eksplorasi yang intuitif.
4. **Memberdayakan Pengrajin Asli**: Menonjolkan asal daerah dan identitas pengrajin di setiap karya yang ditampilkan.
