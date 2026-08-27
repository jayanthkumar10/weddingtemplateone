# Lenis & GSAP Frame Analysis (Clone Blueprint)

## Segment: Frames 0028 to 0258 (Intro & Hero Scroll)

### 📐 Website Layout & Grid Structure
- **Global Structure:** The hero section occupies `100vh` height and `100vw` width. Background color is a very dark, rich purple/navy (`#0b0a15` approx).
- **The Core Mosaic Container (`#hero-mosaic`):**
  - Positioned exactly in the center of the viewport.
  - Container width is approx `80vw`, max-width around `1200px`, maintaining a `16/9` aspect ratio.
  - It is **not** a standard CSS Grid. It is a highly custom layout utilizing absolute positioning to arrange 9 distinct image panels tightly around a central logo.

### 🖼️ Visual Image Mapping & Masking (CRITICAL)
The most striking visual element is the 9-panel image mosaic that forms a continuous rectangle on the outside but precisely traces the "VI" logo on the inside. Every image is separated by a uniform white gap (approx `4px` to `8px`).
- **The Centerpiece:** The "Grand Theft Auto VI" logo sits directly in the center. The "V" and "I" are large background elements of the logo, and the text overlaps them.
- **Panel 1 (Top Left):** Helicopter over water. A standard rectangle.
- **Panel 2 (Bottom Left):** Woman in a green top holding a drink. A standard rectangle.
- **Panel 3 (Top Center-Left):** Couple (Lucia and Jason). The right edge of this panel is cut at a sharp diagonal to perfectly trace the left angled arm of the 'V'.
- **Panel 4 (Bottom Center-Left):** Yellow sports car with butterfly doors open. The right edge is also angled to trace the lower left arm of the 'V'.
- **Panel 5 (Center Bottom):** Alligator in water. A wide panel spanning below the logo. Its top edge is notched to accommodate the bottom point of the 'V' and the bottom of the 'I'.
- **Panel 6 (Top Center-Right):** Speedboat and pink flamingo. The left edge is cut at a diagonal to trace the right arm of the 'V'.
- **Panel 7 (Middle Center-Right):** Man with gold chains and sunglasses. The left edge is perfectly straight, tracing the right side of the 'I'.
- **Panel 8 (Top Right):** Man in a white suit with an assault rifle. A standard rectangle.
- **Panel 9 (Bottom Right):** Motorcycle doing a wheelie (police car in background). A standard rectangle.
*Implementation Note:* The panels must be constructed using `clip-path: polygon()` to create the angled interior edges, or SVG masking, ensuring the white gaps remain perfectly uniform around the complex "VI" shape.

### 🎨 CSS Architecture
- **Layering (`z-index`):**
  - The central GTA logo sits above the panels (`z-index: 10`).
  - The 9 surrounding `.mosaic-panel` elements sit beneath it (`z-index: 1`).
  - All panels must have `overflow: hidden`.
- **Navigation (Fixed):** Top Left 'VI' logo, Top Right Hamburger menu. `position: fixed`, `z-index: 100`.
- **Performance (`will-change`):** The entire `#hero-mosaic` container requires `will-change: transform` and `transform-origin: center center` to ensure hardware acceleration during the scroll-scale effect.

### 🔤 Text Animations & Placements
- **Top Banner (Hidden on load):** "AN EXTENDED LOOK, COMING AUGUST 27" with a palm leaf watermark. Initially translated out of view.
- **Hero Footer Elements:**
  - Left: "COMING" (gray) / "NOVEMBER 19, 2026" (white, bold).
  - Center: "Pre-Order Now" button (Soft pink/peach, dark text). Has a subtle pink glow on hover: `box-shadow: 0 0 15px 5px rgba(255, 182, 193, 0.4); transform: scale(1.02); transition: all 0.3s ease;`.
  - Right: PS5 / XBOX Series X|S logos.
  - Bottom Center: Pink chevron indicating scroll.

### 🎬 JS & GSAP Transition Logic (The Intro)
- **Initial State:** A full-screen `div` overlay (`z-index: 9999`, `background: black`) covers everything, containing an SVG outline of the Rockstar logo.
- **Intro Timeline (`gsap.timeline()`):**
  1. `tl.to('.rockstar-outline', { opacity: 1, duration: 1 })`
  2. `tl.to('.rockstar-outline', { opacity: 0, duration: 0.5, delay: 1 })`
  3. `tl.to('.black-overlay', { opacity: 0, duration: 1.5, ease: 'power2.inOut' })`
  4. At the exact moment the overlay starts fading (`"<"`):
     - `tl.fromTo('.mosaic-panel', { opacity: 0 }, { opacity: 1, duration: 1.5, stagger: 0 })` (The 9 panels fade in simultaneously).
     - `tl.fromTo('.gta-center-logo', { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: 1.5, ease: 'expo.out' })`
     - `tl.fromTo('.hero-footer-elements', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' })`

