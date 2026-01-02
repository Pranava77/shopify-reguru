// Cart functionality
class Cart {
  constructor() {
    this.init();
  }

  init() {
    // Add to cart buttons
    document.addEventListener('click', (e) => {
      const addButton = e.target.closest('[data-add-to-cart]');
      if (addButton) {
        e.preventDefault();
        this.addToCart(addButton);
      }

      const removeButton = e.target.closest('[data-cart-remove]');
      if (removeButton) {
        e.preventDefault();
        this.removeFromCart(removeButton);
      }
    });

    // Quantity changes
    document.addEventListener('change', (e) => {
      const quantityInput = e.target.closest('[data-quantity-input]');
      if (quantityInput && quantityInput.closest('[data-cart-item]')) {
        this.updateQuantity(quantityInput);
      }
    });
  }

  async addToCart(button) {
    const form = button.closest('form');
    if (!form) return;

    button.classList.add('loading');
    button.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(window.theme.routes.cart_add_url, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        this.updateCartCount();
        this.showCartDrawer();
        this.showNotification('Product added to cart!');
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      this.showNotification('Failed to add to cart', 'error');
    } finally {
      button.classList.remove('loading');
      button.disabled = false;
    }
  }

  async removeFromCart(button) {
    const item = button.closest('[data-cart-item]');
    if (!item) return;

    const key = item.getAttribute('data-line-item-key');
    
    try {
      const response = await fetch(window.theme.routes.cart_change_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: key,
          quantity: 0
        })
      });

      if (response.ok) {
        item.remove();
        this.updateCartCount();
        this.updateCartTotal();
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
    }
  }

  async updateQuantity(input) {
    const item = input.closest('[data-cart-item]');
    if (!item) return;

    const key = item.getAttribute('data-line-item-key');
    const quantity = parseInt(input.value);

    if (quantity < 1) {
      this.removeFromCart(item.querySelector('[data-cart-remove]'));
      return;
    }

    try {
      const response = await fetch(window.theme.routes.cart_change_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: key,
          quantity: quantity
        })
      });

      if (response.ok) {
        this.updateCartTotal();
      }
    } catch (error) {
      console.error('Update quantity error:', error);
    }
  }

  async updateCartCount() {
    try {
      const response = await fetch(window.theme.routes.cart_url + '.js');
      const cart = await response.json();
      
      document.querySelectorAll('[data-cart-count]').forEach(element => {
        element.textContent = cart.item_count;
      });
    } catch (error) {
      console.error('Update cart count error:', error);
    }
  }

  async updateCartTotal() {
    try {
      const response = await fetch(window.theme.routes.cart_url + '.js');
      const cart = await response.json();
      
      document.querySelectorAll('[data-cart-total], [data-cart-subtotal]').forEach(element => {
        element.textContent = window.theme.formatMoney(cart.total_price, window.theme.moneyFormat);
      });
    } catch (error) {
      console.error('Update cart total error:', error);
    }
  }

  showCartDrawer() {
    const drawer = document.getElementById('CartDrawer');
    if (drawer) {
      const event = new CustomEvent('cart:open');
      window.dispatchEvent(event);
      
      const toggleButton = document.querySelector('[data-cart-toggle]');
      if (toggleButton) {
        toggleButton.click();
      }
    }
  }

  showNotification(message, type = 'success') {
    // Simple notification - you could enhance this
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${type === 'error' ? '#EF4444' : '#10B981'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize cart
document.addEventListener('DOMContentLoaded', () => {
  new Cart();
});



