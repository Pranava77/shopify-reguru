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
    // Handle both cases: script loaded before or after DOMContentLoaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.#initializeComponents();
      });
    } else {
      // DOM already loaded
      this.#initializeComponents();
    }
  }

  #initializeComponents() {
    // Initialize FAQ accordions
    this.#initAccordions();
    
    // Initialize testimonial slider
    this.#initTestimonialSlider();
    
    // Initialize category navigation
    this.#initCategoryNav();
    
    // Initialize mega menu
    this.#initMegaMenu();
    
    // Initialize product grid tabs
    this.#initProductGridTabs();
    
    // Initialize cart functionality
    this.#initCart();
    
    // Initialize FAQ tabs
    this.#initFaqTabs();
    
    // Initialize cart count on page load
    this.#updateCartCount();
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

  #initProductGridTabs() {
    const productGrids = document.querySelectorAll('.product-grid');
    
    for (const grid of productGrids) {
      const tabsContainer = grid.querySelector('[data-product-grid-tabs]');
      const contentContainer = grid.querySelector('[data-product-grid-content]');
      
      if (!tabsContainer || !contentContainer) continue;
      
      const tabs = tabsContainer.querySelectorAll('.product-grid__tab');
      const productContainers = contentContainer.querySelectorAll('[data-tab-content]');
      
      // Only initialize if we have both tabs and containers
      if (tabs.length === 0 || productContainers.length === 0) continue;
      
      // Ensure first tab and container are active/visible on load
      if (tabs.length > 0 && productContainers.length > 0) {
        const firstTab = tabs[0];
        const firstContainer = productContainers[0];
        
        if (firstTab && !firstTab.classList.contains('active')) {
          firstTab.classList.add('active');
        }
        if (firstContainer && firstContainer.classList.contains('hidden')) {
          firstContainer.classList.remove('hidden');
        }
      }
      
      // Add click handlers to all tabs
      for (const tab of tabs) {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const targetHandle = tab.getAttribute('data-tab-target');
          const tabIndex = tab.getAttribute('data-tab-index');
          
          if (!targetHandle) {
            console.warn('Tab missing data-tab-target attribute');
            return;
          }
          
          // Remove active class from all tabs
          for (const t of tabs) {
            t.classList.remove('active');
          }
          
          // Add active class to clicked tab
          tab.classList.add('active');
          
          // Hide all product containers
          for (const container of productContainers) {
            container.classList.add('hidden');
          }
          
          // Show the target product container - try by handle first, then by index
          let targetContainer = contentContainer.querySelector(`[data-tab-content="${targetHandle}"]`);
          
          // Fallback: if not found by handle, try by index
          if (!targetContainer && tabIndex !== null) {
            targetContainer = contentContainer.querySelector(`[data-tab-index="${tabIndex}"]`);
          }
          
          if (targetContainer) {
            targetContainer.classList.remove('hidden');
            
            // Smooth scroll to top of product grid if needed
            const gridTop = grid.getBoundingClientRect().top + window.pageYOffset;
            if (window.pageYOffset > gridTop) {
              window.scrollTo({
                top: gridTop - 100,
                behavior: 'smooth'
              });
            }
          } else {
            console.warn(`No container found for tab target: ${targetHandle}`);
          }
        });
      }
    }
  }

  #initCart() {
    // Initialize cart drawer
    this.#initCartDrawer();
    
    // Handle add to cart buttons - add to cart and open drawer
    const addToCartButtons = document.querySelectorAll('[data-add-to-cart]');
    
    for (const button of addToCartButtons) {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const variantId = button.getAttribute('data-variant-id');
        if (!variantId) {
          console.warn('Add to cart button missing variant ID');
          return;
        }
        
        // Disable button during request
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = 'Adding...';
        
        try {
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: variantId,
              quantity: 1
            })
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.description || 'Failed to add item to cart');
          }
          
          // Optimistic UI update - update cart count
          this.#updateCartCount();
          
          // Open cart drawer and refresh cart items
          this.#openCartDrawer();
          await this.#refreshCartDrawer();
          
        } catch (error) {
          console.error('Error adding to cart:', error);
          button.disabled = false;
          button.textContent = originalText;
          alert('Failed to add item to cart. Please try again.');
        }
      });
    }
    
    // Handle buy now buttons - add to cart and redirect to checkout
    const buyNowButtons = document.querySelectorAll('[data-buy-now]');
    
    for (const button of buyNowButtons) {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const variantId = button.getAttribute('data-variant-id');
        if (!variantId) {
          console.warn('Buy now button missing variant ID');
          return;
        }
        
        // Disable button during request
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = 'Adding...';
        
        try {
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: variantId,
              quantity: 1
            })
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.description || 'Failed to add item to cart');
          }
          
          // Optimistic UI update - update cart count
          this.#updateCartCount();
          
          // Redirect to checkout
          window.location.href = '/checkout';
          
        } catch (error) {
          console.error('Error adding to cart:', error);
          button.disabled = false;
          button.textContent = originalText;
          alert('Failed to add item to cart. Please try again.');
        }
      });
    }
  }

  #initCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;

    const overlay = drawer.querySelector('[data-cart-drawer-overlay]');
    const closeBtn = drawer.querySelector('[data-cart-drawer-close]');
    const closeButtons = drawer.querySelectorAll('[data-cart-drawer-close]');

    // Close drawer handlers
    const closeDrawer = () => {
      drawer.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    if (overlay) {
      overlay.addEventListener('click', closeDrawer);
    }

    for (const btn of closeButtons) {
      btn.addEventListener('click', closeDrawer);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    // Handle cart icon click in header (only if it links to cart)
    const cartIcon = document.querySelector('.header__cart');
    if (cartIcon) {
      const href = cartIcon.getAttribute('href');
      // Only intercept if it's a cart link
      if (href && href.includes('/cart')) {
        cartIcon.addEventListener('click', (e) => {
          e.preventDefault();
          this.#openCartDrawer();
          this.#refreshCartDrawer();
        });
      }
    }
  }

  #openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
      drawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  #closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
      drawer.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  #formatMoney(cents) {
    if (typeof cents !== 'number' || isNaN(cents)) {
      return '$0.00';
    }
    const isNegative = cents < 0;
    const absCents = Math.abs(cents);
    const dollars = absCents / 100;
    const formatted = dollars.toFixed(2);
    return isNegative ? `-$${formatted}` : `$${formatted}`;
  }

  async #refreshCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;

    const loadingEl = drawer.querySelector('[data-cart-drawer-loading]');
    const emptyEl = drawer.querySelector('[data-cart-drawer-empty]');
    const itemsEl = drawer.querySelector('[data-cart-drawer-items]');
    const itemsListEl = drawer.querySelector('[data-cart-drawer-items-list]');
    const subtotalEl = drawer.querySelector('[data-cart-drawer-subtotal]');
    const totalEl = drawer.querySelector('[data-cart-drawer-total]');

    // Show loading
    if (loadingEl) loadingEl.style.display = 'flex';
    if (emptyEl) emptyEl.style.display = 'none';
    if (itemsEl) itemsEl.style.display = 'none';

    try {
      const response = await fetch('/cart.js');
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      const cart = await response.json();

      // Hide loading
      if (loadingEl) loadingEl.style.display = 'none';

      if (!cart.items || cart.items.length === 0) {
        // Show empty state
        if (emptyEl) emptyEl.style.display = 'flex';
        if (itemsEl) itemsEl.style.display = 'none';
        return;
      }

      // Show items
      if (emptyEl) emptyEl.style.display = 'none';
      if (itemsEl) itemsEl.style.display = 'flex';

      // Update summary
      if (subtotalEl) {
        subtotalEl.textContent = this.#formatMoney(cart.items_subtotal_price);
      }
      if (totalEl) {
        totalEl.textContent = this.#formatMoney(cart.total_price);
      }

      // Render cart items
      if (itemsListEl) {
        itemsListEl.innerHTML = '';
        for (const item of cart.items) {
          const itemEl = this.#createCartDrawerItem(item);
          itemsListEl.appendChild(itemEl);
        }
      }

      // Attach event listeners to quantity controls
      this.#attachCartDrawerItemListeners();

    } catch (error) {
      console.error('Error refreshing cart drawer:', error);
      if (loadingEl) loadingEl.style.display = 'none';
      if (emptyEl) emptyEl.style.display = 'flex';
      if (itemsEl) itemsEl.style.display = 'none';
    }
  }

  #createCartDrawerItem(item) {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-drawer-item';
    itemEl.setAttribute('data-line-item', item.key);

    // Get image URL - Shopify cart API returns full URL, transform to smaller size
    let imageUrl = '';
    if (item.image) {
      // Try to transform Shopify image URL to 150x150
      imageUrl = item.image.replace(/(\.(jpg|jpeg|png|gif|webp))(\?.*)?$/i, '_150x150$1');
    }
    const variantTitle = item.variant_title && item.variant_title !== 'Default Title' ? item.variant_title : '';

    itemEl.innerHTML = `
      <div class="cart-drawer-item__image">
        ${imageUrl ? `<img src="${imageUrl}" alt="${item.title}" loading="lazy">` : '<div class="cart-drawer-item__placeholder"></div>'}
      </div>
      <div class="cart-drawer-item__details">
        <h3 class="cart-drawer-item__title">
          <a href="${item.url}">${item.product_title}</a>
        </h3>
        ${variantTitle ? `<p class="cart-drawer-item__variant">${variantTitle}</p>` : ''}
        <div class="cart-drawer-item__price">${this.#formatMoney(item.final_price)}</div>
        <div class="cart-drawer-item__quantity">
          <button type="button" class="cart-drawer-item__quantity-btn" data-decrease-quantity data-key="${item.key}" aria-label="Decrease quantity">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 6H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          <input type="number" class="cart-drawer-item__quantity-input" value="${item.quantity}" min="0" data-key="${item.key}" data-line-item-key="${item.key}">
          <button type="button" class="cart-drawer-item__quantity-btn" data-increase-quantity data-key="${item.key}" aria-label="Increase quantity">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 2V10M2 6H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <button type="button" class="cart-drawer-item__remove" data-remove-item data-key="${item.key}" aria-label="Remove ${item.product_title}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `;

    return itemEl;
  }

  #attachCartDrawerItemListeners() {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;

    // Quantity increase/decrease buttons
    const quantityButtons = drawer.querySelectorAll('[data-increase-quantity], [data-decrease-quantity]');
    for (const button of quantityButtons) {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        const key = button.getAttribute('data-key');
        const input = drawer.querySelector(`input[data-key="${key}"]`);
        if (!input) return;

        const currentValue = parseInt(input.value, 10) || 0;
        const isIncrease = button.hasAttribute('data-increase-quantity');
        const newValue = isIncrease ? currentValue + 1 : Math.max(0, currentValue - 1);

        if (newValue === currentValue) return;

        input.value = newValue;
        button.disabled = true;

        try {
          await this.#updateCartItem(key, newValue);
          await this.#refreshCartDrawer();
          this.#updateCartCount();
        } catch (error) {
          input.value = currentValue;
          alert('Failed to update cart. Please try again.');
        } finally {
          button.disabled = false;
        }
      });
    }

    // Quantity input changes
    const quantityInputs = drawer.querySelectorAll('.cart-drawer-item__quantity-input');
    for (const input of quantityInputs) {
      let originalValue = parseInt(input.value, 10) || 0;

      input.addEventListener('change', async () => {
        let newValue = parseInt(input.value, 10);
        if (isNaN(newValue) || newValue < 0) {
          newValue = 0;
          input.value = 0;
        }

        if (newValue === originalValue) return;

        const previousValue = originalValue;
        originalValue = newValue;
        input.disabled = true;

        try {
          await this.#updateCartItem(input.getAttribute('data-key'), newValue);
          await this.#refreshCartDrawer();
          this.#updateCartCount();
        } catch (error) {
          input.value = previousValue;
          originalValue = previousValue;
          alert('Failed to update cart. Please try again.');
        } finally {
          input.disabled = false;
        }
      });
    }

    // Remove item buttons
    const removeButtons = drawer.querySelectorAll('[data-remove-item]');
    for (const button of removeButtons) {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        const key = button.getAttribute('data-key');
        const itemRow = drawer.querySelector(`[data-line-item="${key}"]`);

        if (itemRow) {
          itemRow.style.opacity = '0.5';
        }
        button.disabled = true;

        try {
          await this.#updateCartItem(key, 0);
          await this.#refreshCartDrawer();
          this.#updateCartCount();
        } catch (error) {
          if (itemRow) {
            itemRow.style.opacity = '1';
          }
          alert('Failed to remove item. Please try again.');
        } finally {
          button.disabled = false;
        }
      });
    }
  }

  async #updateCartItem(key, quantity) {
    const updates = {};
    updates[key] = quantity;

    const response = await fetch('/cart/update.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updates })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.description || 'Failed to update cart');
    }

    return response.json();
  }

  #updateCartCount() {
    // Fetch current cart and update cart count display
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        const cartCount = cart.item_count || 0;
        const cartCountElements = document.querySelectorAll('[data-cart-count]');
        
        for (const element of cartCountElements) {
          element.textContent = cartCount;
        }
        
        // Dispatch custom event for other components
        document.dispatchEvent(new CustomEvent('cart:updated', {
          detail: { cart }
        }));

        // Refresh cart drawer if it's open
        const drawer = document.getElementById('cart-drawer');
        if (drawer && drawer.classList.contains('is-open')) {
          // Call refresh without awaiting to avoid blocking
          this.#refreshCartDrawer().catch(err => console.error('Error refreshing cart drawer:', err));
        }
      })
      .catch(error => {
        console.error('Error fetching cart:', error);
      });
  }

  #showCartNotification(message) {
    // Simple notification - can be enhanced with a toast component
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-blue, #3B68AC);
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 10000;
      font-family: var(--font-body, sans-serif);
      font-size: 14px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  }

  #initFaqTabs() {
    const faqSections = document.querySelectorAll('.faq');
    
    for (const section of faqSections) {
      const tabs = section.querySelectorAll('.faq__tab');
      const faqItemContainers = section.querySelectorAll('[data-tab-id]');
      
      if (tabs.length === 0) continue;
      
      const filterFaqItems = (tabId) => {
        let hasVisibleItems = false;
        
        for (const container of faqItemContainers) {
          const containerTabId = container.getAttribute('data-tab-id');
          
          if (containerTabId === tabId) {
            container.style.display = '';
            hasVisibleItems = true;
          } else {
            container.style.display = 'none';
          }
        }
        
        // If no items match and we have default tabs, show all items with 'general' or no tab
        if (!hasVisibleItems && (tabId === 'general' || !tabId)) {
          for (const container of faqItemContainers) {
            const containerTabId = container.getAttribute('data-tab-id');
            if (!containerTabId || containerTabId === 'general') {
              container.style.display = '';
            }
          }
        }
      };
      
      for (const tab of tabs) {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          
          const tabId = tab.getAttribute('data-tab-id');
          if (!tabId) return;
          
          // Remove active class from all tabs
          for (const t of tabs) {
            t.classList.remove('active');
          }
          
          // Add active class to clicked tab
          tab.classList.add('active');
          
          // Filter FAQ items based on tab
          filterFaqItems(tabId);
        });
      }
      
      // Initialize: show items for the first active tab
      const activeTab = section.querySelector('.faq__tab.active');
      if (activeTab) {
        const activeTabId = activeTab.getAttribute('data-tab-id');
        if (activeTabId) {
          filterFaqItems(activeTabId);
        }
      } else if (tabs.length > 0) {
        // If no tab is active, activate the first one
        const firstTab = tabs[0];
        firstTab.classList.add('active');
        const firstTabId = firstTab.getAttribute('data-tab-id');
        if (firstTabId) {
          filterFaqItems(firstTabId);
        }
      }
    }
  }

  #initMegaMenu() {
    const megaMenu = document.querySelector('[data-mega-menu]');
    if (!megaMenu) return;

    // Desktop: Hover-based dropdowns
    const dropdownItems = megaMenu.querySelectorAll('[data-mega-dropdown]');
    
    for (const item of dropdownItems) {
      let hoverTimeout;
      
      item.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        // Close other dropdowns
        for (const other of dropdownItems) {
          if (other !== item) {
            other.classList.remove('is-active');
            const link = other.querySelector('.mega-menu__link');
            if (link) link.setAttribute('aria-expanded', 'false');
          }
        }
        item.classList.add('is-active');
        const link = item.querySelector('.mega-menu__link');
        if (link) link.setAttribute('aria-expanded', 'true');
      });
      
      item.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(() => {
          item.classList.remove('is-active');
          const link = item.querySelector('.mega-menu__link');
          if (link) link.setAttribute('aria-expanded', 'false');
        }, 150);
      });
      
      // Keep dropdown open when hovering over it
      const dropdown = item.querySelector('[data-dropdown-panel]');
      if (dropdown) {
        dropdown.addEventListener('mouseenter', () => {
          clearTimeout(hoverTimeout);
        });
        
        dropdown.addEventListener('mouseleave', () => {
          hoverTimeout = setTimeout(() => {
            item.classList.remove('is-active');
            const link = item.querySelector('.mega-menu__link');
            if (link) link.setAttribute('aria-expanded', 'false');
          }, 150);
        });
      }
    }

    // Mobile: Menu drawer functionality
    const mobileToggle = megaMenu.querySelector('[data-mobile-menu-toggle]');
    const mobileDrawer = megaMenu.querySelector('[data-mobile-drawer]');
    const mobileClose = megaMenu.querySelector('[data-mobile-menu-close]');
    const overlay = megaMenu.querySelector('[data-mobile-overlay]');

    const openMobileMenu = () => {
      if (mobileToggle) mobileToggle.classList.add('is-active');
      if (mobileDrawer) mobileDrawer.classList.add('is-open');
      if (overlay) overlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    };

    const closeMobileMenu = () => {
      if (mobileToggle) mobileToggle.classList.remove('is-active');
      if (mobileDrawer) mobileDrawer.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-active');
      document.body.style.overflow = '';
    };

    if (mobileToggle) {
      mobileToggle.addEventListener('click', (e) => {
        e.preventDefault();
        if (mobileToggle.classList.contains('is-active')) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });
    }

    if (mobileClose) {
      mobileClose.addEventListener('click', (e) => {
        e.preventDefault();
        closeMobileMenu();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', closeMobileMenu);
    }

    // Mobile submenu expand/collapse
    const expandButtons = megaMenu.querySelectorAll('[data-mobile-expand]');
    
    for (const btn of expandButtons) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const item = btn.closest('.mega-menu__mobile-item');
        const submenu = item?.querySelector('[data-mobile-submenu]');
        
        if (submenu) {
          const isOpen = submenu.classList.contains('is-open');
          
          // Close all other submenus
          const allSubmenus = megaMenu.querySelectorAll('[data-mobile-submenu]');
          const allButtons = megaMenu.querySelectorAll('[data-mobile-expand]');
          
          for (const sub of allSubmenus) {
            sub.classList.remove('is-open');
          }
          for (const button of allButtons) {
            button.classList.remove('is-expanded');
          }
          
          // Toggle current
          if (!isOpen) {
            submenu.classList.add('is-open');
            btn.classList.add('is-expanded');
          }
        }
      });
    }

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer?.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });

    // Close mobile menu on resize to desktop
    window.addEventListener('resize', ThemeUtils.debounce(() => {
      if (window.innerWidth > 992 && mobileDrawer?.classList.contains('is-open')) {
        closeMobileMenu();
      }
    }, 150));
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
