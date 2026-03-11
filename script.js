/* ============================================================
   RAJ KUMAR PORTFOLIO — script.js
   ============================================================ */

// ─── PAGE LOADER ────────────────────────────────────────────
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1200);
});

// ─── HERO CANVAS PARTICLES ──────────────────────────────────
const canvas = document.getElementById('heroCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x    = Math.random() * canvas.width;
        this.y    = Math.random() * canvas.height;
        this.vx   = (Math.random() - 0.5) * 0.4;
        this.vy   = (Math.random() - 0.5) * 0.4;
        this.r    = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108,99,255,${this.alpha})`;
        ctx.fill();
    }
}

// create 120 particles
for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx   = particles[i].x - particles[j].x;
            const dy   = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(108,99,255,${0.08 * (1 - dist / 130)})`;
                ctx.lineWidth  = 0.6;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ─── TYPEWRITER EFFECT ──────────────────────────────────────
const typedEl = document.getElementById('typedText');
const words   = ['Full Stack Developer', 'Assistant Professor', 'PHP Developer', 'React Developer', 'Web Designer', 'Tech Educator'];
let wIdx = 0, cIdx = 0, isDeleting = false;

function typeWriter() {
    const current = words[wIdx];
    if (isDeleting) {
        typedEl.textContent = current.substring(0, cIdx - 1);
        cIdx--;
    } else {
        typedEl.textContent = current.substring(0, cIdx + 1);
        cIdx++;
    }
    let delay = isDeleting ? 60 : 100;
    if (!isDeleting && cIdx === current.length) { delay = 2000; isDeleting = true; }
    else if (isDeleting && cIdx === 0) { isDeleting = false; wIdx = (wIdx + 1) % words.length; delay = 400; }
    setTimeout(typeWriter, delay);
}
typeWriter();

// ─── ANIMATED COUNTER ───────────────────────────────────────
function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
        start = Math.min(start + step, target);
        el.textContent = start;
        if (start >= target) clearInterval(timer);
    }, 16);
}

// ─── NAVBAR SCROLL BEHAVIOUR ────────────────────────────────
const nav     = document.getElementById('mainNav');
const backTop = document.getElementById('backTop');
let countersStarted = false;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar
    nav.classList.toggle('scrolled', scrollY > 50);

    // Back to top
    backTop.classList.toggle('visible', scrollY > 400);

    // Nav active link
    document.querySelectorAll('.nav-link').forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        if (!section) return;
        const rect = section.getBoundingClientRect();
        link.classList.toggle('active', rect.top <= 80 && rect.bottom > 80);
    });

    // Counters (fire once)
    if (!countersStarted) {
        const statsEl = document.querySelector('.hero-stats');
        if (statsEl) {
            const rect = statsEl.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                countersStarted = true;
                document.querySelectorAll('.hstat-num').forEach(el => {
                    animateCounter(el, parseInt(el.dataset.count));
                });
            }
        }
    }

    // Skill bars
    document.querySelectorAll('.sk-fill').forEach(bar => {
        const rect = bar.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60 && bar.style.width === '0px' || bar.style.width === '') {
            bar.style.width = bar.dataset.w + '%';
        }
    });

    // Reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) el.classList.add('visible');
    });
});

// ─── MOBILE HAMBURGER ───────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});

// Close on link click
document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
    });
});

// ─── BACK TO TOP ────────────────────────────────────────────
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ─── SMOOTH SCROLL (anchor links) ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ─── SKILL BARS ON LOAD ─────────────────────────────────────
// Trigger on initial display if skills are already in view
setTimeout(() => {
    document.querySelectorAll('.sk-fill').forEach(bar => {
        const rect = bar.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) bar.style.width = bar.dataset.w + '%';
    });
    // Reveal visible
    document.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) el.classList.add('visible');
    });
    // Counter if hero stats visible
    document.querySelectorAll('.hstat-num').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && !countersStarted) {
            countersStarted = true;
            document.querySelectorAll('.hstat-num').forEach(e => animateCounter(e, parseInt(e.dataset.count)));
        }
    });
}, 300);

// ─── ADD REVEAL CLASS TO SECTIONS ───────────────────────────
document.querySelectorAll('.about-grid, .skills-grid, .teaching-grid, .projects-grid, .ach-grid, .contact-grid, .edu-cards, .proj-card, .award-card, .subject-row, .exp-card, .edu-card').forEach(el => {
    el.classList.add('reveal');
});

// ─── CONTACT FORM ───────────────────────────────────────────
function handleContactForm(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
        btn.style.background = '#10b981';
        setTimeout(() => {
            btn.innerHTML = orig;
            btn.style.background = '';
            btn.disabled = false;
            e.target.reset();
        }, 3000);
    }, 1500);
}

// ─── INIT counters if hero in view on load ───────────────────
window.dispatchEvent(new Event('scroll'));

// ─── PROXIMITY GLOW ─────────────────────────────────────────
(function () {
    const RADIUS = 120;
    const glowCards = document.querySelectorAll('.glass-hover');

    document.addEventListener('mousemove', e => {
        const mx = e.clientX;
        const my = e.clientY;

        glowCards.forEach(card => {
            const rect = card.getBoundingClientRect();

            // Clamp cursor position relative to card (with RADIUS padding)
            const nearX = mx >= rect.left - RADIUS && mx <= rect.right  + RADIUS;
            const nearY = my >= rect.top  - RADIUS && my <= rect.bottom + RADIUS;

            if (nearX && nearY) {
                card.classList.add('near');
                // Express cursor position as percentage inside the card
                const x = ((mx - rect.left) / rect.width)  * 100;
                const y = ((my - rect.top)  / rect.height) * 100;
                card.style.setProperty('--glow-x', x + '%');
                card.style.setProperty('--glow-y', y + '%');
            } else {
                card.classList.remove('near');
            }
        });
    });

    // Clean up when mouse leaves the window
    document.addEventListener('mouseleave', () => {
        glowCards.forEach(card => card.classList.remove('near'));
    });
}());
