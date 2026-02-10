// ===================================
// Digital Renaissance Birthday Website
// Sunset Palette Edition – GSAP Animations
// ===================================

// ===================================
// Background Music
// ===================================

(function () {
    var music = document.getElementById('bg-music');
    var btn = document.getElementById('music-toggle');
    music.volume = 0.4;

    function play() {
        music.play().then(function () {
            btn.classList.add('playing');
            btn.textContent = '🎵';
        }).catch(function () { });
    }

    function toggle() {
        if (music.paused) {
            play();
        } else {
            music.pause();
            btn.classList.remove('playing');
            btn.textContent = '🔇';
        }
    }

    btn.addEventListener('click', toggle);

    // Try autoplay immediately
    play();

    // Fallback: start on ANY first user interaction
    function startOnInteraction() {
        if (music.paused) play();
        document.removeEventListener('click', startOnInteraction);
        document.removeEventListener('scroll', startOnInteraction);
        document.removeEventListener('keydown', startOnInteraction);
        document.removeEventListener('touchstart', startOnInteraction);
    }
    document.addEventListener('click', startOnInteraction);
    document.addEventListener('scroll', startOnInteraction);
    document.addEventListener('keydown', startOnInteraction);
    document.addEventListener('touchstart', startOnInteraction);
})();
// ===================================
// Countdown Timer (commented out for testing)
// ===================================

/*
const targetDate = new Date('2026-02-12T00:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(Math.max(0, days)).padStart(2, '0');
    document.getElementById('hours').textContent = String(Math.max(0, hours)).padStart(2, '0');
    document.getElementById('minutes').textContent = String(Math.max(0, minutes)).padStart(2, '0');
    document.getElementById('seconds').textContent = String(Math.max(0, seconds)).padStart(2, '0');

    if (distance < 0) {
        clearInterval(countdownInterval);
        showBirthdayMessage();
    }
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();
*/

// Show birthday message immediately for testing
function showBirthdayMessage() {
    const section = document.getElementById('countdown-section');
    section.classList.remove('countdown-active');
    section.classList.add('countdown-complete');
}
showBirthdayMessage();

// Fire confetti on the birthday section when it opens
setTimeout(function () {
    var section = document.getElementById('countdown-section');
    createConfetti(section);
    // Second burst for extra celebration
    setTimeout(function () { createConfetti(section); }, 800);
}, 500);

// ===================================
// Love Letter Modal
// ===================================

(function () {
    var modal = document.getElementById('letter-modal');
    var openBtn = document.getElementById('open-letter-btn');
    var closeBtn = document.getElementById('close-letter-btn');
    var backdrop = modal.querySelector('.letter-backdrop');

    openBtn.addEventListener('click', function () { modal.classList.add('open'); });
    closeBtn.addEventListener('click', function () { modal.classList.remove('open'); });
    backdrop.addEventListener('click', function () { modal.classList.remove('open'); });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') modal.classList.remove('open');
    });
})();

// ===================================
// Confetti
// ===================================

function createConfetti(container) {
    const colors = ['#F8B195', '#F67280', '#C06C84', '#6C5B7B', '#355C7D'];
    for (let i = 0; i < 60; i++) {
        const piece = document.createElement('div');
        const size = 6 + Math.random() * 8;
        Object.assign(piece.style, {
            position: 'absolute',
            width: size + 'px',
            height: size + 'px',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            left: Math.random() * 100 + '%',
            top: '-12px',
            opacity: String(0.85 + Math.random() * 0.15),
        });
        container.appendChild(piece);

        gsap.to(piece, {
            y: container.clientHeight + 30,
            x: (Math.random() - 0.5) * 250,
            rotation: Math.random() * 900,
            duration: 2.5 + Math.random() * 2,
            delay: Math.random() * 0.8,
            ease: 'power1.out',
            onComplete: function () { piece.remove(); },
        });
    }
}

// ===================================
// GSAP ScrollTrigger
// ===================================

gsap.registerPlugin(ScrollTrigger);

window.addEventListener('DOMContentLoaded', function () {
    initAnimations();
});

// ===================================
// Wiggly Connector Builder
// ===================================

