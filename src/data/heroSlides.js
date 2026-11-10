/**
 * Hero tile slide data.
 *
 * HOW TO CUSTOMISE
 * ─────────────────
 * • Change slide speed  → pass a different `interval` prop to <TileSlider> in HomePage.jsx
 * • Change text        → edit `label` / `title` on each slide object below
 * • Add / remove slides → push / splice objects in womenSlides / saleSlides
 * • Change photos      → update `src` paths (put files in public/images/hero/)
 *
 * Recommended photo spec:
 *   • Format : WebP or JPEG
 *   • Width  : ~1200 px   • Aspect ratio : 3:4 (portrait, tall)
 *   • Size   : ≤ 200 KB each
 */

export const menSlides = [
  {
    src: '/images/hero/men-1.jpg',
    alt: "Men's urban collection – look 1",
    label: 'NEW IN',
    title: "Men's Collection",
    href: '/shop?category=Men',
  },
  {
    src: '/images/hero/men-2.jpg',
    alt: "Men's urban collection – look 2",
    label: 'NEW IN',
    title: "Men's Collection",
    href: '/shop?category=Men',
  },
  {
    src: '/images/hero/men-3.jpg',
    alt: "Men's urban collection – look 3",
    label: 'NEW IN',
    title: "Men's Collection",
    href: '/shop?category=Men',
  },
];

// Alias for backwards compatibility
export const womenSlides = menSlides;

export const saleSlides = [
  {
    src: '/images/hero/sale-1.jpg',
    alt: 'Winter is Coming Sale – look 1',
    label: 'SALE',
    title: 'Flat 30% Off',
    href: '/shop?sale=true',
  },
  {
    src: '/images/hero/sale-2.jpg',
    alt: 'Winter is Coming Sale – look 2',
    label: 'SALE',
    title: 'Flat 30% Off',
    href: '/shop?sale=true',
  },
  {
    src: '/images/hero/sale-3.jpg',
    alt: 'Winter is Coming Sale – look 3',
    label: 'SALE',
    title: 'Flat 30% Off',
    href: '/shop?sale=true',
  },
];

