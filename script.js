// ===== PRELOADER & PAGE ENTRANCE =====
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  document.body.classList.add('loaded');
  initHeroReveal();
  initParticles();
  initTiltCards();
  initMagneticButtons();
  initScrollReveal();
  initCounterAnimation();
  initTypewriter();
  initSmoothScroll();
  initSkillBars();
  initNavScroll();
  initHamburger();
  initCursor();
  initNavActiveLink();
});

// ===== THEME TOGGLE =====
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');

  // Apply saved theme
  if (savedTheme === 'light') {
    document.body.classList.add('light');
  }

  toggle.addEventListener('click', () => {
    // Add transition class
    document.body.classList.add('theme-transition');

    // Toggle theme
    document.body.classList.toggle('light');

    // Save preference
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');

    // Remove transition class after animation
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 500);
  });
}

// ===== 1. HERO STAGGERED TEXT REVEAL =====
function initHeroReveal() {
  const badge = document.querySelector('.hero-badge');
  const lines = document.querySelectorAll('.hero-title .line');
  const sub = document.querySelector('.hero-sub');
  const actions = document.querySelector('.hero-actions');
  const stats = document.querySelector('.hero-stats');
  const visual = document.querySelector('.hero-visual');
  const floatingCards = document.querySelectorAll('.floating-card');

  const all = [badge, ...lines, sub, actions, stats];
  all.forEach(el => {
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'none';
    }
  });

  if (visual) {
    visual.style.opacity = '0';
    visual.style.transform = 'scale(0.85)';
    visual.style.transition = 'none';
  }

  floatingCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform += ' scale(0.7)';
    card.style.transition = 'none';
  });

  setTimeout(() => {
    all.forEach((el, i) => {
      if (el) {
        el.style.transition = `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });

    if (visual) {
      visual.style.transition = 'opacity 1s cubic-bezier(0.16,1,0.3,1) 0.5s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.5s';
      visual.style.opacity = '1';
      visual.style.transform = 'scale(1)';
    }

    floatingCards.forEach((card, i) => {
      setTimeout(() => {
        card.style.transition = 'opacity 0.6s cubic-bezier(0.34,1.56,0.64,1), transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
        card.style.opacity = '1';
        card.style.transform = card.style.transform.replace('scale(0.7)', 'scale(1)');
      }, 800 + i * 150);
    });
  }, 200);
}

// ===== 2. INTERACTIVE PARTICLE CANVAS =====
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  canvas.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;';
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  heroBg.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let mouse = { x: -999, y: -999 };
  let particles = [];
  let w, h;

  function resize() {
    const hero = document.querySelector('.hero');
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  document.querySelector('.hero').addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  document.querySelector('.hero').addEventListener('mouseleave', () => {
    mouse.x = -999;
    mouse.y = -999;
  });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r = Math.random() * 1.8 + 0.5;
      this.alpha = Math.random() * 0.3 + 0.08;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Mouse repel
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        const force = (150 - dist) / 150;
        this.vx += (dx / dist) * force * 0.15;
        this.vy += (dy / dist) * force * 0.15;
      }

      // Dampen
      this.vx *= 0.99;
      this.vy *= 0.99;

      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108,99,255,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / 120) * 0.08;
          ctx.strokeStyle = `rgba(108,99,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== 3. 3D PERSPECTIVE TILT ON PROJECT CARDS =====
function initTiltCards() {
  document.querySelectorAll('.project-card, .tool-card, .education-card, .coursework-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

// ===== 4. MAGNETIC HOVER BUTTONS =====
function initMagneticButtons() {
  // Disabled — buttons stay static
}

// ===== 5. SMOOTH SCROLL-TRIGGERED REVEALS =====
function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.section-tag, .section-title, .section-sub, .about-desc, .about-tags, .about-links, ' +
    '.project-card, .skill-category, .timeline-item, .education-card, .coursework-card, ' +
    '.contact-item, .contact-desc, .contact-form, .form-success, .social-row, .quick-contact, ' +
    '.stat, .stat-divider'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, i) => {
    el.classList.add('reveal-el');
    // Add stagger delay based on sibling index
    const parent = el.parentElement;
    const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal-el') || revealEls.length);
    const index = Array.from(parent.children).indexOf(el);
    el.style.transitionDelay = `${(index % 5) * 0.08}s`;
    revealObserver.observe(el);
  });
}

// ===== 6. COUNTER ANIMATION =====
function initCounterAnimation() {
  const statNums = document.querySelectorAll('.stat-num');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const num = parseInt(text);
        const suffix = text.replace(num, '');
        let current = 0;
        const duration = 1500;
        const step = Math.ceil(num / (duration / 16));
        const timer = setInterval(() => {
          current += step;
          if (current >= num) {
            current = num;
            clearInterval(timer);
          }
          el.textContent = current + suffix;
        }, 16);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));
}

// ===== 7. TYPEWRITER EFFECT =====
function initTypewriter() {
  const sub = document.querySelector('.hero-sub');
  if (!sub) return;
  const fullText = sub.textContent.trim();
  sub.textContent = '';
  sub.style.opacity = '1';

  // Add blinking cursor
  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'typewriter-cursor';
  cursorSpan.textContent = '|';
  sub.appendChild(cursorSpan);

  let charIndex = 0;
  const speed = 25;

  function typeChar() {
    if (charIndex < fullText.length) {
      sub.insertBefore(document.createTextNode(fullText[charIndex]), cursorSpan);
      charIndex++;
      setTimeout(typeChar, speed);
    } else {
      // Remove cursor after finishing
      setTimeout(() => cursorSpan.style.opacity = '0', 2000);
    }
  }

  // Delay typewriter to sync with hero reveal
  setTimeout(typeChar, 800);
}

// ===== 8. SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ===== 9. SKILL BAR ANIMATION =====
function initSkillBars() {
  const skillFills = document.querySelectorAll('.skill-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillFills.forEach(fill => observer.observe(fill));
}

// ===== 10. NAV SCROLL =====
function initNavScroll() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ===== 11. HAMBURGER =====
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
}
function closeMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
}

// ===== 12. CUSTOM CURSOR =====
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
  });

  // Smooth follower with lerp
  function animateFollower() {
    followerX += (cursorX - followerX) * 0.12;
    followerY += (cursorY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .tool-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      cursor.style.background = 'rgba(108,99,255,0.3)';
      follower.style.transform = 'translate(-50%,-50%) scale(1.8)';
      follower.style.borderColor = 'rgba(108,99,255,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursor.style.background = 'var(--primary)';
      follower.style.transform = 'translate(-50%,-50%) scale(1)';
      follower.style.borderColor = 'rgba(108,99,255,0.5)';
    });
  });
}

