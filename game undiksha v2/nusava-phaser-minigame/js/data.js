/* ============================================================
   NUSAVA — PUSAKA ADVENTURE  |  data.js
   Database artefak, tile config, & world map
   TECHTOPIA Vol. 2 · INTEGER#8 · Undiksha
   ============================================================ */

'use strict';

/* ── 1. Asset Manifest ──────────────────────────────────────
   Aset grafis utama (Platform & blok candi digambar secara prosedural kanvas tanpa blox_asset)
   ─────────────────────────────────────────────────────────── */
const ASSET_PATHS = {
  mascoot:   'assets/mascoot-removebg-preview.png',
  textbox:   'assets/textbox-removebg-preview.png',
  keris:     'assets/keris-removebg-preview.png',
  guci:      'assets/guci-removebg-preview.png',
  kendang:   'assets/kendang-removebg-preview.png',
  angklung:  'assets/angklung-removebg-preview.png',
  kebaya:    'assets/kebaya-removebg-preview.png',
  kain_batik:'assets/kain_batik-removebg-preview.png',
  asbak:     'assets/asbak_bali-removebg-preview.png',
};

/* ── 2. Sprite Sheet Layout (mascoot-removebg-preview.png 669×373)
   Exact non-transparent bounding boxes for each character pose:
   Top row (baseline y=162):
     idle: 3 frames (cols 0-2)
     walk: 4 frames (cols 3-6)
   Bottom row (baseline y=350):
     jump: 2 frames (cols 0-1)
     fall: 1 frame  (col 2)
     interact: 3 frames (cols 4-6)
   ─────────────────────────────────────────────────────────── */
const SPRITE_FRAMES = {
  idle: [
    { sx: 30,  sy: 22, sw: 49, sh: 140 },
    { sx: 96,  sy: 42, sw: 50, sh: 120 },
    { sx: 163, sy: 42, sw: 51, sh: 120 },
  ],
  walk: [
    { sx: 309, sy: 22, sw: 76, sh: 140 },
    { sx: 396, sy: 46, sw: 74, sh: 116 },
    { sx: 485, sy: 47, sw: 66, sh: 115 },
    { sx: 566, sy: 48, sw: 70, sh: 114 },
  ],
  jump: [
    { sx: 30,  sy: 198, sw: 63, sh: 152 },
    { sx: 94,  sy: 198, sw: 68, sh: 142 },
  ],
  fall: [
    { sx: 167, sy: 192, sw: 55, sh: 127 },
  ],
  interact: [
    { sx: 387, sy: 198, sw: 93, sh: 152 },
    { sx: 481, sy: 198, sw: 71, sh: 152 },
    { sx: 569, sy: 243, sw: 74, sh: 107 },
  ],
};

const SPRITE = {
  sheetW: 669,
  sheetH: 373,
  // Animation speed in ticks (at 60fps unit)
  idle:     { frames: 3, fps: 11 },
  walk:     { frames: 4, fps: 7  },
  jump:     { frames: 2, fps: 10 },
  fall:     { frames: 1, fps: 10 },
  interact: { frames: 3, fps: 9  },
};

