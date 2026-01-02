// Product page functionality
class Product {
  constructor() {
    this.productForm = document.querySelector('[data-product-form]');
    if (!this.productForm) return;

    this.productId = document.querySelector('[data-product-id]')?.getAttribute('data-product-id');
    this.init();
  }

  init() {
    // Variant selection
    this.productForm.querySelectorAll('.product-option__input').forEach(input => {
      input.addEventListener('change', () => this.handleVariantChange());
    });

    // Gallery thumbnails
    document.querySelectorAll('.product-gallery__thumb').forEach(thumb => {
      thumb.addEventListener('click', () => this.handleThumbnailClick(thumb));
    });

    // Initialize with first variant
    this.handleVariantChange();
  }

  handleVariantChange() {
    const selectedOptions = [];
    
    this.productForm.querySelectorAll('.product-option').forEach(option => {
      const selected = option.querySelector('.product-option__input:checked');
      if (selected) {
        selectedOptions.push(selected.value);
      }
    });

    // In a real implementation, you would match selected options to a variant
    // and update price, availability, etc.
    console.log('Selected options:', selectedOptions);
  }

  handleThumbnailClick(thumb) {
    // Remove active class from all thumbnails
    document.querySelectorAll('.product-gallery__thumb').forEach(t => {
      t.classList.remove('product-gallery__thumb--active');
    });

    // Add active class to clicked thumbnail
    thumb.classList.add('product-gallery__thumb--active');

    // Update main image
    const mainImage = document.querySelector('[data-product-image]');
    const thumbImage = thumb.querySelector('img');
    
    if (mainImage && thumbImage) {
      mainImage.src = thumbImage.src.replace('_150x', '_800x');
      mainImage.alt = thumbImage.alt;
    }
  }

  updatePrice(price, comparePrice) {
    const priceElement = document.querySelector('[data-product-price]');
    if (!priceElement) return;

    const currentPrice = priceElement.querySelector('.product-template__price-current');
    const compareElement = priceElement.querySelector('.product-template__price-compare');

    if (currentPrice) {
      currentPrice.textContent = window.theme.formatMoney(price, window.theme.moneyFormat);
    }

    if (comparePrice && comparePrice > price) {
      if (!compareElement) {
        const span = document.createElement('span');
        span.className = 'product-template__price-compare';
        priceElement.prepend(span);
      }
      priceElement.querySelector('.product-template__price-compare').textContent = 
        window.theme.formatMoney(comparePrice, window.theme.moneyFormat);
    } else if (compareElement) {
      compareElement.remove();
    }
  }

  updateAvailability(available) {
    const addButton = this.productForm.querySelector('[data-add-to-cart]');
    if (!addButton) return;

    if (available) {
      addButton.disabled = false;
      addButton.textContent = window.theme.strings.addToCart;
    } else {
      addButton.disabled = true;
      addButton.textContent = window.theme.strings.soldOut;
    }
  }
}

// Initialize product
document.addEventListener('DOMContentLoaded', () => {
  new Product();
});



