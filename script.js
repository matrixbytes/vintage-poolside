/* ============================================================
   VINTAGE POOLSIDE VILLA — COMPLETE script.js
   Original logic + All premium animations merged
   ============================================================ */

/* ═══════════════════════════════════════════════════════
   1. LOADER — spawn orbs + hide on load
═══════════════════════════════════════════════════════ */
(function spawnLoaderOrbs() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    const colors = [
        'rgba(176,191,26,0.45)',
        'rgba(255,249,165,0.3)',
        'rgba(138,148,18,0.38)',
        'rgba(255,255,255,0.14)',
    ];
    function makeOrb() {
        const orb = document.createElement('div');
        orb.className = 'loader-orb';
        const size = Math.random() * 65 + 10;
        orb.style.cssText = `
            width:${size}px;height:${size}px;
            left:${Math.random() * 100}%;
            top:${75 + Math.random() * 30}%;
            background:radial-gradient(circle,${colors[Math.floor(Math.random() * colors.length)]} 0%,transparent 70%);
            animation-duration:${Math.random() * 6 + 5}s;
            animation-delay:${Math.random() * 2}s;
        `;
        loader.appendChild(orb);
        setTimeout(() => orb.remove(), 14000);
    }
    for (let i = 0; i < 10; i++) makeOrb();
    const t = setInterval(makeOrb, 700);
    setTimeout(() => clearInterval(t), 4200);
})();

window.addEventListener('load', () => {
    setTimeout(() => {
        const loader      = document.getElementById('loader');
        const mainContent = document.getElementById('main-content');
        loader.style.transition = 'opacity 1s ease';
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            mainContent.style.opacity = '1';
            document.body.classList.add('loaded');

            // Start deferred init after loader done
            initScrollReveal();
            initTypewriter();
            initCounter();
        }, 1000);
    }, 2600);
});

/* ═══════════════════════════════════════════════════════
   2. SCROLL PROGRESS BAR
═══════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
}, { passive: true });

/* ═══════════════════════════════════════════════════════
   3. NAVBAR scroll effect
═══════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
}, { passive: true });

/* ═══════════════════════════════════════════════════════
   4. CURSOR GLOW (desktop only)
═══════════════════════════════════════════════════════ */
if (!('ontouchstart' in window)) {
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    document.body.appendChild(glow);
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top  = e.clientY + 'px';
    }, { passive: true });
}

/* ═══════════════════════════════════════════════════════
   5. PARTICLES CANVAS
═══════════════════════════════════════════════════════ */
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function mkP() {
        return {
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.6 + 0.4,
            vx: (Math.random() - 0.5) * 0.22,
            vy: -(Math.random() * 0.28 + 0.08),
            life: 0,
            maxLife: Math.random() * 320 + 200,
            col: Math.random() > 0.5 ? '176,191,26' : '255,249,165',
        };
    }
    for (let i = 0; i < 58; i++) {
        const p = mkP(); p.life = Math.random() * p.maxLife;
        particles.push(p);
    }
    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach((p, i) => {
            p.life++; p.x += p.vx; p.y += p.vy;
            if (p.life > p.maxLife || p.y < -8) { particles[i] = mkP(); return; }
            const a = Math.sin((p.life / p.maxLife) * Math.PI) * 0.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.col},${a})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
})();

/* ═══════════════════════════════════════════════════════
   6. SCROLL REVEAL
═══════════════════════════════════════════════════════ */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('sr-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -35px 0px' });

    document.querySelectorAll('.sr-up,.sr-left,.sr-right,.sr-scale').forEach(el => {
        observer.observe(el);
    });
}

