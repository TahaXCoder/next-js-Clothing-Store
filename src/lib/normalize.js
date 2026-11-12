/**
 * Adapter to normalize MongoDB product documents to the shape expected by UI components.
 * This ensures that existing components (ProductCard, ProductPage, Cart, etc.)
 * work seamlessly without having to edit individual field lookups.
 */
export function normalizeProduct(p) {
  if (!p) return null;

  // Extract ID as string for React keys and local storage lookups
  const rawId = p._id ? p._id.toString() : p.id ? String(p.id) : '';

  // Determine paying price and original/strikethrough price
  // In MongoDB: 'price' is list price, 'finalPrice' is discounted checkout price if on sale
  // In old products.js: 'price' was checkout price, 'originalPrice' was strikethrough price
  let payingPrice = p.finalPrice ?? p.price ?? 0;
  let originalPrice = p.originalPrice ?? null;

  if (!originalPrice && p.finalPrice && p.price && p.price > p.finalPrice) {
    originalPrice = p.price;
  }

  const title = p.title || p.name || '';

  return {
    ...p,
    id: rawId,
    _id: rawId,
    title,
    name: title,
    price: payingPrice,
    finalPrice: payingPrice,
    originalPrice: originalPrice,
    category: p.category || 'General',
    description: p.description || '',
    badge: p.badge || null,
    colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : ['#1A1A1A'],
    colorNames: Array.isArray(p.colorNames) && p.colorNames.length > 0 ? p.colorNames : ['Black'],
    sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['M'],
    images: Array.isArray(p.images) ? p.images : [],
    tags: Array.isArray(p.tags) ? p.tags : [],
    inStock: p.inStock !== false,
    isNew: Boolean(p.isNew),
    isSale: Boolean(p.isSale || (originalPrice && originalPrice > payingPrice)),
    slug: p.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  };
}

/**
 * Normalizes an array of product documents
 */
export function normalizeProducts(products) {
  if (!Array.isArray(products)) return [];
  return products.map(normalizeProduct).filter(Boolean);
}
