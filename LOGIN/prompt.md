# ROLE & OBJECTIVE
Act as an elite MIT-trained Senior Frontend UI/UX Engineer. Your task is to refactor existing Figma AutoHTML exports and build a pixel-perfect, production-ready "NUSAVA" Login Page matching the attached reference image (`Desktop - 4.jpg`). 

# TECH STACK & CONSTRAINTS (STRICT)
- **Allowed:** Semantic HTML5, Tailwind CSS (via CDN or local CLI), Custom Vanilla CSS, and Vanilla JavaScript (ES6+).
- **Forbidden:** NO Frontend/Backend frameworks (No React, Vue, Next.js, Node, PHP, etc.).
- **File Architecture:** Strictly separate concerns into 3 external files:
  1. `index.html` (Structure & Tailwind utility classes)
  2. `style.css` (Custom keyframes, complex curves, and bespoke styling)
  3. `script.js` (DOM manipulation, password toggle, validation, and interactive parallax/idle states)
- **Asset Mapping:** Scan the current workspace directory for existing AutoHTML exported assets (Wayang character, Mega Mendung clouds, Gunungan silhouette, Nusava logo, divider ornament) and link their exact file paths.

# VISUAL & LAYOUT SPECIFICATIONS (PIXEL-PERFECT)
1. **Viewport:** Full-screen `100vw` x `100vh`, `overflow-hidden` on desktop (`#463F3A` dark brownish-charcoal base background).
2. **Left Visual Panel (Curved Container):**
   - Cream/parchment background (`#FDF3D7`) featuring an oversized smooth convex circular/elliptical curve on the right edge (`border-radius: 0 50% 50% 0 / 0 60% 60% 0` or SVG clip-path).
   - Layering (z-index): Subtle Gunungan watermark (bottom-left, low opacity) -> Top-left & bottom-left vintage brown cloud ornaments -> Central Wayang Kulit puppet (`drop-shadow` for depth).
3. **Right Form Panel (Login Container):**
   - Centered vertically and horizontally in the remaining right space.
   - **Header:** "NUSAVA" logo with Wayang icon on top, followed by a golden-brown gradient horizontal divider line with a center diamond (`♦`) accent.
   - **Typography:** 
     - Heading: `LOGIN` (Bold, uppercase, `#FDF3D7`, tracking-wide).
     - Subtext: `Silahkan masuk dengan akun anda` (Light grey/beige `#C4BDB7`).
   - **Form Inputs:**
     - `Email *` (with red asterisk), dark input box (`#2E2925`), subtle border, placeholder `Masukkan Alamat Email`, helper text below: `Format email example@gmail.com`.
     - `Password *` (with red asterisk), dark input box (`#2E2925`), placeholder `Masukkan Password`, interactive eye icon on the right, and right-aligned link `Lupa Password?` (`#D9B36C`).
   - **CTA & Footer:**
     - Full-width pill-shaped button (`rounded-full`), warm gold fill (`#F3C66F`), dark text `Masuk` (font-semibold, hover glow effect).
     - Bottom text: `Belum punya akun?` (`#C4BDB7`) + `Daftar` (`#F3C66F`, bold, hover underline).

# ANIMATION & MICRO-INTERACTIONS (`style.css` & `script.js`)
1. **Curved Panel Entrance:**
   - On page load, animate the cream curved background sliding and expanding smoothly from left to right (`transform: translateX(-100%) scaleX(0.85)` to `translateX(0) scaleX(1)`) over `1.1s` using `cubic-bezier(0.22, 1, 0.36, 1)`.
2. **Wayang Puppet Entrance & Continuous Idle Animation:**
   - **Entrance:** Delayed fade-in + slide up (`0.4s` delay) after the curve expands.
   - **Idle State (Infinite Loop):** Create a `@keyframes wayangIdle` in `style.css` that makes the Wayang look alive even when the user is idle—combining a gentle vertical float (`translateY(-8px)`), subtle breathing scale (`scale(1.015)`), and slight puppet-like rotational sway (`rotate(-1.5deg)` to `rotate(1.5deg)` with `transform-origin: bottom center`) over a `4.5s ease-in-out infinite alternate` cycle.
   - **Cloud Ornaments Idle:** Add a slower horizontal floating drift (`6s ease-in-out infinite alternate`) to the cloud assets for depth.
3. **Interactive JS Enhancements (`script.js`):**
   - **Mouse Parallax:** Subtle 3D tilt/movement on the Wayang and clouds based on `mousemove` coordinates, smoothly blending with the CSS idle animation.
   - **Password Visibility Toggle:** Click event on the eye icon to toggle input `type="password"` and `type="text"`.
   - **Staggered Form Reveal:** Fade-in the logo, inputs, and button sequentially on load.

# EXECUTION STEPS
1. Inspect the workspace to read the existing Figma AutoHTML file and locate all image/SVG asset filenames.
2. Generate the clean, modular code for `index.html`, `style.css`, and `script.js` using exact asset paths.
3. Ensure responsive fallback for smaller screens while keeping the exact desktop layout from `Desktop - 4.jpg`.