/* ═══════════════════════════════════════════════════════
   7. GALLERY — scatter & assemble on scroll
═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    const items   = document.querySelectorAll('.gallery-item');
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    items.forEach(item => {
        const rx = (Math.random() - 0.5) * 4000;
        const ry = (Math.random() - 0.5) * 4000;
        item.style.setProperty('--x', rx);
        item.style.setProperty('--y', ry);
    });

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                items.forEach((item, i) => {
                    setTimeout(() => item.classList.add('animate-in'), i * 38);
                });
            } else {
                items.forEach(item => item.classList.remove('animate-in'));
            }
        });
    }, { threshold: 0.08 });

    obs.observe(gallery);
});

/* ═══════════════════════════════════════════════════════
   8. TYPEWRITER on hero-loc
═══════════════════════════════════════════════════════ */
function initTypewriter() {
    const el = document.querySelector('.hero-loc');
    if (!el) return;
    const text = el.textContent.trim();
    el.textContent = '';
    el.style.opacity = '1';
    let i = 0;
    function type() {
        if (i <= text.length) {
            el.textContent = text.slice(0, i++);
            setTimeout(type, 55);
        }
    }
    setTimeout(type, 400);
}

/* ═══════════════════════════════════════════════════════
   9. COUNTER animation on score box
═══════════════════════════════════════════════════════ */
function initCounter() {
    const box = document.querySelector('.score-box');
    if (!box) return;
    const target = parseFloat(box.textContent);
    let cur = 4.8;
    const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            const step = (target - cur) / 40;
            const timer = setInterval(() => {
                cur += step;
                if (cur >= target) { cur = target; clearInterval(timer); }
                box.textContent = cur.toFixed(1);
            }, 38);
            obs.unobserve(box);
        }
    }, { threshold: 0.5 });
    obs.observe(box);
}

/* ═══════════════════════════════════════════════════════
   10. BOOKING FORM toggle
═══════════════════════════════════════════════════════ */
function toggleBookingForm(show) {
    const overlay = document.getElementById('bookingOverlay');
    if (!overlay) return;
    if (show) {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

/* ═══════════════════════════════════════════════════════
   11. WHATSAPP FORM submit
═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('whatsappForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const name     = document.getElementById('userName').value     || 'Not provided';
        const checkIn  = document.getElementById('checkIn').value      || 'Not provided';
        const checkOut = document.getElementById('checkOut').value     || 'Not provided';
        const guests   = document.getElementById('guests').value       || 'Not provided';
        const requests = document.getElementById('specialRequests').value || 'None';

        const msg =
            `*VINTAGE POOLSIDE VILLA - ENQUIRY*%0A%0A` +
            `*Name:* ${name}%0A` +
            `*Check-In:* ${checkIn}%0A` +
            `*Check-Out:* ${checkOut}%0A` +
            `*Adult Guests:* ${guests}%0A` +
            `*Special Requests:* ${requests}%0A%0A` +
            `Please let me know the availability.`;

        window.open(`https://wa.me/919791221113?text=${msg}`, '_blank');
    });
});

/* ═══════════════════════════════════════════════════════
   12. MATRIXBYTES footer glitter
═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    const brandLink   = document.getElementById('matrix-brand-hover');
    const glitterBox  = document.getElementById('glitter-container');
    if (!brandLink || !glitterBox) return;

    const colors = ['#FF0000', '#FFFFFF', '#FF8888'];
    let dustInterval;

    function createDust() {
        for (let i = 0; i < 6; i++) {
            const dust = document.createElement('div');
            dust.className = 'star-dust';
            dust.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            const x = (Math.random() - 0.5) * 100 + 'px';
            const y = (Math.random() - 0.5) * 100 + 'px';
            dust.style.setProperty('--x', x);
            dust.style.setProperty('--y', y);
            dust.style.left = '50%'; dust.style.top = '50%';
            glitterBox.appendChild(dust);
            setTimeout(() => dust.remove(), 1000);
        }
    }
    brandLink.addEventListener('click', createDust);
    brandLink.addEventListener('mouseenter', () => { dustInterval = setInterval(createDust, 150); });
    brandLink.addEventListener('mouseleave', () => clearInterval(dustInterval));
});