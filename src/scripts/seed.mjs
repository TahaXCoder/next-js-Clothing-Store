import mongoose from 'mongoose';
import dns from 'dns';
import { products } from '../data/products.js';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zipup';

const ImageSchema = new mongoose.Schema(
  {
    color: { type: String, default: '' },
    label: { type: String, default: '' },
    url: { type: String, default: '' },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    legacyId: { type: Number, index: true },
    name: { type: String, required: true },
    title: { type: String },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    finalPrice: { type: Number },
    originalPrice: { type: Number, default: null },
    description: { type: String, default: '' },
    badge: { type: String, default: null },
    colors: [{ type: String }],
    colorNames: [{ type: String }],
    sizes: [{ type: String }],
    images: [ImageSchema],
    tags: [{ type: String }],
    inStock: { type: Boolean, default: true },
    isNew: { type: Boolean, default: false },
    isSale: { type: Boolean, default: false },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function seed() {
  console.log(`Connecting to MongoDB at: ${MONGODB_URI.replace(/\/\/.*@/, '//<credentials>@')}...`);
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected to MongoDB successfully.');

  let insertedOrUpdated = 0;

  for (const item of products) {
    const listPrice = item.originalPrice || item.price;
    const finalPrice = item.price;

    const doc = {
      legacyId: item.id,
      name: item.title,
      title: item.title,
      slug: item.slug,
      category: item.category,
      price: listPrice,
      finalPrice: finalPrice,
      originalPrice: item.originalPrice || null,
      description: item.description,
      badge: item.badge,
      colors: item.colors,
      colorNames: item.colorNames,
      sizes: item.sizes,
      images: item.images,
      tags: item.tags,
      inStock: item.inStock !== false,
      isNew: Boolean(item.isNew),
      isSale: Boolean(item.isSale),
    };

    await Product.findOneAndUpdate({ slug: item.slug }, doc, { upsert: true, new: true });
    insertedOrUpdated++;
    console.log(`✓ Upserted product: [${item.id}] ${item.title} (${item.slug})`);
  }

  console.log(`\nDone! Successfully seeded ${insertedOrUpdated} products.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
