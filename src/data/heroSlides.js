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

export const womenSlides = [
  {
    src: '/images/hero/women-1.jpg',
    alt: "Women's urban collection – look 1",
    label: 'NEW IN',
    title: "Women's Collection",
    href: '/shop?category=Women',
  },
  {
    src: '/images/hero/women-2.jpg',
    alt: "Women's urban collection – look 2",
    label: 'NEW IN',
    title: "Women's Collection",
    href: '/shop?category=Women',
  },
  {
    src: '/images/hero/women-3.jpg',
    alt: "Women's urban collection – look 3",
    label: 'NEW IN',
    title: "Women's Collection",
    href: '/shop?category=Women',
  },
];

export const saleSlides = [
  {
    src: '/images/hero/sale-1.jpg',
    alt: 'Sale collection – look 1',
    label: 'SALE',
    title: 'Up to 30% Off',
    href: '/shop?sale=true',
  },
  {
    src: '/images/hero/sale-2.jpg',
    alt: 'Sale collection – look 2',
    label: 'SALE',
    title: 'Up to 30% Off',
    href: '/shop?sale=true',
  },
  {
    src: '/images/hero/sale-3.jpg',
    alt: 'Sale collection – look 3',
    label: 'SALE',
    title: 'Up to 30% Off',
    href: '/shop?sale=true',
  },
];
