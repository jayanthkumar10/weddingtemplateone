// 1. Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
    
    // 2. The Intro Timeline
    const introTl = gsap.timeline();
    
    // Step 1: Fade in Loader text
    introTl.to('.loader-outline', {
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
    });
    
    // Step 2: Hold, then fade loader out
    introTl.to('.loader-outline', {
        opacity: 0,
        duration: 0.5,
        delay: 1
    });
    
    // Step 3: Slide up black overlay like a curtain & simultaneously reveal hero
    introTl.to('.black-overlay', {
        yPercent: -100,
        duration: 1.5,
        ease: 'expo.inOut',
        onComplete: () => {
            document.querySelector('.black-overlay').style.display = 'none';
        }
    }, "+=0.2");
    
    // Step 4: Quiet Luxury - Subtle Float
    introTl.fromTo('.mosaic-panel', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 2.2, stagger: 0.1, ease: 'power3.out' }, 
        "<0.2"
    );

    // Give images a subtle "breathing" scale down (ends at 1.1 to leave room for parallax)
    introTl.fromTo('.mosaic-panel img', 
        { scale: 1.15 }, 
        { scale: 1.1, duration: 2.5, stagger: 0.1, ease: 'power2.out' }, 
        "<"
    );
    
    // Glass backing smooth fade
    introTl.fromTo('.center-logo', 
        { opacity: 0 }, 
        { opacity: 1, duration: 2, ease: 'power2.out' }, 
        "<0.2"
    );
    
    // Cinematic Film Fade for Text
    introTl.fromTo('.center-logo .logo-foreground-text, .center-logo .logo-background-text',
        { opacity: 0, y: 20, filter: 'blur(5px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 2, stagger: 0.2, ease: 'power3.out' },
        "<0.3"
    );

    // 3. ScrollTrigger Mechanics
    
    // Pullback / Scale down effect on the mosaic container with clean opacity push
    gsap.to('#hero-mosaic', {
        scale: 0.85,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "100vh top",
            scrub: 1
        }
    });

    // Inner Parallax: shift images inside panels at a different rate
    gsap.to('.mosaic-panel img', {
        yPercent: 4.9, // Keeps translation safely inside the 5% buffer provided by scale: 1.1
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "100vh top",
            scrub: 1
        }
    });

    // Cinematic Dissolve: Fade in the rich background image as it scrolls up
    gsap.to('.couple-bg-wrapper', {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
            trigger: '.extended-look',
            start: 'top bottom', // Starts fading when section enters viewport
            end: 'top center',   // Fully visible by the time it reaches center
            scrub: true
        }
    });

    // True Parallax Pinning & Overlay Fade
    let cardsTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#couple-section',
            start: 'top top',
            end: '+=150%', // Distance the user scrolls while it's pinned
            pin: true,
            scrub: 1, // Smooth scrub
            pinSpacing: false // Allows cards-section to scroll over naturally
        }
    });

    // 1. (Cards timeline simply pins the countdown section)
    // The background fade is now handled by a separate ScrollTrigger tied perfectly to the cards entering.

    // Top Banner slide down (from translateY(-100%) to 0)
    gsap.to('.top-banner', {
        y: 0,
        yPercent: 0,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "20vh top",
            scrub: true
        }
    });
    
    // Fade out scroll indicator on scroll
    gsap.to('.scroll-indicator', {
        opacity: 0,
        y: -20,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "30vh top",
            scrub: true
        }
    });

    // 4. "Know the Couple" Section & Cards Animations
    
    // Elite Full-Screen Dissolve: Tied exactly to the cards section entering the screen
    gsap.to('.couple-dark-overlay', {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
            trigger: "#cards-section",
            start: "top bottom", // Starts fading exactly as cards enter the bottom of the screen
            end: "center center", // Fully dark when cards are in the middle
            scrub: true
        }
    });

    // Elite Cinematic Cards Entrance - Cards slide up
    gsap.to('.cinematic-card', {
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.2, // Bride card rises first, then Groom card
        ease: "power4.out",
        scrollTrigger: {
            trigger: "#cards-section",
            start: "top 60%", // Cards fly up just as the background blur intensifies
            toggleActions: "play none none reverse"
        }
    });

    // Reveal texts inside cinematic cards
    gsap.fromTo('.cinematic-card .card-label, .cinematic-card .card-title, .cinematic-card .card-parents',
        { y: '100%' },
        {
            y: '0%',
            duration: 1.2,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: {
                trigger: "#cards-section",
                start: "top 55%",
                toggleActions: "play none none reverse"
            }
        }
    );
    // Background fade and parallax (scrubbed)
    gsap.to('.couple-bg-wrapper', {
        opacity: 1,
        scale: 1,
        ease: "none",
        scrollTrigger: {
            trigger: "#couple-section",
            start: "top bottom", // Starts when top of section hits bottom of viewport
            end: "center center", // Ends when section is fully centered
            scrub: true
        }
    });

    // Text and Countdown stagger reveal (triggers once, not scrubbed)
    gsap.to('.couple-heading, .time-box', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: "#couple-section",
            start: "top 60%", // Triggers when the section is 40% into the viewport
            toggleActions: "play none none reverse"
        }
    });

    // 5. Events Section (Haldi, Mehendi, Sangeeth) Animations

    // Lens Blur Crossfade Transition (Cards -> Greeting)
    const crossfadeMm = gsap.matchMedia();

    // Desktop (Blur + Fade)
    crossfadeMm.add("(min-width: 769px)", () => {
        gsap.to('.cards-container', {
            filter: "blur(24px)",
            opacity: 0,
            y: -100,
            ease: "none",
            scrollTrigger: {
                trigger: "#events-bg-section",
                start: "top 90%",
                end: "top 10%",
                scrub: true
            }
        });

        gsap.fromTo('.greeting-text', 
            { opacity: 0, filter: "blur(24px)", y: 100 },
            {
                opacity: 1, 
                filter: "blur(0px)", 
                y: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: ".greeting-section",
                    start: "top 80%",
                    end: "center center",
                    scrub: true
                }
            }
        );
    });

    // Mobile (Clean Fade Only - Highly optimized for performance)
    crossfadeMm.add("(max-width: 768px)", () => {
        gsap.to('.cards-container', {
            opacity: 0,
            y: -50, // Reduced drift for mobile
            ease: "none",
            scrollTrigger: {
                trigger: "#events-bg-section",
                start: "top 90%",
                end: "top 10%",
                scrub: true
            }
        });

        gsap.fromTo('.greeting-text', 
            { opacity: 0, y: 50 },
            {
                opacity: 1, 
                y: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: ".greeting-section",
                    start: "top 80%",
                    end: "center center",
                    scrub: true
                }
            }
        );
    });

    // Pin the events background section while the content scrolls over it
    ScrollTrigger.create({
        trigger: "#events-bg-section",
        start: "top top",
        endTrigger: "#events-content-section",
        end: "bottom bottom",
        pin: true,
        pinSpacing: false // CRUCIAL: lets the next section (content) scroll natively over the pinned background
    });

    // Event Cards Sequential Reveal & Internal Parallax
    gsap.utils.toArray('.event-wide-card').forEach(card => {
        // Card Reveal
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 90%", // Triggers earlier for smoother pacing
                toggleActions: "play none none reverse"
            },
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out"
        });

        // Internal Image Parallax
        const img = card.querySelector('.event-image-side img');
        if (img) {
            // Ensure the image is scaled via CSS or JS so parallax doesn't show edges
            gsap.set(img, { scale: 1.2 });
            gsap.fromTo(img, 
                { yPercent: -15 },
                {
                    yPercent: 15,
                    ease: "none",
                    scrollTrigger: {
                        trigger: card,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                }
            );
        }
    });

    // 6. The Wedding Day Section (Responsive Cinematic Shrink-Reveal)
    let mm = gsap.matchMedia();

    // Desktop Animation (Horizontal Shrink)
    mm.add("(min-width: 769px)", () => {
        // The Cinematic Expansion Reveal Entrance (Desktop Only)
        gsap.fromTo('#wedding-day-split', 
            { 
                clipPath: "inset(10% 5% 0 5%)", 
                borderRadius: "40px" 
            },
            {
                clipPath: "inset(0% 0% 0% 0%)",
                borderRadius: "0px",
                ease: "none",
                scrollTrigger: {
                    trigger: '#wedding-day-split',
                    start: "top bottom", 
                    end: "top top",      
                    scrub: true
                }
            }
        );

        const wdTimelineDesktop = gsap.timeline({
            scrollTrigger: {
                trigger: "#wedding-day-split",
                start: "top top",
                end: "+=200%",
                pin: true,
                scrub: 1,
                pinSpacing: true
            }
        });

        wdTimelineDesktop
            // Use clipPath inset(top right bottom left) instead of width for hardware acceleration
            // Image starts full screen, we cut off the right 50% to reveal text behind it
            .to('.wd-split-image', { clipPath: "inset(0% 50% 0% 0%)", duration: 2, ease: "power3.inOut" })
            .to('.wd-img-inner', { scale: 1, duration: 2, ease: "power3.inOut" }, "<")
            // The Highlight Zoom: Slowly zoom into the Mandapam as the text reveals
            .to('.wd-img-inner img', { scale: 1.15, transformOrigin: "center center", duration: 3, ease: "none" }, "-=1.5")
            .to('.wd-editorial-title', { y: 0, opacity: 1, duration: 1, ease: "power4.out" }, "-=2.5")
            .to('.wd-line', { width: "100%", duration: 1.5, stagger: 0.2, ease: "power3.inOut" }, "-=2.2")
            .to(['.wd-info-label', '.wd-info-value'], { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out" }, "-=2");
    });

    // Mobile Animation (Vertical Shrink)
    mm.add("(max-width: 768px)", () => {
        const wdTimelineMobile = gsap.timeline({
            scrollTrigger: {
                trigger: "#wedding-day-split",
                start: "top top",
                end: "+=150%", // Slightly shorter pin on mobile
                pin: true,
                scrub: 1,
                pinSpacing: true
            }
        });

        wdTimelineMobile
            // Use clipPath inset instead of height to prevent mobile layout thrashing glitches
            // Image starts full screen, we cut off the top 50% to reveal text behind it
            .to('.wd-split-image', { clipPath: "inset(50% 0% 0% 0%)", duration: 2, ease: "power3.inOut" })
            .to('.wd-img-inner', { scale: 1, duration: 2, ease: "power3.inOut" }, "<")
            // The Highlight Zoom: Slowly zoom into the stage/chairs
            .to('.wd-img-inner img', { scale: 1.15, transformOrigin: "center center", duration: 3, ease: "none" }, "-=1.5")
            .to('.wd-editorial-title', { y: 0, opacity: 1, duration: 1, ease: "power4.out" }, "-=2.5")
            .to('.wd-line', { width: "100%", duration: 1.5, stagger: 0.2, ease: "power3.inOut" }, "-=2.2")
            .to(['.wd-info-label', '.wd-info-value'], { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out" }, "-=2");
    });

    // 6.5 Location & Route Navigator Animations

    // 6.5 Synchronized Wedding Day to Location Transition
    // By placing both animations on the same scrubbed timeline, we guarantee 
    // they never desync regardless of scroll speed or direction (fixes backwards scroll bugs).
    const locTransition = gsap.timeline({
        scrollTrigger: {
            trigger: "#location-section",
            start: "top 90%", // Start transition as Location section enters viewport
            end: "top 30%",   // End transition as it settles into place
            scrub: true
        }
    });

    locTransition
        // 1. Dissolve the Wedding Day content smoothly without heavy blur
        .to(['.wd-split-image', '.wd-split-content'], { 
            opacity: 0, 
            ease: "none" 
        }, 0) // Starts at time 0
        // 2. Reveal the Location Card
        .fromTo('.location-card', 
            { y: 150, opacity: 0 }, 
            { y: 0, opacity: 1, ease: "none" }, 
            0 // Starts at time 0 (perfectly synchronized)
        );

    // 8. Grand Finale Footer Animation (The Curtain Reveal)
    // This perfectly triggers as the bottom of the location section scrolls up, revealing the fixed footer behind the gap!
    const finaleTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: "#location-section",
            start: "bottom bottom", // Starts exactly when the 100vh margin gap begins to reveal
            end: "bottom top",      // Ends when the Location section has completely slid off screen
            scrub: true
        }
    });

    finaleTimeline
        // The monogram slowly scales up and emerges from the void
        .fromTo('.bg-monogram', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 0.05, duration: 1 })
        // The text gently floats up
        .fromTo('.finale-text-wrapper', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.8")
        // The button glows into existence
        .fromTo('.btn-finale-rsvp', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)" }, "-=0.5")
        // The copyright fades in last
        .fromTo('.finale-copyright', { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.2");

    // 9. Hamburger Menu Logic
    const hamburger = document.querySelector('.hamburger');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-links a');
    
    let isMenuOpen = false;
    const menuTl = gsap.timeline({ paused: true });

    menuTl.to(menuOverlay, {
        autoAlpha: 1, // Toggles visibility and opacity
        duration: 0.4,
        ease: 'power2.out'
    })
    .to(menuLinks, {
        y: '0%',
        duration: 0.6,
        stagger: 0.1,
        ease: 'expo.out'
    }, "-=0.2");

    hamburger.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        hamburger.classList.toggle('active');
        
        if (isMenuOpen) {
            menuOverlay.style.pointerEvents = 'auto';
            lenis.stop(); // Lock scroll
            menuTl.timeScale(1).play();
        } else {
            menuOverlay.style.pointerEvents = 'none';
            lenis.start(); // Unlock scroll
            menuTl.timeScale(1.5).reverse();
        }
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(isMenuOpen) {
                isMenuOpen = false;
                hamburger.classList.remove('active');
                menuOverlay.style.pointerEvents = 'none';
                lenis.start();
                menuTl.timeScale(1.5).reverse();
            }
        });
    });

    // 7. Countdown Timer Logic
    const countdownDate = new Date("November 19, 2026 00:00:00").getTime();

    const updateCountdown = setInterval(function() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            clearInterval(updateCountdown);
            document.getElementById("days").innerHTML = "00";
            document.getElementById("hours").innerHTML = "00";
            document.getElementById("minutes").innerHTML = "00";
            document.getElementById("seconds").innerHTML = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Add leading zero if needed
        document.getElementById("days").innerHTML = days < 10 ? "0" + days : days;
        document.getElementById("hours").innerHTML = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").innerHTML = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").innerHTML = seconds < 10 ? "0" + seconds : seconds;
    }, 1000);
});
