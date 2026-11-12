import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { products as fallbackProducts } from '@/data/products';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const ids = searchParams.get('ids');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit'), 10) : undefined;

    let items = [];

    try {
      await connectDB();
      const query = {};

      if (ids) {
        const idList = ids.split(',').map((id) => id.trim()).filter(Boolean);
        const validObjectIds = idList.filter((id) => /^[0-9a-fA-F]{24}$/.test(id));
        const numericIds = idList.map((id) => parseInt(id, 10)).filter((n) => !isNaN(n));

        const orClauses = [];
        if (validObjectIds.length > 0) orClauses.push({ _id: { $in: validObjectIds } });
        if (numericIds.length > 0) orClauses.push({ legacyId: { $in: numericIds } });

        if (orClauses.length > 0) {
          query.$or = orClauses;
        }
      }

      if (category && category !== 'All') {
        if (category === 'New In') query.isNew = true;
        else if (category === 'Sale') query.isSale = true;
        else query.category = category;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      let sortOptions = {};
      if (sort === 'price-low') sortOptions = { finalPrice: 1, price: 1 };
      else if (sort === 'price-high') sortOptions = { finalPrice: -1, price: -1 };
      else if (sort === 'newest') sortOptions = { isNew: -1, createdAt: -1 };

      let q = Product.find(query).sort(sortOptions).lean();
      if (limit) q = q.limit(limit);
      items = await q;

      // If DB has no products, fallback
      if (items.length === 0 && !search && !ids && (!category || category === 'All')) {
        const totalCount = await Product.countDocuments();
        if (totalCount === 0) {
          items = fallbackProducts;
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB query fallback to static products:', dbErr.message);
      items = fallbackProducts;
    }

    if (items === fallbackProducts) {
      let filtered = [...fallbackProducts];
      if (ids) {
        const idList = ids.split(',').map((id) => id.trim());
        filtered = filtered.filter((p) => idList.includes(String(p.id)));
      }
      if (category && category !== 'All') {
        if (category === 'New In') filtered = filtered.filter((p) => p.isNew);
        else if (category === 'Sale') filtered = filtered.filter((p) => p.isSale);
        else filtered = filtered.filter((p) => p.category === category);
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(s) ||
            p.description.toLowerCase().includes(s) ||
            p.tags?.some((t) => t.toLowerCase().includes(s))
        );
      }
      if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
      if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
      if (sort === 'newest') filtered = filtered.filter((p) => p.isNew).concat(filtered.filter((p) => !p.isNew));
      if (limit) filtered = filtered.slice(0, limit);
      items = filtered;
    }

    return NextResponse.json({ success: true, products: items });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