/* ── 3. Artifact Database ───────────────────────────────────── */
const ARTIFACTS = [
  {
    id:          'keris',
    assetKey:    'keris',
    name:        'Keris Pamor Luk-9',
    category:    'Warisan Pusaka Senjata',
    origin:      'Kerajaan Majapahit, Jawa',
    accentColor: '#9b72cf',
    worldX:      420,
    worldY:      262,
    // Dialog lines shown in the textbox (split for readability in-game)
    dialog: [
      'Keris Luk-9 — pusaka tertinggi dalam tradisi perkerisan Jawa.',
      'Bilah berkeluk SEMBILAN mencerminkan Wali Sanga. Pamor-nya',
      'dihasilkan dari pelipatan baja meteorit ribuan kali oleh sang empu.',
      'UNESCO mengakui keris sebagai Warisan Budaya Takbenda (2005).',
    ],
    description:
      'Keris berpamor Luk-9 adalah pusaka tertinggi dalam tradisi perkerisan Jawa. ' +
      'Bilah yang berkeluk sembilan kali melambangkan Wali Sanga — sembilan wali ' +
      'penyebar Islam di Nusantara. Pamor dihasilkan dari pelipatan baja meteorit ' +
      'dan besi bumi ribuan kali, mencerminkan kesabaran sang empu.',
    lore:
      'UNESCO mengakui keris sebagai Warisan Budaya Takbenda pada 2005. ' +
      'Di keraton, keris dirawat layaknya leluhur — diberi kembang tujuh rupa setiap Jumat Kliwon.',
    quiz: {
      question: 'Berapa jumlah lekukan bilah pada Keris Luk-9?',
      options: ['9 lekukan — melambangkan Wali Sanga', '7 lekukan', '5 lekukan', '11 lekukan'],
      correct: 0,
      xp: 75,
    },
    discovered: false,
  },
  {
    id:          'guci',
    assetKey:    'guci',
    name:        'Guci Gerabah Majapahit',
    category:    'Kriya Gerabah & UMKM Lokal',
    origin:      'Plered, Purwakarta / Bayat, Klaten',
    accentColor: '#C2593F',
    worldX:      780,
    worldY:      262,
    dialog: [
      'Guci terakota motif spiral — produk kriya UMKM unggulan Indonesia.',
      'Dibuat dari tanah liat pilihan, dipilin tangan, dibakar 8–12 jam.',
      'Motif spiral mencerminkan siklus kehidupan tanpa akhir dalam',
      'kosmologi Nusantara kuno — dari tanah kembali ke tanah.',
    ],
    description:
      'Guci terakota motif spiral merupakan produk kriya unggulan sentra gerabah lokal. ' +
      'Dibuat dari tanah liat pilihan yang dipilin tangan atau roda putar, lalu dibakar ' +
      'dalam tungku tradisional 8–12 jam. Motif spiral mencerminkan siklus kehidupan tanpa akhir.',
    lore:
      'Gerabah Bayat diwariskan sejak era Mataram Islam. Para pengrajin UMKM kini ' +
      'mengekspor karya ke lebih dari 30 negara, membuktikan estetika lokal mampu bersaing global.',
    quiz: {
      question: 'Motif spiral pada guci Nusantara melambangkan...',
      options: [
        'Siklus kehidupan tanpa akhir',
        'Jalur perdagangan laut',
        'Peta bintang astronomi kuno',
        'Aliran Sungai Bengawan Solo',
      ],
      correct: 0,
      xp: 60,
    },
    discovered: false,
  },
  {
    id:          'kendang',
    assetKey:    'kendang',
    name:        'Kendang Batangan Sunda',
    category:    'Warisan Budaya Takbenda',
    origin:      'Jawa Barat (Sunda)',
    accentColor: '#D4AF37',
    worldX:      1150,
    worldY:      262,
    dialog: [
      'Kendang Batangan — drum tradisional Sunda dari kayu nangka.',
      'Kulit binatang direntangkan di kedua sisi menghasilkan dentam dalam.',
      'Dalam gamelan Sunda, kendang adalah "jantung irama" — pemimpin',
      'tempo dan dinamika seluruh ansambel. Penabuh ulung = pang-ibing.',
    ],
    description:
      'Kendang Batangan adalah drum tradisional Sunda dari kayu nangka atau mahoni tua. ' +
      'Kulit binatang di kedua sisi menghasilkan suara berdentam dalam yang khas. ' +
      'Dalam gamelan Sunda, kendang adalah jantung irama — pemimpin tempo ansambel.',
    lore:
      'Para pengrajin di Bandung mempertahankan teknik pemasangan kulit secara tradisional ' +
      'tanpa paku — hanya tali rotan dan pengetahuan turun-temurun tentang tegangan kulit.',
    quiz: {
      question: 'Dalam gamelan Sunda, kendang disebut sebagai...',
      options: [
        '"Jantung irama" — pemimpin tempo',
        'Instrumen melodi utama',
        'Pengiring vokal sinden',
        'Penanda pembuka upacara',
      ],
      correct: 0,
      xp: 60,
    },
    discovered: false,
  },
  {
    id:          'angklung',
    assetKey:    'angklung',
    name:        'Angklung Bambu UNESCO',
    category:    'Warisan Budaya Takbenda Dunia',
    origin:      'Jawa Barat (Sunda)',
    accentColor: '#7C8A69',
    worldX:      1520,
    worldY:      262,
    dialog: [
      'Angklung — instrumen multitonal dari tabung bambu pilihan Sunda.',
      'Setiap angklung hanya menghasilkan SATU nada saat digoyangkan.',
      'Memerlukan kerja sama berkelompok → nilai luhur gotong royong.',
      'UNESCO mengakui Angklung sebagai Warisan Budaya Takbenda (2010).',
    ],
    description:
      'Angklung adalah instrumen musik multitonal dari tabung bambu yang dipotong rapi ' +
      'untuk menghasilkan resonansi nada saat digoyangkan. Setiap angklung hanya menghasilkan ' +
      'satu nada, sehingga memerlukan kerja sama berkelompok untuk memainkan melodi utuh.',
    lore:
      'Saung Angklung Udjo di Bandung adalah pusat pelestarian angklung terbesar di dunia, ' +
      'menerima ribuan wisatawan setiap bulan untuk belajar bermain angklung bersama.',
    quiz: {
      question: 'Mengapa angklung memerlukan banyak orang untuk dimainkan?',
      options: [
        'Karena setiap angklung hanya menghasilkan satu nada',
        'Karena angklung sangat berat dan besar',
        'Karena tradisi larangan memainkannya sendiri',
        'Karena memerlukan dua tangan untuk setiap nada',
      ],
      correct: 0,
      xp: 75,
    },
    discovered: false,
  },
  {
    id:          'kebaya',
    assetKey:    'kebaya',
    name:        'Kebaya Bali Agung',
    category:    'Warisan Seni & Busana Adat',
    origin:      'Bali & Jawa Tengah',
    accentColor: '#8B1D3B',
    worldX:      1960,
    worldY:      262,
    dialog: [
      'Kebaya Bali Agung — busana adat resmi perempuan Bali.',
      'Berwarna merah marun dengan bordir emas (prada) yang rumit.',
      'Dipadukan kain batik atau tenun gringsing sebagai rok.',
      'UNESCO menetapkan Kebaya sebagai Warisan Budaya Takbenda (2023).',
    ],
    description:
      'Kebaya Bali Agung adalah busana adat resmi perempuan Bali, biasanya merah marun ' +
      'dengan bordir emas (prada) pada kerah dan lengan. Dipadukan kain batik atau tenun ' +
      'gringsing yang mencerminkan hubungan spiritual dengan alam semesta.',
    lore:
      'Dalam upacara Piodalan di pura, seluruh perempuan wajib mengenakan kebaya — ' +
      'bukan sekadar busana, melainkan identitas spiritual. UNESCO akui 2023.',
    quiz: {
      question: 'Bordir emas pada tepi kebaya Bali disebut...',
      options: ['Prada', 'Songket', 'Jumputan', 'Lurik'],
      correct: 0,
      xp: 60,
    },
    discovered: false,
  },
  {
    id:          'asbak',
    assetKey:    'asbak',
    name:        'Asbak Ukir Paras Bali',
    category:    'Ekonomi Kreatif & Kriya UMKM',
    origin:      'Batubulan, Gianyar, Bali',
    accentColor: '#6B8F71',
    worldX:      2400,
    worldY:      262,
    dialog: [
      'Asbak Ukir Paras — karya seni kriya pemahat lokal Bali.',
      'Terbuat dari batu paras alami atau kayu sonokeling.',
      'Dihiasi relief wajah Kala atau dedaunan Patra Punggel.',
      'Menggambarkan ketekunan UMKM dalam menyulap perkakas jadi seni.',
    ],
    description:
      'Karya seni kriya pemahat lokal Bali yang memanfaatkan batu paras alami atau kayu sonokeling. ' +
      'Dihiasi ornamen relief wajah Kala atau dedaunan Patra Punggel. Menggambarkan ketekunan ' +
      'kriya tangan UMKM dalam menyulap perkakas sehari-hari menjadi komoditas bernilai tinggi.',
    lore:
      'Desa Batubulan, Gianyar merupakan sentra seni pahat batu paras terbesar di Bali. ' +
      'Produk UMKM dari desa ini diekspor ke Eropa, Amerika, dan Australia.',
    quiz: {
      question: 'Sentra seni pahat batu paras terbesar di Bali terdapat di...',
      options: [
        'Desa Batubulan, Gianyar',
        'Kuta Selatan',
        'Nusa Penida',
        'Ubud Kaja',
      ],
      correct: 0,
      xp: 60,
    },
    discovered: false,
  },
  {
    id:          'kain_batik',
    assetKey:    'kain_batik',
    name:        'Kain Batik Mega Mendung',
    category:    'Warisan Seni & Tekstil Luhur',
    origin:      'Cirebon, Jawa Barat',
    accentColor: '#1A4D8F',
    worldX:      2750,
    worldY:      262,
    dialog: [
      'Batik Mega Mendung — motif awan berlapis khas pesisir Cirebon.',
      'Terinspirasi dari langit dramatik pantai utara Jawa abad ke-15.',
      'Perpaduan Islam, Hindu-Buddha & pengaruh Tiongkok yang harmonis.',
      'UNESCO akui Batik Indonesia sebagai Warisan Budaya Takbenda (2009).',
    ],
    description:
      'Batik Mega Mendung berasal dari Cirebon, terinspirasi langit berawan di pesisir utara Jawa. ' +
      'Motif awan berlapis dipengaruhi budaya Tiongkok via pelabuhan Cirebon abad ke-15. ' +
      'Perpaduan Islam, Hindu-Buddha, dan Tiongkok menjadikannya unik di antara semua motif batik.',
    lore:
      'Batik tulis Mega Mendung sejati memerlukan berminggu-minggu pembuatan. ' +
      'Gradasi 5–9 tingkat warnanya dihasilkan dari pencelupan berulang dalam pewarna alami. ' +
      'UNESCO akui Batik Indonesia pada 2009.',
    quiz: {
      question: 'Batik Mega Mendung dari Cirebon merupakan perpaduan budaya...',
      options: [
        'Islam, Hindu-Buddha, dan Tiongkok',
        'Arab, India, dan Eropa',
        'Jawa, Sunda, dan Bali',
        'Melayu, Bugis, dan Makassar',
      ],
      correct: 0,
      xp: 75,
    },
    discovered: false,
  },
];

