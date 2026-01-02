// Collection page functionality
class Collection {
  constructor() {
    this.sortSelect = document.querySelector('[data-sort-by]');
    if (!this.sortSelect) return;

    this.init();
  }

  init() {
    this.sortSelect.addEventListener('change', () => this.handleSort());

    // Set current sort from URL
    const params = new URLSearchParams(window.location.search);
    const currentSort = params.get('sort_by');
    if (currentSort) {
      this.sortSelect.value = currentSort;
    }
  }

  handleSort() {
    const sortValue = this.sortSelect.value;
    const url = new URL(window.location);
    
    if (sortValue === 'manual') {
      url.searchParams.delete('sort_by');
    } else {
      url.searchParams.set('sort_by', sortValue);
    }

    window.location.href = url.toString();
  }
}

// Initialize collection
document.addEventListener('DOMContentLoaded', () => {
  new Collection();
});



