import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { products as fallbackProducts, getProductBySlug } from '@/data/products';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    let product = null;
    let related = [];

    try {
      await connectDB();
      // Try finding by slug first, or by _id or legacyId
      if (/^[0-9a-fA-F]{24}$/.test(slug)) {
        product = await Product.findById(slug).lean();
      } else if (!isNaN(parseInt(slug, 10)) && String(parseInt(slug, 10)) === slug) {
        product = await Product.findOne({ legacyId: parseInt(slug, 10) }).lean();
      }

      if (!product) {
        product = await Product.findOne({ slug }).lean();
      }

      if (product) {
        related = await Product.find({
          _id: { $ne: product._id },
          category: product.category,
        })
          .limit(4)
          .lean();

        if (related.length < 4) {
          const extra = await Product.find({
            _id: { $nin: [product._id, ...related.map((r) => r._id)] },
          })
            .limit(4 - related.length)
            .lean();
          related = [...related, ...extra];
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB single product query fallback:', dbErr.message);
    }

    // Fallback if not found in DB
    if (!product) {
      product = getProductBySlug(slug) || fallbackProducts.find((p) => String(p.id) === slug) || fallbackProducts[0];
      related = fallbackProducts.filter((p) => p.slug !== product?.slug && p.id !== product?.id).slice(0, 4);
    }

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product, related });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
