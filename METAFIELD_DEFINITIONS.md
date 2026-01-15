# Metafield Definitions for Filter Options

This document outlines the metafield definitions that need to be created in your Shopify Admin to enable filtering functionality.

## How to Create Metafield Definitions

1. Go to **Settings** > **Custom data** > **Products** in your Shopify Admin
2. Click **Add definition**
3. Create each metafield definition as specified below

## Required Metafield Definitions

### 1. Screen Size (for Laptops/Devices)
- **Name**: Screen Size
- **Namespace and key**: `custom.screen_size`
- **Type**: Single line text field
- **Description**: Screen size of the device (e.g., "13 inch", "15 inch", "17 inch")
- **Filtering**: ✅ Enable filtering
- **Validation**: Optional - you can add validation rules

### 2. RAM (Memory)
- **Name**: RAM
- **Namespace and key**: `custom.ram`
- **Type**: Single line text field
- **Description**: RAM capacity (e.g., "8GB", "16GB", "32GB")
- **Filtering**: ✅ Enable filtering

### 3. Operating System
- **Name**: Operating System
- **Namespace and key**: `custom.operating_system`
- **Type**: Single line text field
- **Description**: Operating system (e.g., "Windows 11", "macOS", "Linux")
- **Filtering**: ✅ Enable filtering

### 4. Internal Memory Type
- **Name**: Internal Memory Type
- **Namespace and key**: `custom.memory_type`
- **Type**: Single line text field
- **Description**: Type of internal storage (e.g., "SSD", "HDD", "NVMe SSD")
- **Filtering**: ✅ Enable filtering

### 5. Image Refresh Rate
- **Name**: Image Refresh Rate
- **Namespace and key**: `custom.refresh_rate`
- **Type**: Single line text field
- **Description**: Display refresh rate (e.g., "60Hz", "120Hz", "144Hz")
- **Filtering**: ✅ Enable filtering

### 6. Product Category
- **Name**: Product Category
- **Namespace and key**: `custom.category`
- **Type**: Single line text field
- **Description**: Product category (e.g., "Laptops", "Mobile & Tablets", "Television", "Headphones")
- **Filtering**: ✅ Enable filtering

### 7. Brand (Alternative to Vendor)
- **Name**: Brand
- **Namespace and key**: `custom.brand`
- **Type**: Single line text field
- **Description**: Product brand name (e.g., "Lenovo", "Asus", "HP", "Macbook")
- **Filtering**: ✅ Enable filtering

## Alternative: Using List Metafields

If you want to support multiple values per product, you can use **List of single line text fields** instead:

- **Type**: List of single line text fields
- This allows products to have multiple values (e.g., a laptop can be both "Gaming" and "Business" category)

## Important Notes

1. **Filtering Must Be Enabled**: For each metafield definition, make sure to check "Use for filtering" or "Enable filtering" option. This is critical for the filters to work.

2. **Namespace and Key**: The namespace `custom` is recommended for theme-level metafields. The key should match exactly what's used in the theme code.

3. **Value Formatting**: Keep values consistent. For example, always use "GB" for RAM (not "gb" or "Gb").

4. **Backward Compatibility**: The theme code supports both:
   - Metafield-based filtering (new, recommended)
   - Product options/tags/vendor filtering (existing, fallback)

## Setting Metafield Values on Products

After creating the definitions:

1. Go to any product in your Shopify Admin
2. Scroll to the **Metafields** section
3. Fill in the values for each metafield
4. Save the product

## Bulk Import Metafields

For bulk operations, you can:
- Use the Shopify Admin bulk editor
- Use the Shopify API
- Use apps like Excelify or Matrixify

## Testing

After setting up metafields:
1. Ensure at least a few products have metafield values set
2. Test the filters on your collection pages
3. Verify that products filter correctly based on metafield values
