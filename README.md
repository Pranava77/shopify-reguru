# Reguru Shopify Theme

A custom Shopify theme for Reguru, a refurbished electronics retailer.

## Features

- **Online Store 2.0** - Built with Shopify's latest theme architecture
- **Fully Responsive** - Mobile-first design that works on all devices
- **Interactive Components** - FAQ accordions, testimonial carousels, product tabs
- **Cart Drawer** - Side drawer cart with AJAX functionality
- **Product Filtering** - Collection page with sorting and filtering
- **Wishlist** - Local storage-based wishlist functionality
- **Customizable** - Extensive theme settings in the admin panel

## Theme Structure

```
shopify-reguru/
├── assets/          # CSS, JavaScript, and images
├── blocks/          # Reusable theme blocks
├── config/          # Theme configuration files
├── layout/          # Base theme layout
├── locales/         # Translation files
├── sections/        # Page sections
├── snippets/        # Reusable code snippets
└── templates/       # Page templates
```

## Installation

1. **Upload to Shopify**:
   - Zip the theme folder
   - Go to Shopify Admin > Online Store > Themes
   - Click "Upload theme" and select the zip file

2. **Configure Settings**:
   - Go to Theme Settings (Customize)
   - Upload your logo
   - Set brand colors
   - Configure social media links
   - Set store location

3. **Setup Navigation**:
   - Create navigation menus in Navigation settings
   - Assign menus to header and footer sections

4. **Add Content**:
   - Create collections for product categories
   - Add products with images and descriptions
   - Create pages (About, Contact, etc.)

## Customization

### Colors
Navigate to Theme Settings > Colors to customize:
- Primary color
- Accent color
- Background color
- Text colors

### Typography
Configure fonts in Theme Settings > Typography

### Header
- Upload logo
- Enable/disable sticky header
- Set store location

### Footer
- Add social media links
- Set footer address
- Configure footer menus

## Sections

### Homepage Sections
- **Announcement Bar** - Top notification bar
- **Hero Banner** - Large featured product banner
- **Category Icons** - Feature highlights grid
- **Featured Products** - Product showcase with tabs
- **About Us** - Company information
- **Testimonials** - Customer reviews carousel
- **FAQ** - Accordion-style FAQ section

### Template Sections
- **Product Template** - Product detail page with gallery
- **Collection Template** - Product listing with sorting
- **Cart Template** - Shopping cart page

## JavaScript Functionality

The theme includes several JavaScript modules:

- `theme.js` - Core functionality and sticky header
- `components.js` - FAQ accordion, testimonials carousel, tabs, wishlist
- `cart.js` - Add to cart, cart drawer, quantity updates
- `product.js` - Variant selection, image gallery
- `collection.js` - Product sorting
- `navigation.js` - Mobile menu, mega menu dropdowns

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

The theme is optimized for performance:
- Lazy loading images
- Deferred JavaScript loading
- Optimized CSS
- Shopify CDN for assets

## Support

For support or customization requests, please contact the development team.

## License

Proprietary - All rights reserved by Reguru

## Version

1.0.0



