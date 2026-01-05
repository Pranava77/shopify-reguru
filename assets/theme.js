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
    
    // Initialize cart drawer
    this.#initCartDrawer();
    
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
          
          // Open cart drawer and refresh its contents
          this.#openCartDrawer();
          await this.#refreshCartDrawer();
          
          // Re-enable button
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

  #initCartDrawer() {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer) return;

    const overlay = drawer.querySelector('[data-cart-drawer-overlay]');
    const closeBtn = drawer.querySelector('[data-cart-drawer-close]');
    
    // Close drawer on overlay click
    if (overlay) {
      overlay.addEventListener('click', () => this.#closeCartDrawer());
    }
    
    // Close drawer on close button click
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.#closeCartDrawer());
    }
    
    // Close drawer on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        this.#closeCartDrawer();
      }
    });
    
    // Initialize drawer item interactions
    this.#initCartDrawerItems();
  }

  #initCartDrawerItems() {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer) return;

    // Use event delegation for drawer item interactions
    drawer.addEventListener('click', async (e) => {
      const target = e.target;
      
      // Handle quantity decrease
      const decreaseBtn = target.closest('[data-cart-drawer-decrease]');
      if (decreaseBtn) {
        e.preventDefault();
        const itemKey = decreaseBtn.getAttribute('data-item-key');
        await this.#updateCartDrawerItem(itemKey, -1);
        return;
      }
      
      // Handle quantity increase
      const increaseBtn = target.closest('[data-cart-drawer-increase]');
      if (increaseBtn) {
        e.preventDefault();
        const itemKey = increaseBtn.getAttribute('data-item-key');
        await this.#updateCartDrawerItem(itemKey, 1);
        return;
      }
      
      // Handle item removal
      const removeBtn = target.closest('[data-cart-drawer-remove]');
      if (removeBtn) {
        e.preventDefault();
        const itemKey = removeBtn.getAttribute('data-item-key');
        await this.#removeCartDrawerItem(itemKey);
        return;
      }
    });
  }

  async #updateCartDrawerItem(itemKey, quantityChange) {
    const drawer = document.querySelector('[data-cart-drawer]');
    const itemEl = drawer?.querySelector(`[data-item-key="${itemKey}"]`);
    const quantityEl = itemEl?.querySelector('[data-quantity-value]');
    
    if (!quantityEl) return;
    
    const currentQuantity = parseInt(quantityEl.textContent, 10) || 0;
    const newQuantity = Math.max(0, currentQuantity + quantityChange);
    
    // If quantity becomes 0, remove the item
    if (newQuantity === 0) {
      await this.#removeCartDrawerItem(itemKey);
      return;
    }
    
    // Optimistic UI update
    quantityEl.textContent = newQuantity;
    
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: itemKey,
          quantity: newQuantity
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update cart');
      }
      
      const cart = await response.json();
      this.#updateCartDrawerFromData(cart);
      this.#updateCartCount();
      
    } catch (error) {
      console.error('Error updating cart item:', error);
      // Revert optimistic update
      quantityEl.textContent = currentQuantity;
    }
  }

  async #removeCartDrawerItem(itemKey) {
    const drawer = document.querySelector('[data-cart-drawer]');
    const itemEl = drawer?.querySelector(`[data-item-key="${itemKey}"]`);
    
    if (itemEl) {
      // Fade out animation
      itemEl.style.opacity = '0.5';
      itemEl.style.transition = 'opacity 0.2s';
    }
    
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: itemKey,
          quantity: 0
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove item');
      }
      
      const cart = await response.json();
      
      // Remove item element with animation
      if (itemEl) {
        itemEl.style.height = itemEl.offsetHeight + 'px';
        itemEl.style.overflow = 'hidden';
        requestAnimationFrame(() => {
          itemEl.style.height = '0';
          itemEl.style.padding = '0';
          itemEl.style.margin = '0';
          itemEl.style.transition = 'all 0.3s ease';
          setTimeout(() => itemEl.remove(), 300);
        });
      }
      
      this.#updateCartDrawerFromData(cart);
      this.#updateCartCount();
      
    } catch (error) {
      console.error('Error removing cart item:', error);
      if (itemEl) {
        itemEl.style.opacity = '1';
      }
    }
  }

  #updateCartDrawerFromData(cart) {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer) return;
    
    const subtotalEl = drawer.querySelector('[data-cart-drawer-subtotal]');
    const footerEl = drawer.querySelector('[data-cart-drawer-footer]');
    const emptyEl = drawer.querySelector('[data-cart-drawer-empty]');
    const itemsContainer = drawer.querySelector('[data-cart-drawer-items]');
    
    // Update subtotal
    if (subtotalEl) {
      subtotalEl.textContent = this.#formatMoney(cart.total_price);
    }
    
    // Show/hide footer and empty state
    if (cart.item_count === 0) {
      if (footerEl) footerEl.style.display = 'none';
      if (itemsContainer) itemsContainer.style.display = 'none';
      if (emptyEl) emptyEl.style.display = 'flex';
    } else {
      if (footerEl) footerEl.style.display = '';
      if (itemsContainer) itemsContainer.style.display = '';
      if (emptyEl) emptyEl.style.display = 'none';
    }
    
    // Update individual item totals
    for (const item of cart.items) {
      const itemEl = drawer.querySelector(`[data-item-key="${item.key}"]`);
      if (itemEl) {
        const lineTotalEl = itemEl.querySelector('[data-line-total]');
        const quantityEl = itemEl.querySelector('[data-quantity-value]');
        
        if (lineTotalEl) {
          lineTotalEl.textContent = this.#formatMoney(item.final_line_price);
        }
        if (quantityEl) {
          quantityEl.textContent = item.quantity;
        }
      }
    }
  }

  async #refreshCartDrawer() {
    try {
      // Fetch the cart drawer section HTML from the server
      const response = await fetch('/?section_id=cart-drawer-content');
      
      if (response.ok) {
        const html = await response.text();
        const drawer = document.querySelector('[data-cart-drawer]');
        const content = drawer?.querySelector('[data-cart-drawer-content]');
        const footer = drawer?.querySelector('[data-cart-drawer-footer]');
        
        if (content) {
          // Create a temporary container to parse the HTML
          const temp = document.createElement('div');
          temp.innerHTML = html;
          
          // Extract the items and update
          const newItems = temp.querySelector('[data-cart-drawer-items]');
          const newEmpty = temp.querySelector('[data-cart-drawer-empty]');
          const newSubtotal = temp.querySelector('[data-cart-drawer-subtotal]');
          
          const existingItems = content.querySelector('[data-cart-drawer-items]');
          const existingEmpty = content.querySelector('[data-cart-drawer-empty]');
          
          if (newItems && existingItems) {
            existingItems.innerHTML = newItems.innerHTML;
            existingItems.style.display = '';
            if (existingEmpty) existingEmpty.style.display = 'none';
            if (footer) footer.style.display = '';
          } else if (newEmpty) {
            if (existingItems) existingItems.style.display = 'none';
            if (existingEmpty) {
              existingEmpty.style.display = 'flex';
            }
            if (footer) footer.style.display = 'none';
          }
          
          if (newSubtotal) {
            const subtotalEl = drawer?.querySelector('[data-cart-drawer-subtotal]');
            if (subtotalEl) {
              subtotalEl.textContent = newSubtotal.textContent;
            }
          }
        }
      } else {
        // Fallback: fetch cart JSON and update values
        const cartResponse = await fetch('/cart.js');
        if (cartResponse.ok) {
          const cart = await cartResponse.json();
          this.#updateCartDrawerFromData(cart);
        }
      }
    } catch (error) {
      console.error('Error refreshing cart drawer:', error);
      // Fallback: update from cart JSON
      try {
        const cartResponse = await fetch('/cart.js');
        if (cartResponse.ok) {
          const cart = await cartResponse.json();
          this.#updateCartDrawerFromData(cart);
        }
      } catch (e) {
        console.error('Fallback cart refresh failed:', e);
      }
    }
  }

  #openCartDrawer() {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer) return;
    
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus the close button for accessibility
    const closeBtn = drawer.querySelector('[data-cart-drawer-close]');
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 100);
    }
  }

  #closeCartDrawer() {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer) return;
    
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  #formatMoney(cents) {
    if (typeof cents !== 'number' || isNaN(cents)) {
      return '$0.00';
    }
    const dollars = cents / 100;
    return '$' + dollars.toFixed(2);
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
