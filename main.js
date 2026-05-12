(function () {
  'use strict';

  // CURSOR
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mx = 0, my = 0, fx = 0, fy = 0;

  if (cursor && follower) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });

    const interactables = 'a, button, .grid-item, .stylist-card, .wa-float, .btn-cta, .btn-outline, .btn-hero, .space-main, .space-sm';

    document.querySelectorAll(interactables).forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.background = 'transparent';
        cursor.style.border = '1px solid var(--white)';
        follower.style.width = '60px';
        follower.style.height = '60px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '8px';
        cursor.style.height = '8px';
        cursor.style.background = 'var(--white)';
        cursor.style.border = 'none';
        follower.style.width = '36px';
        follower.style.height = '36px';
      });
    });

    function animateFollower() {
      fx += (mx - fx) * 0.1;
      fy += (my - fy) * 0.1;
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();
  }

  // NAVBAR SCROLL
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) {
      navbar.style.mixBlendMode = 'normal';
      navbar.style.background = 'rgba(8,8,8,0.9)';
      navbar.style.backdropFilter = 'blur(12px)';
      navbar.style.padding = '16px 48px';
    } else {
      navbar.style.mixBlendMode = 'difference';
      navbar.style.background = 'transparent';
      navbar.style.backdropFilter = 'none';
      navbar.style.padding = '24px 48px';
    }

    if (window.innerWidth <= 768) {
      navbar.style.mixBlendMode = 'normal';
    }

    lastScroll = y;
  }, { passive: true });

  // BURGER MENU
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle('open', menuOpen);
      const spans = burger.querySelectorAll('span');
      if (menuOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.transform = '';
      }
    });

    mobileMenu.querySelectorAll('.mm-link').forEach(link => {
      link.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('open');
        burger.querySelectorAll('span').forEach(s => s.style.transform = '');
      });
    });
  }

  // SCROLL REVEAL
  const revealEls = [];

  function addReveal(selector, delay = 0) {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      if (delay) el.style.transitionDelay = (i * delay) + 's';
      revealEls.push(el);
    });
  }

  addReveal('#statement .statement-inner', 0);
  addReveal('.grid-header', 0);
  addReveal('.grid-item', 0.07);
  addReveal('.section-head', 0);
  addReveal('.stylist-card', 0.1);
  addReveal('#space .section-label', 0);
  addReveal('.space-main', 0);
  addReveal('.space-side', 0);
  addReveal('.space-quote', 0);
  addReveal('.contact-left', 0);
  addReveal('.contact-right', 0);
  addReveal('.footer-inner', 0);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // HERO TITLE SCRAMBLE
  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const originalText = ['NHG', 'HAIR STUDIO'];
    let iterations = 0;
    const maxIter = 23;

    setTimeout(() => {
      const interval = setInterval(() => {
        heroTitle.querySelectorAll('br').forEach(br => br.remove());
        const lines = heroTitle.innerText.split('\n');
        heroTitle.innerHTML = originalText.map((word, li) => {
         return word.split('').map((c, ci) => {
  if (iterations > (li * 2 + ci + 2)) return c;
  return chars[Math.floor(Math.random() * chars.length)];
}).join('');
        }).join('<br/>');
        iterations++;
        if (iterations > maxIter) clearInterval(interval);
      }, 60);
    }, 600);
  }

  // PARALLAX HERO
  const heroBg = document.querySelector('.hero-img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight * 1.5) {
        heroBg.style.transform = `scale(1.0) translateY(${window.scrollY * 0.22}px)`;
      }
    }, { passive: true });
  }

  // WA FLOAT PULSE
  const waFloat = document.getElementById('waFloat');
  if (waFloat) {
    let shown = false;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400 && !shown) {
        waFloat.style.animation = 'waPulse 0.6s var(--ease-out) forwards';
        shown = true;
      }
    }, { passive: true });
  }

  // SMOOTH NAV SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // GRID ITEM TILT
  document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      item.style.transform = `perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      item.style.transition = 'transform 0.6s var(--ease-out)';
    });
    item.addEventListener('mouseenter', () => {
      item.style.transition = 'transform 0.15s';
    });
  });

})();
