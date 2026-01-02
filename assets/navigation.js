// Navigation functionality
class Navigation {
  constructor() {
    this.mobileToggle = document.querySelector('[data-mobile-toggle]');
    this.navigation = document.querySelector('.main-navigation');
    this.init();
  }

  init() {
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.closeMobileMenu();
      }
    });

    // Initialize mega menu dropdowns
    this.initMegaMenus();
  }

  toggleMobileMenu() {
    if (this.navigation) {
      const isOpen = this.navigation.classList.contains('is-open');
      
      if (isOpen) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    }
  }

  openMobileMenu() {
    if (this.navigation) {
      this.navigation.classList.add('is-open');
      this.navigation.style.display = 'block';
      this.mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  closeMobileMenu() {
    if (this.navigation) {
      this.navigation.classList.remove('is-open');
      this.navigation.style.display = '';
      this.mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  initMegaMenus() {
    const menuItems = document.querySelectorAll('.main-navigation__item');
    
    menuItems.forEach(item => {
      const dropdown = item.querySelector('.main-navigation__dropdown');
      if (!dropdown) return;

      // Desktop: show on hover
      item.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
          dropdown.style.opacity = '1';
          dropdown.style.visibility = 'visible';
        }
      });

      item.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) {
          dropdown.style.opacity = '0';
          dropdown.style.visibility = 'hidden';
        }
      });

      // Mobile: show on click
      const link = item.querySelector('.main-navigation__link--button');
      if (link) {
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            const isOpen = dropdown.classList.contains('is-open');
            
            // Close all dropdowns
            document.querySelectorAll('.main-navigation__dropdown').forEach(d => {
              d.classList.remove('is-open');
            });

            // Open clicked dropdown if it was closed
            if (!isOpen) {
              dropdown.classList.add('is-open');
            }
          }
        });
      }
    });
  }
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
});


