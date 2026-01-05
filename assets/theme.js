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
          
          // Update cart count
          this.#updateCartCount();
          
          // Open cart drawer instead of redirecting
          this.#openCartDrawer();
          
          // Reset button
          button.disabled = false;
          button.textContent = originalText;
          
        } catch (error) {
          console.error('Error adding to cart:', error);
          button.disabled = false;
          button.textContent = originalText;
          alert('Failed to add item to cart. Please try again.');
        }
      });
    }
    
    // Handle buy now buttons - add to cart and go to checkout
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
          
          // Update cart count
          this.#updateCartCount();
          
          // Redirect to checkout for Buy Now
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
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer) return;

    const overlay = drawer.querySelector('[data-cart-drawer-overlay]');
    const closeButtons = drawer.querySelectorAll('[data-cart-drawer-close]');
    const loading = drawer.querySelector('[data-cart-drawer-loading]');

    // Close drawer on overlay click
    if (overlay) {
      overlay.addEventListener('click', () => this.#closeCartDrawer());
    }

    // Close drawer on close button click
    for (const btn of closeButtons) {
      btn.addEventListener('click', () => this.#closeCartDrawer());
    }

    // Close drawer on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        this.#closeCartDrawer();
      }
    });

    // Handle quantity buttons
    drawer.addEventListener('click', async (e) => {
      const decreaseBtn = e.target.closest('[data-decrease-qty]');
      const increaseBtn = e.target.closest('[data-increase-qty]');
      const removeBtn = e.target.closest('[data-remove-item]');

      if (decreaseBtn || increaseBtn || removeBtn) {
        e.preventDefault();
        const btn = decreaseBtn || increaseBtn || removeBtn;
        const key = btn.getAttribute('data-key');
        
        if (!key) return;

        const itemEl = btn.closest('[data-cart-drawer-item]');
        const qtyEl = itemEl?.querySelector('[data-qty-value]');
        const currentQty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;

        let newQty;
        if (removeBtn) {
          newQty = 0;
        } else if (decreaseBtn) {
          newQty = Math.max(0, currentQty - 1);
        } else {
          newQty = currentQty + 1;
        }

        await this.#updateCartItem(key, newQty);
      }
    });
  }

  async #updateCartItem(key, quantity) {
    const drawer = document.querySelector('[data-cart-drawer]');
    const loading = drawer?.querySelector('[data-cart-drawer-loading]');

    if (loading) loading.classList.add('is-visible');

    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: key,
          quantity: quantity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update cart');
      }

      // Refresh cart drawer content
      await this.#refreshCartDrawer();
      this.#updateCartCount();

    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Failed to update cart. Please try again.');
    } finally {
      if (loading) loading.classList.remove('is-visible');
    }
  }

  async #refreshCartDrawer() {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer) return;

    try {
      // Fetch updated cart HTML
      const response = await fetch('/?sections=cart-drawer-content');
      
      if (response.ok) {
        const data = await response.json();
        const html = data['cart-drawer-content'];
        
        if (html) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const newContent = doc.querySelector('[data-cart-drawer]');
          
          if (newContent) {
            // Update drawer body
            const currentBody = drawer.querySelector('[data-cart-drawer-body]');
            const newBody = newContent.querySelector('[data-cart-drawer-body]');
            if (currentBody && newBody) {
              currentBody.innerHTML = newBody.innerHTML;
            }

            // Update drawer footer
            const currentFooter = drawer.querySelector('[data-cart-drawer-footer]');
            const newFooter = newContent.querySelector('[data-cart-drawer-footer]');
            if (newFooter) {
              if (currentFooter) {
                currentFooter.innerHTML = newFooter.innerHTML;
              } else {
                // Add footer if it doesn't exist
                const content = drawer.querySelector('.cart-drawer__content');
                if (content) {
                  content.insertAdjacentHTML('beforeend', newFooter.outerHTML);
                }
              }
            } else if (currentFooter) {
              // Remove footer if cart is empty
              currentFooter.remove();
            }

            // Update count
            const newCount = newContent.querySelector('[data-cart-drawer-count]');
            const currentCount = drawer.querySelector('[data-cart-drawer-count]');
            if (currentCount && newCount) {
              currentCount.textContent = newCount.textContent;
            }
          }
        }
      } else {
        // Fallback: fetch cart.js and update manually
        await this.#refreshCartDrawerFromAPI();
      }
    } catch (error) {
      console.error('Error refreshing cart drawer:', error);
      // Fallback: fetch cart.js and update manually
      await this.#refreshCartDrawerFromAPI();
    }
  }

  async #refreshCartDrawerFromAPI() {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer) return;

    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();

      const body = drawer.querySelector('[data-cart-drawer-body]');
      const footer = drawer.querySelector('[data-cart-drawer-footer]');
      const countEl = drawer.querySelector('[data-cart-drawer-count]');

      if (countEl) {
        countEl.textContent = `(${cart.item_count})`;
      }

      if (cart.item_count === 0) {
        // Show empty state
        if (body) {
          body.innerHTML = `
            <div class="cart-drawer__empty" data-cart-drawer-empty>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="2"/>
                <path d="M20 26H44L40 42H24L20 26Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <circle cx="26" cy="48" r="3" stroke="currentColor" stroke-width="2"/>
                <circle cx="38" cy="48" r="3" stroke="currentColor" stroke-width="2"/>
                <path d="M20 26L18 20H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <p class="cart-drawer__empty-title">Your cart is empty</p>
              <p class="cart-drawer__empty-text">Add some items to get started!</p>
              <a href="/collections/all" class="btn btn--blue cart-drawer__empty-btn" data-cart-drawer-close>
                Continue Shopping
              </a>
            </div>
          `;
        }
        if (footer) {
          footer.remove();
        }
      } else {
        // Update items
        if (body) {
          let itemsHTML = '<div class="cart-drawer__items" data-cart-drawer-items>';
          for (const item of cart.items) {
            const hasDiscount = item.original_price !== item.final_price;
            const imageUrl = item.image ? item.image.replace(/(\.[a-z]+)(\?.*)?$/i, '_120x$1') : '';
            
            itemsHTML += `
              <div class="cart-drawer__item" data-cart-drawer-item data-line-key="${item.key}">
                <div class="cart-drawer__item-image">
                  ${item.image ? `<img src="${imageUrl}" alt="${item.title}" width="80" height="80" loading="lazy">` : 
                  `<div class="cart-drawer__item-placeholder"><svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" fill="#D9D9D9"/></svg></div>`}
                </div>
                <div class="cart-drawer__item-details">
                  <a href="${item.url}" class="cart-drawer__item-title">${item.product_title}</a>
                  ${item.variant_title && item.variant_title !== 'Default Title' ? `<p class="cart-drawer__item-variant">${item.variant_title}</p>` : ''}
                  <div class="cart-drawer__item-price">
                    ${hasDiscount ? `<span class="cart-drawer__item-price-original">${this.#formatMoney(item.original_price)}</span>` : ''}
                    <span class="cart-drawer__item-price-final">${this.#formatMoney(item.final_price)}</span>
                  </div>
                  <div class="cart-drawer__item-quantity">
                    <button type="button" class="cart-drawer__qty-btn" data-decrease-qty data-key="${item.key}" aria-label="Decrease quantity">
                      <svg width="10" height="2" viewBox="0 0 10 2" fill="none"><path d="M1 1H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                    </button>
                    <span class="cart-drawer__qty-value" data-qty-value>${item.quantity}</span>
                    <button type="button" class="cart-drawer__qty-btn" data-increase-qty data-key="${item.key}" aria-label="Increase quantity">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1V9M1 5H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                    </button>
                  </div>
                </div>
                <button type="button" class="cart-drawer__item-remove" data-remove-item data-key="${item.key}" aria-label="Remove ${item.product_title}">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                </button>
              </div>
            `;
          }
          itemsHTML += '</div>';
          body.innerHTML = itemsHTML;
        }

        // Update or create footer
        const subtotalHTML = `
          <div class="cart-drawer__footer" data-cart-drawer-footer>
            <div class="cart-drawer__subtotal">
              <span class="cart-drawer__subtotal-label">Subtotal</span>
              <span class="cart-drawer__subtotal-value" data-cart-drawer-subtotal>${this.#formatMoney(cart.total_price)}</span>
            </div>
            <p class="cart-drawer__shipping-note">Shipping & taxes calculated at checkout</p>
            <div class="cart-drawer__actions">
              <a href="/cart" class="btn btn--secondary cart-drawer__view-cart">View Cart</a>
              <a href="/checkout" class="btn btn--blue cart-drawer__checkout">Checkout</a>
            </div>
          </div>
        `;
        
        if (footer) {
          footer.outerHTML = subtotalHTML;
        } else {
          const content = drawer.querySelector('.cart-drawer__content');
          const loading = content?.querySelector('[data-cart-drawer-loading]');
          if (loading) {
            loading.insertAdjacentHTML('beforebegin', subtotalHTML);
          } else if (content) {
            content.insertAdjacentHTML('beforeend', subtotalHTML);
          }
        }
      }
    } catch (error) {
      console.error('Error refreshing cart drawer from API:', error);
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

  #openCartDrawer() {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer) return;

    // Refresh drawer content before opening
    this.#refreshCartDrawerFromAPI().then(() => {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      // Focus the close button
      const closeBtn = drawer.querySelector('[data-cart-drawer-close]');
      if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 100);
      }
    });
  }

  #closeCartDrawer() {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer) return;

    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
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
