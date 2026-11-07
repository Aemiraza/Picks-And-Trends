/* ============================================
   PICKS & TRENDS — Influencer Storefront
   Interactive JavaScript
   ============================================ */

// ========== PRODUCT DATA ==========
// Empty array for now — you can add trending products & videos step-by-step.
// Example template to add a product:
/*
  {
    id: 1,
    title: "Product Title Here",
    category: "tech", // options: "tech", "fashion", "home", "fitness", "books"
    categoryLabel: "Tech & Gadgets",
    price: 29.99,
    originalPrice: 49.99,
    rating: 4.8,
    ratingCount: 120,
    badge: "trending", // options: "trending", "bestseller", "new"
    image: "images/category-tech.jpg", // path to product image
    videoUrl: "", // optional: video link (e.g. YouTube shorts / reel / mp4)
    amazonUrl: "https://amazon.com/dp/YOUR_AFFILIATE_ID"
  },
*/
const products = [];

// ========== UPDATE CATEGORY COUNTS DYNAMICALLY ==========
function updateCategoryCounts() {
  const categories = ['tech', 'fashion', 'home', 'fitness', 'books'];
  categories.forEach(cat => {
    const card = document.querySelector(`.category-card[data-category="${cat}"] .category-count`);
    if (card) {
      const count = products.filter(p => p.category === cat).length;
      card.textContent = count > 0 ? `${count} ${count === 1 ? 'item' : 'items'}` : 'Coming Soon';
    }
  });
}

// ========== RENDER PRODUCTS ==========
function renderProducts(filter = 'all') {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const filteredProducts = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  grid.innerHTML = '';

  if (filteredProducts.length === 0) {
    grid.innerHTML = `
      <div class="empty-state animate-on-scroll">
        <div class="empty-state-icon">✨</div>
        <h3 class="empty-state-title">Picks & Videos Coming Soon!</h3>
        <p class="empty-state-text">
          Currently curating the most viral and trending finds for you. New products & video reviews will be added here step by step!
        </p>
      </div>
    `;
    observeElements();
    return;
  }

  filteredProducts.forEach((product, index) => {
    const discount = product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;
    const fullStars = Math.floor(product.rating || 5);
    const hasHalfStar = (product.rating || 5) % 1 >= 0.5;
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) starsHTML += '★';
    if (hasHalfStar) starsHTML += '½';
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) starsHTML += '☆';

    const card = document.createElement('div');
    card.className = 'product-card animate-on-scroll';
    card.dataset.category = product.category;
    card.style.animationDelay = `${index * 0.08}s`;

    const badgeLabel = product.badge === 'bestseller' ? '🏆 Bestseller' : product.badge === 'trending' ? '🔥 Trending' : '✨ New';

    // Optional video tag or badge if video is attached
    const videoTag = product.videoUrl ? `<span class="product-video-badge">▶ Video Review</span>` : '';

    card.innerHTML = `
      <span class="product-badge ${product.badge || 'trending'}">${badgeLabel}</span>
      ${videoTag}
      <button class="product-wishlist" aria-label="Add to wishlist" onclick="toggleWishlist(this, event)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </button>
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
      </div>
      <div class="product-info">
        <div class="product-category-label">${product.categoryLabel || product.category}</div>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-rating">
          <span class="stars">${starsHTML}</span>
          <span class="rating-count">${product.rating || 5.0} (${(product.ratingCount || 1).toLocaleString()})</span>
        </div>
        <div class="product-price">
          <span class="price-current">$${Number(product.price).toFixed(2)}</span>
          ${product.originalPrice ? `<span class="price-original">$${Number(product.originalPrice).toFixed(2)}</span>` : ''}
          ${discount ? `<span class="price-discount">-${discount}%</span>` : ''}
        </div>
        <a href="${product.amazonUrl || '#'}" class="product-cta" target="_blank" rel="noopener" id="cta-product-${product.id}">
          Shop on Amazon
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
          </svg>
        </a>
      </div>
    `;

    grid.appendChild(card);
  });

  // Re-observe for scroll animation
  observeElements();
}


// ========== FILTER TABS ==========
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      renderProducts(filter);
    });
  });
}

// ========== CATEGORY CARDS CLICK ==========
function initCategoryCards() {
  const cards = document.querySelectorAll('.category-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      // Activate the right filter tab
      const tabs = document.querySelectorAll('.filter-tab');
      tabs.forEach(t => t.classList.remove('active'));
      const targetTab = document.querySelector(`.filter-tab[data-filter="${category}"]`);
      if (targetTab) targetTab.classList.add('active');
      // Render filtered products
      renderProducts(category);
      // Scroll to products
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
  });
}


// ========== WISHLIST TOGGLE ==========
function toggleWishlist(btn, event) {
  event.preventDefault();
  event.stopPropagation();
  btn.classList.toggle('wishlisted');
  const svg = btn.querySelector('svg');
  if (btn.classList.contains('wishlisted')) {
    svg.setAttribute('fill', 'currentColor');
    btn.style.background = 'hsl(345, 40%, 75%)';
    btn.style.color = 'white';
    // Micro-animation
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
  } else {
    svg.setAttribute('fill', 'none');
    btn.style.background = '';
    btn.style.color = '';
  }
}


// ========== COUNTDOWN TIMER ==========
function initCountdownTimer() {
  // Set deal to expire at midnight
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(23, 59, 59, 999);
  
  function updateTimer() {
    const currentTime = new Date();
    const diff = midnight - currentTime;

    if (diff <= 0) {
      document.getElementById('timer-hours').textContent = '00';
      document.getElementById('timer-minutes').textContent = '00';
      document.getElementById('timer-seconds').textContent = '00';
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('timer-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('timer-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('timer-seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}


// ========== SCROLL ANIMATIONS (Intersection Observer) ==========
function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.animate-on-scroll:not(.animated)').forEach(el => {
    observer.observe(el);
  });
}


// ========== FLOATING NAV & BACK TO TOP ==========
function initScrollEffects() {
  const floatingNav = document.getElementById('floating-nav');
  const backToTop = document.getElementById('back-to-top');
  const heroSection = document.getElementById('hero');
  const sections = document.querySelectorAll('section[id], header[id]');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;

    // Show/hide floating nav
    if (scrollY > heroBottom - 100) {
      floatingNav.classList.add('visible');
    } else {
      floatingNav.classList.remove('visible');
    }

    // Show/hide back to top
    if (scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active nav item based on scroll position
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  // Back to top click
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


// ========== NEWSLETTER FORM ==========
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  const btn = document.getElementById('newsletter-submit');
  const input = document.getElementById('newsletter-email');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!email) return;

    btn.textContent = '✓ Subscribed!';
    btn.style.background = 'hsl(140, 40%, 55%)';
    input.value = '';
    input.disabled = true;
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.style.background = '';
      input.disabled = false;
      btn.disabled = false;
    }, 3000);
  });
}


// ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}


// ========== PARALLAX SUBTLE EFFECT ON HERO ==========
function initParallax() {
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      hero.style.setProperty('--parallax-y', `${scrollY * 0.3}px`);
      const heroContent = document.querySelector('.hero-content');
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
        heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
      }
    }
  });
}


// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');
  updateCategoryCounts();
  initFilterTabs();
  initCategoryCards();
  initCountdownTimer();
  initScrollEffects();
  initNewsletter();
  initSmoothScroll();
  initParallax();
  observeElements();
});