// ===== 13. ACTIVE NAV LINK =====
function initNavActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link-item');
  const indicator = document.getElementById('nav-indicator');
  const navUl = document.getElementById('nav-links');

  function moveIndicator(activeLink) {
    if (!activeLink || !indicator || !navUl) return;
    const ulRect = navUl.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    indicator.style.left = (linkRect.left - ulRect.left) + 'px';
    indicator.style.width = linkRect.width + 'px';
  }

  // Set initial position
  setTimeout(() => {
    const first = navLinks[0];
    if (first) {
      first.classList.add('active');
      moveIndicator(first);
    }
  }, 100);

  // On scroll
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
        moveIndicator(link);
      }
    });
  });

  // On click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      moveIndicator(link);
    });
  });

  // Recalculate on resize
  window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-link-item.active');
    if (active) moveIndicator(active);
  });
}

// ===== CONTACT FORM =====
const SEND_BTN_DEFAULT = 'Send Message <span class="btn-arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>';

function resetBtn(btn) {
  btn.innerHTML = SEND_BTN_DEFAULT;
  btn.disabled = false;
}

async function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const btn = form.querySelector('button[type="submit"]');

  btn.innerHTML = '<span class="btn-spinner"></span> Sending...';
  btn.disabled = true;

  try {
    const response = await fetch('https://formspree.io/f/xeerayll', {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      form.reset();
      resetBtn(btn);
      form.classList.add('form-hidden');
      success.classList.add('success-visible');

      setTimeout(() => {
        success.classList.remove('success-visible');
        setTimeout(() => form.classList.remove('form-hidden'), 400);
      }, 4000);
    } else {
      resetBtn(btn);
      alert('Something went wrong. Please try again.');
    }
  } catch (err) {
    resetBtn(btn);
    alert('Network error. Please check your connection and try again.');
  }
}
