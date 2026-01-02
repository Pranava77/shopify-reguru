/**
 * ReGuru Theme - Main JavaScript
 * Neobrutalist E-commerce Theme
 */

class ThemeUtils {
  constructor() {
    this.init();
  }

  init() {
    this.#setupEventListeners();
  }

  #setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.#initializeComponents();
    });
  }

  #initializeComponents() {
    // Initialize FAQ accordions
    this.#initAccordions();
    
    // Initialize testimonial slider
    this.#initTestimonialSlider();
    
    // Initialize category navigation
    this.#initCategoryNav();
  }

  #initAccordions() {
    const accordions = document.querySelectorAll('.faq__item');
    
    for (const accordion of accordions) {
      const trigger = accordion.querySelector('.faq__question');
      
      if (trigger) {
        trigger.addEventListener('click', () => {
          const isOpen = accordion.classList.contains('is-open');
          
          // Close all other accordions
          for (const item of accordions) {
            item.classList.remove('is-open');
          }
          
          // Toggle current
          if (!isOpen) {
            accordion.classList.add('is-open');
          }
        });
      }
    }
  }

  #initTestimonialSlider() {
    const container = document.querySelector('.testimonials__container');
    if (!container) return;

    const slider = container.querySelector('.testimonials__slider');
    const prevBtn = container.querySelector('[data-testimonial-prev]');
    const nextBtn = container.querySelector('[data-testimonial-next]');
    const track = container.querySelector('.testimonials__track');
    
    if (!slider || !track || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const cards = track.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;

    if (totalCards === 0) return;

    const getVisibleCards = () => {
      const width = window.innerWidth;
      if (width <= 768) return 1;
      if (width <= 992) return 2;
      return 3;
    };

    const getGap = () => {
      const width = window.innerWidth;
      if (width <= 768) return 16;
      if (width <= 992) return 16;
      return 25;
    };

    const getCardWidth = () => {
      // Get computed width of first card including border
      const card = cards[0];
      if (!card) return 394;
      const style = window.getComputedStyle(card);
      return card.offsetWidth || parseFloat(style.width) || 394;
    };

    const updateSlider = () => {
      const visibleCards = getVisibleCards();
      const maxIndex = Math.max(0, totalCards - visibleCards);
      
      // Clamp currentIndex to valid range
      currentIndex = Math.min(currentIndex, maxIndex);
      currentIndex = Math.max(0, currentIndex);
      
      const cardWidth = getCardWidth();
      const gap = getGap();
      const offset = currentIndex * (cardWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;
      
      // Update button states visually
      prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
      nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
    };

    const goToPrev = () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    };

    const goToNext = () => {
      const visibleCards = getVisibleCards();
      const maxIndex = Math.max(0, totalCards - visibleCards);
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSlider();
      }
    };

    // Use arrow functions to maintain correct 'this' context
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToPrev();
    });

    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToNext();
    });

    // Update slider on resize
    window.addEventListener('resize', ThemeUtils.debounce(() => {
      updateSlider();
    }, 150));

    // Initial update after a small delay to ensure layout is complete
    requestAnimationFrame(() => {
      updateSlider();
    });
  }

  #initCategoryNav() {
    const categoryItems = document.querySelectorAll('.category-nav__item');
    
    for (const item of categoryItems) {
      const dropdown = item.querySelector('.category-nav__dropdown');
      
      if (dropdown) {
        item.addEventListener('mouseenter', () => {
          dropdown.classList.add('is-visible');
        });
        
        item.addEventListener('mouseleave', () => {
          dropdown.classList.remove('is-visible');
        });
      }
    }
  }

  /**
   * Debounce utility function
   */
  static debounce(fn, delay = 300) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /**
   * Throttle utility function
   */
  static throttle(fn, limit = 300) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Initialize theme
const theme = new ThemeUtils();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ThemeUtils };
}
