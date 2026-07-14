// Header scroll state + progress bar
const header = document.getElementById('siteHeader');
const progressBar = document.getElementById('progressBar');

function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 40);
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const headerCta = document.querySelector('.header-cta');
navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  headerCta.classList.toggle('open');
  navToggle.classList.toggle('active');
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    headerCta.classList.remove('open');
  });
});

// Hero slideshow
const slides = document.querySelectorAll('.hero-slide');
let slideIndex = 0;
if (slides.length > 1) {
  setInterval(() => {
    slides[slideIndex].classList.remove('is-active');
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add('is-active');
  }, 5000);
}

// Remove squeegee wipe overlay from flow after animation finishes
const squeegee = document.getElementById('squeegeeWipe');
if (squeegee) {
  squeegee.addEventListener('animationend', () => {
    squeegee.style.display = 'none';
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      el.classList.add('is-visible');
      // Hard-clear the transform once the reveal transition finishes.
      // A lingering CSS transform on an ancestor of a tel:/mailto: link
      // can cause iOS Safari to silently swallow the tap.
      el.addEventListener('transitionend', () => {
        el.style.transform = 'none';
      }, { once: true });
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// Reviews marquee: duplicate track content for seamless infinite loop
document.querySelectorAll('.reviews-track').forEach(track => {
  track.innerHTML += track.innerHTML;
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Gallery filters ----------
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      const match = filter === 'all' || item.dataset.cat === filter;
      item.classList.toggle('is-hidden', !match);
    });
  });
});

// ---------- Lightbox ----------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let visibleItems = [];
let currentIndex = 0;

function getVisibleItems() {
  return Array.from(galleryItems).filter(item => !item.classList.contains('is-hidden'));
}

function openLightbox(item) {
  visibleItems = getVisibleItems();
  currentIndex = visibleItems.indexOf(item);
  showLightboxImage();
  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function showLightboxImage() {
  const item = visibleItems[currentIndex];
  const img = item.querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = item.querySelector('figcaption').firstChild.textContent.trim();
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
}

function showNext() {
  currentIndex = (currentIndex + 1) % visibleItems.length;
  showLightboxImage();
}

function showPrev() {
  currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
  showLightboxImage();
}

galleryItems.forEach(item => {
  item.addEventListener('click', () => openLightbox(item));
});
lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', showNext);
lightboxPrev.addEventListener('click', showPrev);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
});

// ---------- Chat widget ----------
const chatWidget = document.getElementById('chatWidget');
const chatToggle = document.getElementById('chatToggle');
const chatClose = document.getElementById('chatClose');
const chatBody = document.getElementById('chatBody');
const chatQuickReplies = document.getElementById('chatQuickReplies');

const chatResponses = {
  quote: {
    label: 'Get a Free Quote',
    reply: "Happy to help! The fastest way is a quick call or text to <strong>(772) 646-3780</strong> — Bertin will ask a few questions about your property and get you a free, no-obligation price."
  },
  services: {
    label: 'What services do you offer?',
    reply: "We offer window cleaning (interior &amp; exterior), pressure washing, screen cleaning &amp; repair, gutter cleaning, paver sealing, landscape trimming, house &amp; office cleaning, and painting."
  },
  hours: {
    label: 'What are your hours?',
    reply: "We're open Monday through Saturday, 8 AM – 6 PM, and closed on Sundays."
  },
  area: {
    label: 'Do you serve my area?',
    reply: "We proudly serve Port St. Lucie and the surrounding areas. Give us a call at (772) 646-3780 and we can confirm your address."
  }
};

function openChat() {
  chatWidget.classList.add('is-open');
}
function closeChat() {
  chatWidget.classList.remove('is-open');
}
chatToggle.addEventListener('click', () => {
  chatWidget.classList.contains('is-open') ? closeChat() : openChat();
});
chatClose.addEventListener('click', closeChat);

chatQuickReplies.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-q]');
  if (!btn) return;
  const key = btn.dataset.q;
  const data = chatResponses[key];
  if (!data) return;

  // user bubble
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.innerHTML = `<p>${data.label}</p>`;
  chatBody.insertBefore(userMsg, chatQuickReplies);

  // typing indicator
  const typing = document.createElement('div');
  typing.className = 'chat-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  chatBody.insertBefore(typing, chatQuickReplies);
  chatBody.scrollTop = chatBody.scrollHeight;

  setTimeout(() => {
    typing.remove();
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-msg bot';
    botMsg.innerHTML = `<p>${data.reply}</p>`;
    chatBody.insertBefore(botMsg, chatQuickReplies);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 700);
});