function createWigglyConnector() {
    var vault = document.getElementById('history-vault');
    var badges = vault.querySelectorAll('.year-badge');
    var svg = vault.querySelector('.timeline-connector');

    if (!svg || badges.length < 2) return null;

    var vaultRect = vault.getBoundingClientRect();
    var w = vault.scrollWidth;
    var h = vault.scrollHeight;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);

    // Get the top-center and bottom-center of each badge
    var info = [];
    badges.forEach(function (badge) {
        var r = badge.getBoundingClientRect();
        var cx = r.left - vaultRect.left + r.width / 2;
        info.push({
            topX: cx,
            topY: r.top - vaultRect.top,
            bottomX: cx,
            bottomY: r.bottom - vaultRect.top,
        });
    });

    // Build ONE continuous path:
    //   bottom of badge[0]
    //   → S-curve → top of badge[1]
    //   → straight through badge[1] (hidden behind badge bg)
    //   → S-curve → top of badge[2]
    //   ... and so on until the last badge
    var b = info[0];
    var d = 'M' + b.bottomX.toFixed(1) + ',' + b.bottomY.toFixed(1);

    for (var i = 0; i < info.length - 1; i++) {
        var from = info[i];
        var to = info[i + 1];

        // S-curve from bottom of current badge to top of next badge
        var sx = from.bottomX;
        var sy = from.bottomY;
        var ex = to.topX;
        var ey = to.topY;
        var midY = (sy + ey) / 2;

        d += ' C' + sx.toFixed(1) + ',' + midY.toFixed(1) + ' ' +
            ex.toFixed(1) + ',' + midY.toFixed(1) + ' ' +
            ex.toFixed(1) + ',' + ey.toFixed(1);

        // Straight line through the next badge (hidden behind badge::before mask)
        if (i < info.length - 2) {
            d += ' L' + to.bottomX.toFixed(1) + ',' + to.bottomY.toFixed(1);
        }
    }

    var path = svg.querySelector('.connector-path');
    path.setAttribute('d', d);
    return path;
}

