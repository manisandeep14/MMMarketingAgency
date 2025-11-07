import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please enter product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter product price'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Please select product category'],
      enum: ['Sofa', 'Bed', 'Chair', 'Table', 'Cabinet', 'Wardrobe', 'Decor', 'Other'],
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    stock: {
      type: Number,
      required: [true, 'Please enter product stock'],
      min: 0,
      default: 0,
    },
    material: {
      type: String,
      default: 'Wood',
    },
    color: String,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        default: 'cm',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
