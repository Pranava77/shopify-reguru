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
    
    // Initialize universal search
    this.#initUniversalSearch();
    
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
          
          // Hide all product containers and reset their animation state
          for (const container of productContainers) {
            container.classList.add('hidden');
            container.classList.remove('animating');
            // Reset any inline styles from previous animations
            const cards = container.querySelectorAll('.product-card');
            cards.forEach(card => {
              card.style.animation = '';
              card.style.opacity = '';
              card.style.transform = '';
            });
          }
          
          // Show the target product container - try by handle first, then by index
          let targetContainer = contentContainer.querySelector(`[data-tab-content="${targetHandle}"]`);
          
          // Fallback: if not found by handle, try by index
          if (!targetContainer && tabIndex !== null) {
            targetContainer = contentContainer.querySelector(`[data-tab-index="${tabIndex}"]`);
          }
          
          if (targetContainer) {
            // Remove hidden class first to allow layout
            targetContainer.classList.remove('hidden');
            
            // Force reflow to ensure layout is calculated
            void targetContainer.offsetHeight;
            
            // Add animating class to trigger animations
            targetContainer.classList.add('animating');
            
            // Get all product cards in the target container
            const productCards = targetContainer.querySelectorAll('.product-card');
            
            // Remove animating class after animation completes
            const animationDuration = 600; // Match longest animation delay (0.6s) + duration (0.4s)
            setTimeout(() => {
              targetContainer.classList.remove('animating');
            }, animationDuration);
            
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
    // Handle add to cart buttons - add to cart and redirect
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
          
          // Redirect to cart page
          window.location.href = '/cart';
          
        } catch (error) {
          console.error('Error adding to cart:', error);
          button.disabled = false;
          button.textContent = originalText;
          alert('Failed to add item to cart. Please try again.');
        }
      });
    }
    
    // Handle buy now buttons - add to cart and redirect
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
          
          // Redirect to cart page
          window.location.href = '/cart';
          
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

  #initFaqTabs() {
    const faqSections = document.querySelectorAll('.faq');
    
    for (const section of faqSections) {
      const tabs = section.querySelectorAll('.faq__tab');
      const faqItemContainers = section.querySelectorAll('[data-tab-id]');
      
      if (tabs.length === 0) continue;
      
      const faqContent = section.querySelector('.faq__content');
      
      const filterFaqItems = (tabId) => {
        let hasVisibleItems = false;
        
        // Reset animation state
        if (faqContent) {
          faqContent.removeAttribute('data-animating');
          // Reset any inline styles from previous animations
          for (const container of faqItemContainers) {
            container.style.animation = '';
            container.style.opacity = '';
            container.style.transform = '';
          }
        }
        
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
        
        // Trigger animation for visible items
        if (faqContent) {
          // Force reflow
          void faqContent.offsetHeight;
          faqContent.setAttribute('data-animating', 'true');
          
          // Remove animation attribute after animation completes
          setTimeout(() => {
            faqContent.removeAttribute('data-animating');
            // Reset inline styles
            for (const container of faqItemContainers) {
              if (container.style.display !== 'none') {
                container.style.animation = '';
                container.style.opacity = '';
                container.style.transform = '';
              }
            }
          }, 500);
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

  #initUniversalSearch() {
    const searchInput = document.querySelector('[data-search-input]');
    const searchForm = document.querySelector('[data-search-form]');
    const searchResults = document.querySelector('[data-search-results]');
    const searchResultsContent = document.querySelector('[data-search-results-content]');
    
    if (!searchInput || !searchResults || !searchResultsContent) return;
    
    let searchTimeout;
    let currentSearchQuery = '';
    let selectedIndex = -1;
    let searchResultsData = [];
    let isSearching = false;
    
    // Debounced search function
    const performSearch = async (query) => {
      if (!query || query.trim().length < 2) {
        searchResults.classList.remove('is-visible');
        return;
      }
      
      if (query === currentSearchQuery && searchResultsData.length > 0) {
        displayResults(searchResultsData, query);
        return;
      }
      
      isSearching = true;
      currentSearchQuery = query;
      selectedIndex = -1;
      
      // Show loading state
      searchResultsContent.innerHTML = '<div class="header__search-loading">Searching...</div>';
      searchResults.classList.add('is-visible');
      
      try {
        // Use Shopify's search suggest API
        // Try to get root path from Shopify object or use default
        let root = '/';
        if (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) {
          root = window.Shopify.routes.root;
        } else if (window.Shopify && window.Shopify.routes && window.Shopify.routes.root_url) {
          root = window.Shopify.routes.root_url;
        }
        
        // Remove trailing slash if present
        root = root.replace(/\/$/, '');
        if (!root) root = '';
        
        const searchUrl = `${root}/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=5&resources[options][unavailable_products]=last&resources[options][fields]=title,product_type,variants.title,vendor,image,price&resources[type]=collection&resources[limit]=3&resources[type]=page&resources[limit]=3&resources[type]=article&resources[limit]=3`;
        
        const response = await fetch(searchUrl);
        
        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }
        
        const data = await response.json();
        searchResultsData = data;
        displayResults(data, query);
        
      } catch (error) {
        console.error('Search error:', error);
        searchResultsContent.innerHTML = '<div class="header__search-no-results">Unable to search. Please try again.</div>';
      } finally {
        isSearching = false;
      }
    };
    
    // Display search results
    const displayResults = (data, query) => {
      if (!data || (!data.resources && !data.products)) {
        searchResultsContent.innerHTML = '<div class="header__search-no-results">No results found</div>';
        return;
      }
      
      let html = '';
      let hasResults = false;
      
      // Products
      if (data.resources?.results?.products && data.resources.results.products.length > 0) {
        hasResults = true;
        html += '<div class="header__search-results-group">';
        html += '<div class="header__search-results-title">Products</div>';
        html += '<ul class="header__search-results-list">';
        
        data.resources.results.products.forEach((product, index) => {
          let imageUrl = '';
          if (product.image) {
            imageUrl = product.image;
          } else if (product.featured_image) {
            imageUrl = product.featured_image;
          } else if (product.images && product.images.length > 0) {
            imageUrl = product.images[0];
          }
          
          // Format image URL if needed
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl;
          }
          
          let price = '';
          if (product.price) {
            price = this.#formatPrice(product.price);
          } else if (product.variants && product.variants.length > 0 && product.variants[0].price) {
            price = this.#formatPrice(product.variants[0].price);
          }
          
          const url = product.url || (product.handle ? `/products/${product.handle}` : '#');
          
          html += `
            <li class="header__search-result-item">
              <a href="${url}" class="header__search-result-link" data-result-index="${index}" data-result-type="product">
                ${imageUrl ? `<img src="${imageUrl}" alt="${this.#escapeHtml(product.title || 'Product')}" class="header__search-result-image" loading="lazy" onerror="this.style.display='none'">` : '<div class="header__search-result-image" style="background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #999;">No Image</div>'}
                <div class="header__search-result-info">
                  <div class="header__search-result-title">${this.#highlightText(this.#escapeHtml(product.title || 'Untitled Product'), query)}</div>
                  ${price ? `<div class="header__search-result-price">${price}</div>` : ''}
                </div>
              </a>
            </li>
          `;
        });
        
        html += '</ul></div>';
      }
      
      // Collections
      if (data.resources?.results?.collections && data.resources.results.collections.length > 0) {
        hasResults = true;
        html += '<div class="header__search-results-group">';
        html += '<div class="header__search-results-title">Collections</div>';
        html += '<ul class="header__search-results-list">';
        
        data.resources.results.collections.forEach((collection, index) => {
          const url = collection.url || (collection.handle ? `/collections/${collection.handle}` : '#');
          
          html += `
            <li class="header__search-result-item">
              <a href="${url}" class="header__search-result-link" data-result-index="${index}" data-result-type="collection">
                <div class="header__search-result-info">
                  <div class="header__search-result-title">${this.#highlightText(this.#escapeHtml(collection.title || 'Untitled Collection'), query)}</div>
                  <div class="header__search-result-type">Collection</div>
                </div>
              </a>
            </li>
          `;
        });
        
        html += '</ul></div>';
      }
      
      // Pages
      if (data.resources?.results?.pages && data.resources.results.pages.length > 0) {
        hasResults = true;
        html += '<div class="header__search-results-group">';
        html += '<div class="header__search-results-title">Pages</div>';
        html += '<ul class="header__search-results-list">';
        
        data.resources.results.pages.forEach((page, index) => {
          const url = page.url || (page.handle ? `/pages/${page.handle}` : '#');
          
          html += `
            <li class="header__search-result-item">
              <a href="${url}" class="header__search-result-link" data-result-index="${index}" data-result-type="page">
                <div class="header__search-result-info">
                  <div class="header__search-result-title">${this.#highlightText(this.#escapeHtml(page.title || 'Untitled Page'), query)}</div>
                  <div class="header__search-result-type">Page</div>
                </div>
              </a>
            </li>
          `;
        });
        
        html += '</ul></div>';
      }
      
      // Articles
      if (data.resources?.results?.articles && data.resources.results.articles.length > 0) {
        hasResults = true;
        html += '<div class="header__search-results-group">';
        html += '<div class="header__search-results-title">Articles</div>';
        html += '<ul class="header__search-results-list">';
        
        data.resources.results.articles.forEach((article, index) => {
          let url = article.url;
          if (!url && article.handle) {
            const blogHandle = article.blog || 'news';
            url = `/blogs/${blogHandle}/${article.handle}`;
          }
          if (!url) url = '#';
          
          html += `
            <li class="header__search-result-item">
              <a href="${url}" class="header__search-result-link" data-result-index="${index}" data-result-type="article">
                <div class="header__search-result-info">
                  <div class="header__search-result-title">${this.#highlightText(this.#escapeHtml(article.title || 'Untitled Article'), query)}</div>
                  <div class="header__search-result-type">Article</div>
                </div>
              </a>
            </li>
          `;
        });
        
        html += '</ul></div>';
      }
      
      // Fallback: Try alternative data structure (direct products)
      if (!hasResults && data.products && Array.isArray(data.products) && data.products.length > 0) {
        hasResults = true;
        html += '<div class="header__search-results-group">';
        html += '<div class="header__search-results-title">Products</div>';
        html += '<ul class="header__search-results-list">';
        
        data.products.forEach((product, index) => {
          let imageUrl = product.featured_image || product.images?.[0] || '';
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl;
          }
          
          let price = '';
          if (product.variants?.[0]?.price) {
            price = this.#formatPrice(product.variants[0].price);
          }
          
          const url = product.url || (product.handle ? `/products/${product.handle}` : '#');
          
          html += `
            <li class="header__search-result-item">
              <a href="${url}" class="header__search-result-link" data-result-index="${index}" data-result-type="product">
                ${imageUrl ? `<img src="${imageUrl}" alt="${this.#escapeHtml(product.title || 'Product')}" class="header__search-result-image" loading="lazy" onerror="this.style.display='none'">` : '<div class="header__search-result-image" style="background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #999;">No Image</div>'}
                <div class="header__search-result-info">
                  <div class="header__search-result-title">${this.#highlightText(this.#escapeHtml(product.title || 'Untitled Product'), query)}</div>
                  ${price ? `<div class="header__search-result-price">${price}</div>` : ''}
                </div>
              </a>
            </li>
          `;
        });
        
        html += '</ul></div>';
      }
      
      if (!hasResults) {
        html = '<div class="header__search-no-results">No results found for "' + this.#escapeHtml(query) + '"</div>';
      } else {
        // Add "View all results" footer
        html += `
          <div class="header__search-results-footer">
            <a href="/search?q=${encodeURIComponent(query)}" class="header__search-view-all">View all results</a>
          </div>
        `;
      }
      
      searchResultsContent.innerHTML = html;
      searchResults.classList.add('is-visible');
      
      // Update selected index tracking
      const allLinks = searchResultsContent.querySelectorAll('.header__search-result-link');
      searchResultsData = Array.from(allLinks).map(link => ({
        element: link,
        url: link.href
      }));
    };
    
    // Handle input
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      
      clearTimeout(searchTimeout);
      
      if (query.length < 2) {
        searchResults.classList.remove('is-visible');
        return;
      }
      
      searchTimeout = setTimeout(() => {
        performSearch(query);
      }, 300);
    });
    
    // Handle keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
      const allLinks = searchResultsContent.querySelectorAll('.header__search-result-link');
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, allLinks.length - 1);
        updateSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        updateSelection();
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && allLinks[selectedIndex]) {
          e.preventDefault();
          window.location.href = allLinks[selectedIndex].href;
        } else if (searchInput.value.trim().length > 0) {
          // Submit form normally if no result is selected
          searchForm.submit();
        }
      } else if (e.key === 'Escape') {
        searchResults.classList.remove('is-visible');
        selectedIndex = -1;
      }
    });
    
    const updateSelection = () => {
      const allLinks = searchResultsContent.querySelectorAll('.header__search-result-link');
      allLinks.forEach((link, index) => {
        if (index === selectedIndex) {
          link.classList.add('is-focused');
          link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
          link.classList.remove('is-focused');
        }
      });
    };
    
    // Close results when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.remove('is-visible');
        selectedIndex = -1;
      }
    });
    
    // Handle form submission
    searchForm.addEventListener('submit', (e) => {
      const query = searchInput.value.trim();
      if (query.length === 0) {
        e.preventDefault();
      }
    });
  }
  
  #formatPrice(price) {
    if (typeof price === 'string') {
      price = parseFloat(price) / 100;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }
  
  #escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  #highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${this.#escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
  
  #escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
