// Component Scripts: Accordion, Carousel, Tabs, Wishlist

// FAQ Accordion
class FAQAccordion {
  constructor(container) {
    this.container = container;
    this.items = container.querySelectorAll('[data-faq-item]');
    this.init();
  }

  init() {
    this.items.forEach(item => {
      const toggle = item.querySelector('[data-faq-toggle]');
      if (toggle) {
        toggle.addEventListener('click', () => this.toggleItem(item));
      }
    });
  }

  toggleItem(item) {
    const isOpen = item.classList.contains('is-open');
    
    // Close all items
    this.items.forEach(i => i.classList.remove('is-open'));
    
    // Open clicked item if it was closed
    if (!isOpen) {
      item.classList.add('is-open');
    }
  }
}

// Testimonials Carousel
class TestimonialsCarousel {
  constructor(container) {
    this.container = container;
    this.track = container.querySelector('.testimonials__track');
    this.prevButton = document.querySelector('[data-carousel-prev]');
    this.nextButton = document.querySelector('[data-carousel-next]');
    this.currentIndex = 0;
    this.itemsPerView = this.getItemsPerView();
    this.init();
  }

  init() {
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.prev());
    }
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.next());
    }

    window.addEventListener('resize', () => {
      this.itemsPerView = this.getItemsPerView();
      this.updatePosition();
    });
  }

  getItemsPerView() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  prev() {
    this.currentIndex = Math.max(0, this.currentIndex - 1);
    this.updatePosition();
  }

  next() {
    const items = this.track.children.length;
    const maxIndex = Math.max(0, items - this.itemsPerView);
    this.currentIndex = Math.min(maxIndex, this.currentIndex + 1);
    this.updatePosition();
  }

  updatePosition() {
    const itemWidth = this.track.children[0].offsetWidth;
    const gap = 24; // spacing-lg
    const offset = -(this.currentIndex * (itemWidth + gap));
    this.track.style.transform = `translateX(${offset}px)`;
  }
}

// Tab Component
class TabComponent {
  constructor(container) {
    this.container = container;
    this.tabs = container.querySelectorAll('[data-tab-button], [data-faq-tab]');
    this.init();
  }

  init() {
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab));
    });
  }

  switchTab(activeTab) {
    // Remove active class from all tabs
    this.tabs.forEach(tab => {
      tab.classList.remove('featured-products__tab--active', 'faq__tab--active');
    });

    // Add active class to clicked tab
    activeTab.classList.add(
      activeTab.hasAttribute('data-tab-button') 
        ? 'featured-products__tab--active' 
        : 'faq__tab--active'
    );

    // If it's a product tab, load products
    if (activeTab.hasAttribute('data-collection')) {
      const collection = activeTab.getAttribute('data-collection');
      if (collection) {
        this.loadProducts(collection);
      }
    }
  }

  loadProducts(collection) {
    const grid = this.container.querySelector('[data-products-grid]');
    if (!grid) return;

    // Add loading state
    grid.classList.add('loading');

    // Fetch products (simplified - in production, use Shopify Ajax API)
    setTimeout(() => {
      grid.classList.remove('loading');
    }, 500);
  }
}

// Wishlist
class Wishlist {
  constructor() {
    this.storageKey = 'reguru_wishlist';
    this.items = this.getWishlist();
    this.init();
  }

  init() {
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('[data-wishlist-toggle]');
      if (toggle) {
        e.preventDefault();
        const productId = toggle.getAttribute('data-product-id');
        this.toggle(productId);
        this.updateUI(toggle, productId);
      }
    });

    // Initialize UI
    this.updateAllUI();
  }

  getWishlist() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (e) {
      console.error('Failed to save wishlist');
    }
  }

  toggle(productId) {
    const index = this.items.indexOf(productId);
    if (index > -1) {
      this.items.splice(index, 1);
    } else {
      this.items.push(productId);
    }
    this.saveWishlist();
  }

  has(productId) {
    return this.items.includes(productId);
  }

  updateUI(element, productId) {
    if (this.has(productId)) {
      element.classList.add('is-active');
      element.style.color = '#EF4444';
    } else {
      element.classList.remove('is-active');
      element.style.color = '';
    }
  }

  updateAllUI() {
    document.querySelectorAll('[data-wishlist-toggle]').forEach(toggle => {
      const productId = toggle.getAttribute('data-product-id');
      if (productId) {
        this.updateUI(toggle, productId);
      }
    });
  }
}

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
  // FAQ Accordion
  const faqSection = document.querySelector('.faq');
  if (faqSection) {
    new FAQAccordion(faqSection);
  }

  // Testimonials Carousel
  const testimonialsCarousel = document.querySelector('[data-testimonials-carousel]');
  if (testimonialsCarousel) {
    new TestimonialsCarousel(testimonialsCarousel);
  }

  // Tabs
  const tabContainers = document.querySelectorAll('[data-tabs], [data-faq-tabs]');
  tabContainers.forEach(container => {
    new TabComponent(container);
  });

  // Wishlist
  new Wishlist();

  // Quantity Selectors
  document.querySelectorAll('[data-quantity-minus]').forEach(button => {
    button.addEventListener('click', () => {
      const input = button.parentElement.querySelector('[data-quantity-input]');
      if (input) {
        input.value = Math.max(1, parseInt(input.value) - 1);
      }
    });
  });

  document.querySelectorAll('[data-quantity-plus]').forEach(button => {
    button.addEventListener('click', () => {
      const input = button.parentElement.querySelector('[data-quantity-input]');
      if (input) {
        input.value = parseInt(input.value) + 1;
      }
    });
  });
});