### 🖱️ Lenis Scroll Mechanics (The Scroll Pullback)
- **Scroll Synchronization:** `lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker.add((time) => lenis.raf(time * 1000))` link the scrollbar to GSAP.
- **The Pullback Effect:**
  - Create a `ScrollTrigger` attached to the `<body>`.
  - `start: "top top"`, `end: "100vh top"`, `scrub: 1`.
  - **Animation 1:** `gsap.to('#hero-mosaic', { scale: 0.85, ease: "none", scrollTrigger: { ... } })`
  - **Animation 2:** Over the first `20vh` of scroll, the top purple banner slides down: `gsap.fromTo('.top-banner', { yPercent: -100 }, { yPercent: 0, scrollTrigger: { ... } })`.

## Segment: Frames 0259 to 0406 (The "Know the Couple" Full-Screen Reveal)

### 📐 Desktop Layout & Grid Structure
- This section transitions from the hero mosaic into a massive, single-panel full-viewport (`100vw`, `100vh`) section.
- The layout consists of a full-bleed background image covering the entire screen.
- Text is absolutely positioned at the top center (`top: 15%`, `text-align: center`).
- A small, pill-shaped call-to-action button ("Remind Me" / "Our Story") is positioned near the bottom center (`bottom: 10%`).

### 📱 Mobile & Tablet Responsive Shifts
- The background image requires `object-position: center` to ensure the couple remains centered when the viewport shrinks horizontally.
- The main heading scales down from `~4rem` to `2rem` on mobile.
- Padding and positioning are adjusted so the text doesn't overlap the central subjects.

### 🖼️ Visual Image Mapping & Masking
- Only one image is used: a wide, cinematic shot of the couple.
- No complex `clip-path` masks are used here. The image spans `width: 100%; height: 100%; object-fit: cover`.

### 🎨 CSS Architecture
- The section has a `z-index: 1` background image layer.
- The text has `z-index: 2` and a subtle text-shadow to ensure readability against the background.
- The background between the hero section and this section is pure black (`#000`), creating a cinematic fade-to-black transition area.

### 🔤 Text Animations & Placements
- Primary text: "KNOW THE COUPLE" (replacing "AN EXTENDED LOOK") in uppercase, tracked out (wide letter-spacing).
- Secondary text: Subheading replacing the "NETFLIX | AUGUST 27" text.
- The text fades in slightly after the image becomes visible.

### 🎬 GSAP & Javascript Logic
- A `ScrollTrigger` is attached to this section. As it enters the viewport (scrubbed), the opacity of the image scales from `0` to `1` while it translates slightly upwards (parallax effect).
- The text staggers in via a `gsap.from()` animation (y-axis slide up + fade in) triggered when the section hits the center of the viewport.

## Segment: Frames 0406 to 0556 (Trailer Cards Sequence / Know the Couple)

### 🧐 Detailed Frame-by-Frame Transition Analysis
- **Frame 0406 to 0460:** The "AN EXTENDED LOOK" (or "KNOW THE COUPLE") section is fully visible and becomes **pinned** to the viewport. Crucially, its background image stops moving completely (no parallax while pinned). As the user continues to scroll, the two Trailer Cards begin to slide up from below the bottom edge of the screen, physically overlaying the stationary pinned section. 
- **Frame 0460 to 0500:** As the cards slide up natively with the scroll, the background image of the pinned section (and its text) slowly fades out. This is achieved by fading in a dark solid overlay (`#0b0a15`) on top of the image but behind the sliding cards. By frame 0500, the cards are perfectly centered on the screen, and the background behind them is a completely solid, dark color.
- **Frame 0500 to 0556:** The pin on the background section is released. The cards continue to scroll naturally upwards and out of the top of the viewport as the user keeps scrolling. The scrubbed animation is finished.

