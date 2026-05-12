(function() {
    // Particle Canvas
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

    class Particle {
        constructor() { this.reset(); this.y = Math.random() * canvas.height; }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 0.8;
            this.opacity = Math.random() * 0.7 + 0.3;
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
            this.pulseOffset = Math.random() * Math.PI * 2;
        }
        update(time) {
            this.x += this.vx + (targetMouseX - mouseX) * 0.003 * (this.size / 2);
            this.y += this.vy + (targetMouseY - mouseY) * 0.003 * (this.size / 2);
            if (this.x < -50) this.x = canvas.width + 50;
            if (this.x > canvas.width + 50) this.x = -50;
            if (this.y < -50) this.y = canvas.height + 50;
            if (this.y > canvas.height + 50) this.y = -50;
            this.currentOpacity = this.opacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.2;
        }
        draw(ctx) {
            const alpha = Math.max(0.1, this.currentOpacity);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
            gradient.addColorStop(0, `rgba(0,212,255,${alpha})`);
            gradient.addColorStop(0.5, `rgba(0,200,240,${alpha * 0.6})`);
            gradient.addColorStop(1, 'rgba(0,180,220,0)');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = window.innerWidth < 768 ? 60 : window.innerWidth < 1024 ? 90 : 120;
        particles = [];
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }
    initParticles();

    document.addEventListener('mousemove', (e) => { targetMouseX = e.clientX; targetMouseY = e.clientY; });
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) { targetMouseX = e.touches[0].clientX; targetMouseY = e.touches[0].clientY; }
    }, { passive: true });

    function animateParticles(time) {
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(time); p.draw(ctx); });
        const connDist = window.innerWidth < 768 ? 80 : 140;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < connDist) {
                    const alpha = (1 - dist / connDist) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0,200,240,${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    requestAnimationFrame(animateParticles);

    // Typewriter
    const typewriterTexts = [
        'Autonomous Portfolio System Online.',
        'Fullstack Developer // WordPress Specialist.',
        'Engineered Beyond Limits.',
        'Classified Capabilities. Unclassified Results.',
        'Forged in Code. Deployed with Precision.',
    ];
    let textIndex = 0, charIndex = 0, isDeleting = false;
    const typewriterEl = document.getElementById('typewriter-text');
    const typeSpeed = 55, deleteSpeed = 30, pauseBetween = 2000;

    function typewriterLoop() {
        const currentText = typewriterTexts[textIndex];
        if (!isDeleting) {
            typewriterEl.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentText.length) {
                setTimeout(() => { isDeleting = true; typewriterLoop(); }, pauseBetween);
                return;
            }
        } else {
            typewriterEl.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) { isDeleting = false; textIndex = (textIndex + 1) % typewriterTexts.length; }
        }
        const delay = isDeleting ? deleteSpeed : typeSpeed;
        setTimeout(typewriterLoop, delay + Math.random() * 40);
    }
    typewriterLoop();

    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('show');
        mobileMenuBtn.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target) && navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // AI Terminal
    const aiToggle = document.getElementById('aiToggle');
    const aiPanel = document.getElementById('aiPanel');
    const terminalMessages = document.getElementById('terminalMessages');
    const terminalInput = document.getElementById('terminalInput');
    const terminalSend = document.getElementById('terminalSend');
    let terminalOpen = false;

    const aiResponses = {
        'help': 'Available queries: <em>skills, experience, projects, contact, hire, about, stack, WordPress, React, PHP, Python, SEO, location, education, achievements</em>',
        'skills': 'Sami\'s core stack: <strong>WordPress</strong> (themes, plugins, WooCommerce), <strong>Front-End</strong> (HTML5, CSS3, JS, React, Tailwind, Bootstrap), <strong>Back-End</strong> (PHP, Python, MySQL, REST API, Node.js), <strong>Design</strong> (Figma, Photoshop, Elementor, Gutenberg), and <strong>SEO</strong>.',
        'experience': '5+ years as a WordPress Designer & Developer. Recent missions: <strong>AOSA Education</strong> (2025–Present), <strong>Arkitektz</strong> (Oct 2024), <strong>Tutor In Dubai</strong> (Jun–Jul 2023) – boosted sales by 30%.',
        'projects': 'Highlighted: <strong>Vaccine Dashboard</strong> (Node.js/Mongoose), <strong>AttendanceOS</strong> (OpenCV+QR), <strong>Rapid Rescue Services</strong>, <strong>SmartCareerAI</strong>, <strong>Arkitektz</strong>, <strong>AOSA Education Platform</strong>.',
        'contact': '📧 <strong>Email:</strong> sarizwan777@gmail.com<br>📞 <strong>Phone:</strong> +92 335 310 4345<br>💼 <strong>LinkedIn:</strong> linkedin.com/in/sami-amir-rizwan<br>🐙 <strong>GitHub:</strong> github.com/Samiamirrizwan',
        'hire': 'Sami is <strong>available for freelance & remote opportunities</strong> worldwide. Reach out via email or LinkedIn!',
        'about': 'Sami Amir Rizwan is a detail-oriented WordPress & Fullstack Developer from Karachi. 5+ years exp. Urdu (Native), English (Fluent). Pursuing Higher Diploma at Aptech Institute.',
        'stack': 'Modern stack: WordPress, PHP, React, Python, Node.js, MySQL, Tailwind CSS, Bootstrap, Git.',
        'wordpress': 'Expert in custom themes, child themes, plugin customization, WooCommerce, Elementor, Gutenberg.',
        'react': 'Builds dynamic front-end interfaces; can create headless WordPress setups with React front-ends.',
        'php': 'Primary back-end language for WordPress theme/plugin development and REST API integration.',
        'python': 'Python is part of his versatile back-end toolkit, used for scripting and automation alongside web development.',
        'seo': 'On-page SEO, speed optimization, caching, schema markup. Achieved Page 1 rankings and 90+ PageSpeed scores.',
        'location': '📍 Based in <strong>Karachi, Pakistan</strong>. Available globally for remote work.',
        'education': '🎓 <strong>Aptech Institute</strong> – Higher Diploma in Software Engineering (SBTE Inter Equivalent, 2023–2027)<br>🎓 <strong>THCC</strong> – IGCSE O-Level (2018–2023)',
        'achievements': '🏆 Load time <3s, 90+ PageSpeed, Page 1 rankings, zero-downtime migrations.',
        'default': 'I can tell you about Sami\'s <em>skills, experience, projects, contact</em> info, or how to <em>hire</em> him. Type <em>help</em> for options.',
    };

    function addMessage(text, type) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'terminal-msg ' + type;
        msgDiv.innerHTML = text;
        terminalMessages.appendChild(msgDiv);
        terminalMessages.scrollTop = terminalMessages.scrollHeight;
    }

    function handleTerminalInput() {
        const query = terminalInput.value.trim().toLowerCase();
        if (!query) return;
        addMessage(query, 'user');
        terminalInput.value = '';
        let response = aiResponses['default'];
        for (const kw of Object.keys(aiResponses)) {
            if (query.includes(kw) && kw !== 'default') { response = aiResponses[kw]; break; }
        }
        if (/^(hi|hello|hey|greetings|yo|sup)/.test(query)) {
            response = '👋 Greetings! I\'m the ARCHANGE AI. Ask about Sami\'s skills, projects, or how to hire him. Type <em>help</em>.';
        }
        if (/thank|thanks|thx/i.test(query)) {
            response = 'You\'re welcome! 🚀 Ready for your next query.';
        }
        setTimeout(() => { addMessage(response, 'ai'); }, 400 + Math.random() * 600);
    }

    aiToggle.addEventListener('click', () => {
        terminalOpen = !terminalOpen;
        if (terminalOpen) {
            aiPanel.classList.add('open');
            aiToggle.innerHTML = '<i class="fas fa-times"></i>';
            terminalInput.focus();
        } else {
            aiPanel.classList.remove('open');
            aiToggle.innerHTML = '<i class="fas fa-robot" style="font-size:1.4rem;"></i>';
        }
    });
    terminalSend.addEventListener('click', handleTerminalInput);
    terminalInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleTerminalInput(); });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });

    // Parallax Tilt
    const glassCards = document.querySelectorAll('.glass-card, .project-card');
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // Fade-in Observer
    const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.glass-card, .project-card, .timeline-item, .stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
        observer.observe(el);
    });

    setTimeout(() => {
        document.querySelectorAll('.glass-card, .project-card, .timeline-item, .stat-card').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }, 300);

    // ──────────────────────────────────
    // PRELOADER
    // ──────────────────────────────────
    const preloader = document.getElementById('preloader');
    
    function hidePreloader() {
        if (preloader) {
            preloader.classList.add('fade-out');
            // Remove from DOM after transition
            setTimeout(() => {
                if (preloader && preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 700); // matches CSS transition duration
        }
    }

    // Hide preloader once window is fully loaded (including fonts, images)
    window.addEventListener('load', () => {
        // Short delay to let animations play out slightly
        setTimeout(hidePreloader, 600);
    });

    // Fallback: if load event takes too long, hide after 4 seconds anyway
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('fade-out')) {
            hidePreloader();
        }
    }, 4000);

    console.log('%c🚀 ARCHANGE Portfolio System Online %c| %cSami Amir Rizwan',
        'color:#00d4ff;font-size:1.2em;', '', 'color:#00f0a8;');
    console.log('%c👋 Codebase: https://github.com/Samiamirrizwan', 'color:#b0bec5;');
})();