/* ── 5. World Config ────────────────────────────────────────── */
const WORLD_CONFIG = {
  width:      3200,
  gravity:    0.45,
  playerSpeed: 3.6,
  jumpForce:  -9.5,
};

/* ── 6. Modular Platform Definitions (Super Mario Style 24px blocks) ── */
const PLATFORMS = [
  // ── Main Ground (2 blocks thick: 24px surface + 24px underfill)
  { x: 0,    y: 312, w: 3200, h: 48, type: 'ground' },

  // ── Zone 1: Keris (Grey Stone staircase blocks)
  { x: 280,  y: 252, w: 96,  h: 24, type: 'stone' },
  { x: 384,  y: 204, w: 96,  h: 24, type: 'stone' },
  { x: 488,  y: 156, w: 96,  h: 24, type: 'stone' },

  // ── Zone 2: Guci (Stone temple platforms)
  { x: 680,  y: 252, w: 96,  h: 24, type: 'stone' },
  { x: 784,  y: 204, w: 96,  h: 24, type: 'stone' },
  { x: 888,  y: 156, w: 96,  h: 24, type: 'stone' },

  // ── Zone 3: Kendang (Terracotta Brick blocks)
  { x: 1020, y: 252, w: 96,  h: 24, type: 'brick' },
  { x: 1124, y: 204, w: 96,  h: 24, type: 'brick' },
  { x: 1228, y: 156, w: 96,  h: 24, type: 'brick' },

  // ── Zone 4: Angklung (Bamboo / Brick blocks)
  { x: 1380, y: 252, w: 96,  h: 24, type: 'brick' },
  { x: 1484, y: 204, w: 96,  h: 24, type: 'brick' },
  { x: 1588, y: 156, w: 96,  h: 24, type: 'brick' },

  // ── Zone 5: Kebaya (Royal Stone tier blocks)
  { x: 1740, y: 252, w: 96,  h: 24, type: 'stone' },
  { x: 1844, y: 204, w: 96,  h: 24, type: 'stone' },
  { x: 1948, y: 156, w: 96,  h: 24, type: 'stone' },

  // ── Zone 6: Asbak (Paras Stone blocks)
  { x: 2200, y: 252, w: 120, h: 24, type: 'brick' },
  { x: 2328, y: 204, w: 96,  h: 24, type: 'brick' },
  { x: 2432, y: 156, w: 96,  h: 24, type: 'brick' },

  // ── Zone 7: Batik (Grand Candi blocks)
  { x: 2600, y: 252, w: 96,  h: 24, type: 'stone' },
  { x: 2704, y: 204, w: 96,  h: 24, type: 'stone' },
  { x: 2808, y: 156, w: 120, h: 24, type: 'stone' },
];

