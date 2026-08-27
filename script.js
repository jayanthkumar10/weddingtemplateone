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
    
    // Step 3: Fade out black overlay & simultaneously reveal hero
    introTl.to('.black-overlay', {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.inOut',
        onComplete: () => {
            document.querySelector('.black-overlay').style.display = 'none';
        }
    }, "+=0.2");
    
    // Step 4: The simultaneous pop-in (starts exactly when overlay starts fading)
    introTl.fromTo('.mosaic-panel', 
        { opacity: 0 }, 
        { opacity: 1, duration: 1.5, stagger: 0, ease: 'power2.out' }, 
        "<"
    );
    
    introTl.fromTo('.center-logo', 
        { opacity: 0, scale: 1.5 }, 
        { opacity: 1, scale: 1, duration: 1.5, ease: 'expo.out' }, 
        "<"
    );
    
    introTl.fromTo('.hero-footer-elements', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1.5, stagger: 0.1, ease: 'power3.out' }, 
        "<0.5" // slightly delayed relative to the main pop
    );

    // 3. ScrollTrigger Mechanics
    
    // Pullback / Scale down effect on the mosaic
    gsap.to('#hero-mosaic', {
        scale: 0.85,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "100vh top",
            scrub: 1 // 1-second lag for buttery feel
        }
    });

    // Parallax background for countdown section
    gsap.to('.extended-look', {
        backgroundPosition: `50% ${-window.innerHeight * 0.3}px`,
        ease: "none",
        scrollTrigger: {
            trigger: '.extended-look',
            start: 'top bottom',
            end: 'top top', // Stops moving exactly when it pins
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

    // 1. Fade the background overlay to solid dark as the user scrolls
    // It stays transparent for the first 40% of the scroll, then fades to black
    cardsTl.to('.couple-dark-overlay', { opacity: 0, duration: 0.4 })
           .to('.couple-dark-overlay', { opacity: 1, duration: 0.6, ease: 'none' });

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
    
    // Fade out footer elements on scroll
    gsap.to('.hero-footer-elements, .scroll-indicator', {
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

    // 4. "Know the Couple" Section Animations
    
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

    // Pin the events background section while the content scrolls over it
    ScrollTrigger.create({
        trigger: "#events-bg-section",
        start: "top top",
        endTrigger: "#events-content-section",
        end: "bottom bottom",
        pin: true,
        pinSpacing: false // CRUCIAL: lets the next section (content) scroll natively over the pinned background
    });

    // Greeting Text Animation (Fade up)
    gsap.from('.greeting-text', {
        scrollTrigger: {
            trigger: '.greeting-section',
            start: "top 60%",
            toggleActions: "play none none reverse"
        },
        y: 80,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out"
    });

    // Event Cards Sequential Reveal
    gsap.utils.toArray('.event-wide-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%", // Triggers slightly before it enters the viewport
                toggleActions: "play none none reverse"
            },
            y: 120,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });
    });

    // 6. Countdown Timer Logic
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
