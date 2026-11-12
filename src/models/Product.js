import mongoose from 'mongoose';

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
  {
    timestamps: true,
  }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