function initAnimations() {

    // ----------------------------------
    // Parallax background
    // ----------------------------------
    gsap.to('.background-texture', {
        yPercent: 40,
        ease: 'none',
        scrollTrigger: {
            trigger: '#history-vault',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
        },
    });

    // ----------------------------------
    // Vault header
    // ----------------------------------
    gsap.from('.section-title', {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.vault-header',
            start: 'top 82%',
            toggleActions: 'play none none reverse',
        },
    });

    gsap.from('.section-subtitle', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.vault-header',
            start: 'top 82%',
            toggleActions: 'play none none reverse',
        },
    });

    // ----------------------------------
    // Timeline connector draw-on-scroll
    // ----------------------------------
    var connectorPath = createWigglyConnector();
    if (connectorPath) {
        var pathLength = connectorPath.getTotalLength();
        gsap.set(connectorPath, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
        });
        gsap.to(connectorPath, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '#history-vault',
                start: 'top 90%',
                end: 'bottom bottom',
                scrub: 0.3,
                invalidateOnRefresh: true,
            },
        });
    }

    // ----------------------------------
    // Timeline Year Animations
    // Using toggleActions (not scrub) so cards
    // always fully appear when scrolled into view
    // ----------------------------------

    // === 2021 – Slide from left with 3D tilt ===
    gsap.from('.year-2021 .year-badge', {
        x: -80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.year-2021',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
        },
    });
    gsap.from('.year-2021 .content-card', {
        x: -60,
        opacity: 0,
        rotateY: -8,
        duration: 1.2,
        delay: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.year-2021',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
        },
    });

    // === 2022 – Slide from right ===
    gsap.from('.year-2022 .year-badge', {
        x: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.year-2022',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
        },
    });
    gsap.from('.year-2022 .content-card', {
        x: 60,
        opacity: 0,
        rotateY: 8,
        duration: 1.2,
        delay: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.year-2022',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
        },
    });

    // === 2023 – Scale up with fade ===
    gsap.from('.year-2023 .year-badge', {
        scale: 0.6,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.year-2023',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
        },
    });
    gsap.from('.year-2023 .content-card', {
        scale: 0.85,
        opacity: 0,
        y: 40,
        duration: 1.2,
        delay: 0.15,
        ease: 'back.out(1.2)',
        scrollTrigger: {
            trigger: '.year-2023',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
        },
    });

    // === 2024 – Top/bottom converge ===
    gsap.from('.year-2024 .year-badge', {
        y: -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.year-2024',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
        },
    });
    gsap.from('.year-2024 .content-card', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        delay: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.year-2024',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
        },
    });

    // === 2025 – Fade up with blur ===
    gsap.from('.year-2025 .year-badge', {
        opacity: 0,
        y: 40,
        filter: 'blur(8px)',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.year-2025',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
        },
    });
    gsap.from('.year-2025 .content-card', {
        opacity: 0,
        y: 50,
        filter: 'blur(6px)',
        duration: 1.2,
        delay: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.year-2025',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
        },
    });

    // === 2026 – Grand finale ===
    gsap.from('.year-2026 .year-badge', {
        scale: 1.8,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.year-2026',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
        },
    });
    gsap.from('.year-2026 .content-card', {
        y: 80,
        opacity: 0,
        scale: 0.9,
        duration: 1.2,
        delay: 0.2,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: '.year-2026',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
        },
    });

    // Confetti burst when 2026 scrolls into view
    ScrollTrigger.create({
        trigger: '.year-2026',
        start: 'top 50%',
        once: true,
        onEnter: function () {
            var confetti = document.getElementById('confetti');
            if (confetti) {
                confetti.style.opacity = '1';
                createConfetti(confetti);
            }
        },
    });

    // ----------------------------------
    // Memory Cards – Staggered entrance
    // ----------------------------------
    var memoryCards = document.querySelectorAll('.memory-card');

    ScrollTrigger.create({
        trigger: '#memories-section',
        start: 'top 72%',
        onEnter: function () {
            gsap.to(memoryCards, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.12,
                ease: 'power3.out',
                onStart: function () {
                    memoryCards.forEach(function (c) { c.classList.add('visible'); });
                },
            });
        },
    });

    // ----------------------------------
    // Memories header animation
    // ----------------------------------
    gsap.from('.memories-header .section-title', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.memories-header',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
        },
    });

    gsap.from('.memories-header .section-subtitle', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.memories-header',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
        },
    });

    // ----------------------------------
    // Mouse-reactive tilt on cards
    // ----------------------------------
    var tiltEls = document.querySelectorAll('.content-card, .memory-card');

    tiltEls.forEach(function (el) {
        el.addEventListener('mousemove', function (e) {
            var rect = el.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var rx = ((y / rect.height) - 0.5) * 6;
            var ry = ((x / rect.width) - 0.5) * -6;

            gsap.to(el, {
                rotationX: rx,
                rotationY: ry,
                duration: 0.4,
                ease: 'power2.out',
                transformPerspective: 800,
                transformOrigin: 'center center',
            });
        });

        el.addEventListener('mouseleave', function () {
            gsap.to(el, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.5)',
            });
        });
    });

    // ----------------------------------
    // Drag-to-scroll for memories gallery
    // ----------------------------------
    var gallery = document.querySelector('.memories-gallery');
    var isDragging = false;
    var startX, scrollLeft;

    gallery.addEventListener('mousedown', function (e) {
        isDragging = true;
        gallery.style.cursor = 'grabbing';
        startX = e.pageX - gallery.offsetLeft;
        scrollLeft = gallery.scrollLeft;
    });

    function stopDrag() {
        isDragging = false;
        gallery.style.cursor = 'grab';
    }
    gallery.addEventListener('mouseleave', stopDrag);
    gallery.addEventListener('mouseup', stopDrag);

    gallery.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        e.preventDefault();
        var walk = (e.pageX - gallery.offsetLeft - startX) * 2;
        gallery.scrollLeft = scrollLeft - walk;
    });
}

// ===================================
// Refresh on resize
// ===================================
var resizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { ScrollTrigger.refresh(); }, 250);
});

// ===================================
// Image load refresh
// ===================================
window.addEventListener('load', function () {
    // Rebuild connector after fonts & images are loaded (correct positions)
    var rebuilt = createWigglyConnector();
    if (rebuilt) {
        var len = rebuilt.getTotalLength();
        gsap.set(rebuilt, {
            strokeDasharray: len,
            strokeDashoffset: len,
        });
    }
    ScrollTrigger.refresh();
});

console.log('Birthday Website Loaded – Sunset Palette');
console.log('Target: February 12, 2026');
console.log('GSAP ScrollTrigger: Active');
