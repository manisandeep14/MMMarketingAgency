// models/product.js
import mongoose from 'mongoose';

const imageSubSchema = new mongoose.Schema(
  {
    public_id: { type: String },
    url: { type: String },
  },
  { _id: false } // don't create separate _id for each subdocument
);

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

    // Explicit images array with default empty array
    images: {
      type: [imageSubSchema],
      default: [],
    },

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
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

// Optional: small helper method to add images (can be used from controller)
productSchema.methods.addImages = function (imageArray = []) {
  if (!Array.isArray(imageArray) || imageArray.length === 0) return;
  this.images = this.images.concat(imageArray);
  return this;
};

const Product = mongoose.model('Product', productSchema);

export default Product;
