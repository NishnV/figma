# How to Add Products and Images

This guide explains how to add new products to your MORBEI e-commerce website.

## Method 1: Using Online Images (Current Setup)

### Step 1: Add Product Data
Open `src/data/products.js` and add your product to the appropriate category:

```javascript
{
    id: 'your-product-name',           // Unique ID (lowercase with hyphens)
    name: 'YOUR PRODUCT NAME',         // Display name (UPPERCASE)
    price: 'RS. 5290',                 // Display price
    priceNum: 5290,                    // Numeric price for calculations
    category: 'TOPS',                  // Category name
    images: [                          // Array of image URLs
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'], // Available sizes
    description: 'YOUR PRODUCT DESCRIPTION HERE',
    details: [                         // Product details
        'FABRIC COMPOSITION',
        'CARE INSTRUCTIONS',
        'MADE IN COUNTRY',
        'MODEL INFORMATION'
    ]
}
```

### Step 2: Where to Get Image URLs
- **Unsplash**: https://unsplash.com/ (Free high-quality images)
- **Pexels**: https://www.pexels.com/ (Free stock photos)
- **Your own hosting**: Upload to Imgur, Cloudinary, or similar

---

## Method 2: Using Local Images (Recommended for Production)

### Step 1: Organize Your Images
Create folders in the `public` directory:

```
public/
  products/
    scarlet-top/
      main.jpg
      detail-1.jpg
      detail-2.jpg
    miriam-trousers/
      main.jpg
      side-view.jpg
```

### Step 2: Update Product Data
In `src/data/products.js`, reference local images:

```javascript
{
    id: 'scarlet-top',
    name: 'SCARLET TOP',
    price: 'RS. 4290',
    priceNum: 4290,
    category: 'TOPS',
    images: [
        '/products/scarlet-top/main.jpg',
        '/products/scarlet-top/detail-1.jpg',
        '/products/scarlet-top/detail-2.jpg'
    ],
    // ... rest of product data
}
```

---

## Image Requirements

### Recommended Specifications:
- **Format**: JPG or WebP
- **Aspect Ratio**: 4:5 (e.g., 800x1000px)
- **Resolution**: At least 1200px width for main images
- **File Size**: Under 500KB per image (compress if needed)
- **Background**: Clean, minimal backgrounds work best

### Image Compression Tools:
- TinyPNG: https://tinypng.com/
- Squoosh: https://squoosh.app/
- ImageOptim (Mac): https://imageoptim.com/

---

## Quick Add Example

To add a new dress:

1. **Prepare 3-4 images** of your dress
2. **Upload to** `public/products/elegant-evening-dress/`
3. **Add to products.js**:

```javascript
"DRESSES": [
    // ... existing dresses
    {
        id: 'elegant-evening-dress',
        name: 'ELEGANT EVENING DRESS',
        price: 'RS. 7990',
        priceNum: 7990,
        category: 'DRESSES',
        images: [
            '/products/elegant-evening-dress/front.jpg',
            '/products/elegant-evening-dress/back.jpg',
            '/products/elegant-evening-dress/detail.jpg'
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        description: 'STUNNING EVENING DRESS WITH INTRICATE DETAILING.',
        details: [
            '100% SILK',
            'DRY CLEAN ONLY',
            'MADE IN INDIA',
            'MODEL IS 5\'9" AND WEARING SIZE S'
        ]
    }
]
```

4. **Save and refresh** - Your product will appear automatically!

---

## Categories Available

- `NEW IN` - Latest arrivals
- `DRESSES` - All dress styles
- `TOPS` - Blouses, shirts, tops
- `BOTTOMS` - Trousers, skirts, pants

To add a new category, add it to the `products` object in `products.js`.

---

## Tips

✅ **DO:**
- Use consistent image sizes
- Write compelling descriptions
- Include accurate size information
- Use high-quality images
- Keep product IDs unique and descriptive

❌ **DON'T:**
- Use spaces in product IDs (use hyphens)
- Forget to add both `price` and `priceNum`
- Use very large image files
- Leave empty arrays for images

---

## Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify image paths are correct
3. Ensure product ID is unique
4. Confirm all required fields are filled