### 📐 Desktop Layout & Grid Structure
- The layout is a two-column flex container (`display: flex`, `justify-content: center`, `gap: 3vw`).
- The cards are massive: width approx `42vw`, height approx `75vh`.
- They sit cleanly side-by-side with a generous `20px` border-radius and soft drop shadows to separate them from the dark background.

### 📱 Mobile & Tablet Responsive Shifts
- On tablet, the gap decreases and the cards scale down proportionally.
- On mobile (`max-width: 768px`), the flexbox MUST switch to `flex-direction: column`. 
- Due to the vertical stacking, the cards must have a smaller height (`~40vh` to `50vh`) so they can fit on the screen during the transition. The scrubbed parallax up must travel further to accommodate the stacked height.

### 🖼️ Visual Image Mapping & Masking
- The background fades to a solid dark overlay (`#0b0a15`).
- Left Card (Bride): `Images/pexels-picturebymv-27455006.jpg` (`background-size: cover`).
- Right Card (Groom): `Images/pexels-picturebymv-27455007.jpg` (`background-size: cover`).

### 🎨 CSS Architecture
- The previous section (`#couple-section`) requires a `.dark-overlay` absolute div (`z-index: 5`) that starts at `opacity: 0`.
- The new section (`#cards-section`) must sit directly below it but have a higher `z-index` (e.g., `z-index: 10`) so it slides over the pinned element.
- A gradient overlay (`linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 40%)`) inside the cards ensures text legibility.

### 🔤 Text Animations & Placements
- Text is absolutely positioned at the bottom center of each card (`bottom: 30px`).
- Left card: "THE BRIDE" (small tracking text), "ANANYA" (large, Clash Display).
- Right card: "THE GROOM" (small tracking text), "AJAY" (large, Clash Display).

### 🎬 JS & GSAP Transition Logic
- **The Scrubbed Pin:**
  - The background parallax for `#couple-section` must have `end: 'top top'` so it stops moving the moment it pins.
  - Create a `gsap.timeline({ scrollTrigger: { trigger: '#couple-section', start: 'top top', end: '+=150%', scrub: 1, pin: true, pinSpacing: false } })`.
  - Tween 1: `tl.to('.couple-dark-overlay', { opacity: 1, ease: 'none' })` (Fades the background to solid dark).
  - Because `pinSpacing` is false, `#cards-section` naturally scrolls over the pinned section natively. No explicit GSAP y-translation is required on the cards themselves.

---

### 🚨 Transition Audit: The Gap and Premium Architecture (Frames 0401 - 0806)

**The Problem (The Gap):**
In the current implementation, \#couple-section\ and \#events-bg-section\ are separate blocks in the normal document flow. Using GSAP to pin \#couple-section\ while \#cards-section\ scrolls over it creates a fundamental structural gap when the pin releases, leading to a jarring visual break before \#events-bg-section\ enters the viewport and pins itself. 

**The GTA VI Solution (Fixed Background Layering):**
By analyzing frames 0450 through 0550, it becomes clear that the GTA VI website does NOT pin sequential DOM sections. Instead, it uses a **Global Fixed Background Architecture**.

**📐 Revised Global Architecture:**
- **Layer 1 (The Canvas):** A fixed container (\position: fixed\, \z-index: 1\) covering the viewport. Inside this container are all the background images/videos (e.g., .bg-couple, .bg-events). They are stacked on top of each other using CSS absolute positioning and start with \opacity: 0\ (except the first one).
- **Layer 2 (The Content):** A relative container (\z-index: 10\) that holds all the scrolling content (\#couple-intro\, \#cards-section\, \#events-content\). **ALL content sections have completely transparent backgrounds.**
- **The Scroll Physics:** As the user naturally scrolls through the transparent content sections, GSAP \ScrollTrigger\ monitors which section is in view. It smoothly crossfades the background layers in the fixed canvas.
  - When \#cards-section\ is scrolled past and \#events-content\ enters, \.bg-couple\ fades to \opacity: 0\, revealing \.bg-events\.
  - This eliminates all need for \pin: true\ and \pinSpacing: false\, entirely removing jumps, gaps, and scroll-jacking. The scroll remains buttery smooth and 100% native Lenis.

**🎨 Premium Adjustments:**
- The dark gradient overlays inside the cards must use a stronger \ackdrop-filter: blur()\ to ensure legibility against the complex, fixed backgrounds.
- The cards themselves shouldn't have hard edges; they need subtle inner borders (\inset 0 1px 0 rgba(255,255,255,0.1)\) and drop shadows to float elegantly over the canvas.
