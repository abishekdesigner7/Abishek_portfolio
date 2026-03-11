// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => {
    follower.style.left = e.clientX + 'px';
    follower.style.top = e.clientY + 'px';
  }, 80);
});

document.querySelectorAll('a, button, .tool-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
    follower.style.borderColor = 'rgba(108,99,255,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    follower.style.transform = 'translate(-50%,-50%) scale(1)';
    follower.style.borderColor = 'rgba(108,99,255,0.5)';
  });
});

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMenu() {
  mobileMenu.classList.remove('open');
}

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== SKILL BAR ANIMATION =====
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      fill.style.width = fill.dataset.width + '%';
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

// ===== FADE-UP ANIMATION =====
const fadeEls = document.querySelectorAll('.project-card, .skill-category, .timeline-item, .education-card, .coursework-card, .contact-item');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-up');
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 100);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => {
  el.classList.add('fade-up');
  fadeObserver.observe(el);
});

// ===== HERO TEXT TYPEWRITER =====
const badge = document.querySelector('.hero-badge');
if (badge) {
  badge.style.opacity = '0';
  badge.style.transform = 'translateY(-10px)';
  badge.style.transition = 'all 0.6s ease';
  setTimeout(() => {
    badge.style.opacity = '1';
    badge.style.transform = 'translateY(0)';
  }, 300);
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

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = '#a78bfa';
    }
  });
});

// ===== STAGGER ANIMATION for floating cards =====
document.querySelectorAll('.floating-card').forEach((card, i) => {
  card.style.animationDelay = `${i * 0.5}s`;
});
