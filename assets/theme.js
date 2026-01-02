// Main Theme JavaScript
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
});

function initTheme() {
  // Initialize sticky header
  initStickyHeader();
  
  // Initialize cart
  if (window.theme.cartType === 'drawer') {
    initCartDrawer();
  }
}

function initStickyHeader() {
  const header = document.getElementById('Header');
  if (!header || !header.classList.contains('header--sticky')) return;

  let lastScrollTop = 0;
  const headerHeight = header.offsetHeight;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > headerHeight) {
      if (scrollTop > lastScrollTop) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
    }

    lastScrollTop = scrollTop;
  });
}

function initCartDrawer() {
  const cartDrawer = document.getElementById('CartDrawer');
  if (!cartDrawer) return;

  const toggleButtons = document.querySelectorAll('[data-cart-toggle]');
  const overlay = cartDrawer.querySelector('[data-cart-overlay]');
  const closeButton = cartDrawer.querySelector('[data-cart-close]');

  const openDrawer = () => {
    cartDrawer.setAttribute('data-open', '');
    cartDrawer.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    cartDrawer.removeAttribute('data-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      cartDrawer.hidden = true;
    }, 300);
  };

  toggleButtons.forEach(button => {
    button.addEventListener('click', openDrawer);
  });

  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }

  if (closeButton) {
    closeButton.addEventListener('click', closeDrawer);
  }
}

// Utility functions
window.theme = window.theme || {};

window.theme.formatMoney = (cents, format) => {
  if (typeof cents === 'string') {
    cents = cents.replace('.', '');
  }
  let value = '';
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  const formatString = format || window.theme.moneyFormat;

  const formatWithDelimiters = (number, precision, thousands, decimal) => {
    precision = precision || 2;
    thousands = thousands || ',';
    decimal = decimal || '.';

    if (isNaN(number) || number === null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);

    const parts = number.split('.');
    const dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
    const centsAmount = parts[1] ? decimal + parts[1] : '';

    return dollarsAmount + centsAmount;
  };

  switch (formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};