/* ── 7. Obstacles & Hazards (Spikes ala Super Mario) ────────── */
const HAZARDS = [
  { x: 600,  y: 300, w: 48, h: 12, type: 'spikes' },
  { x: 990,  y: 300, w: 48, h: 12, type: 'spikes' },
  { x: 1340, y: 300, w: 48, h: 12, type: 'spikes' },
  { x: 1700, y: 300, w: 48, h: 12, type: 'spikes' },
  { x: 2140, y: 300, w: 60, h: 12, type: 'spikes' },
  { x: 2540, y: 300, w: 60, h: 12, type: 'spikes' },
];

/* ── 8. Patrolling Sentinel Enemies (Goomba style) ───────────── */
const ENEMIES = [
  { id: 'sentinel_1', x: 340,  y: 288, minX: 260,  maxX: 410,  speed: 0.8 },
  { id: 'sentinel_2', x: 740,  y: 288, minX: 660,  maxX: 820,  speed: 0.9 },
  { id: 'sentinel_3', x: 1080, y: 288, minX: 1000, maxX: 1160, speed: 0.8 },
  { id: 'sentinel_4', x: 1440, y: 288, minX: 1360, maxX: 1520, speed: 1.0 },
  { id: 'sentinel_5', x: 1800, y: 288, minX: 1720, maxX: 1880, speed: 0.9 },
  { id: 'sentinel_6', x: 2260, y: 288, minX: 2180, maxX: 2350, speed: 1.1 },
  { id: 'sentinel_7', x: 2680, y: 288, minX: 2600, maxX: 2770, speed: 1.0 },
];

/* ── 9. Floating Mystery Blocks (Super Mario ? Blocks) ───────── */
const MYSTERY_BLOCKS = [
  { id: 'mb_1', x: 210,  y: 228, reward: 50 },
  { id: 'mb_2', x: 620,  y: 228, reward: 50 },
  { id: 'mb_3', x: 960,  y: 228, reward: 50 },
  { id: 'mb_4', x: 1320, y: 228, reward: 75 },
  { id: 'mb_5', x: 1680, y: 228, reward: 75 },
  { id: 'mb_6', x: 2100, y: 228, reward: 75 },
  { id: 'mb_7', x: 2540, y: 228, reward: 100 },
];

/* ── 10. Decorative Props ────────────────────────────────────── */
const PROPS = [];
