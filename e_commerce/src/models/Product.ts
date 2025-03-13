import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: 'men' | 'women';
  subcategory: string;
  sizes: string[];
  colors: string[];
  images: string[];
  inStock: boolean;
  featured: boolean;
  rating: number;
  numReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a product category'],
      enum: {
        values: ['men', 'women'],
        message: 'Category must be either men or women',
      },
    },
    subcategory: {
      type: String,
      required: [true, 'Please provide a product subcategory'],
    },
    sizes: {
      type: [String],
      required: [true, 'Please provide available sizes'],
    },
    colors: {
      type: [String],
      required: [true, 'Please provide available colors'],
    },
    images: {
      type: [String],
      required: [true, 'Please provide product images'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema); 