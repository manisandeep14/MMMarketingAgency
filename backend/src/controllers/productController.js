import Product from '../models/Product.js';
import { cloudinary } from '../config/cloudinary.js';
import Cart from '../models/Cart.js';




/* -------------------------------------------
   GET ALL PRODUCTS (WITH TAG LOGIC)
-------------------------------------------- */
export const getAllProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    let query = { isActive: true };

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    if (sort === "price-asc") sortOption.price = 1;
    else if (sort === "price-desc") sortOption.price = -1;
    else sortOption.createdAt = -1;

    // 🔹 FETCH PRODUCTS
    const products = await Product.find(query).sort(sortOption);

    // 🔹 ADD "NEW (14 DAYS)" LOGIC
    const updatedProducts = products.map((product) => {
      const isNew =
        product.tag === "new" &&
        Date.now() - new Date(product.createdAt).getTime() <
          14 * 24 * 60 * 60 * 1000;

      return {
        ...product._doc,
        showNew: isNew,
      };
    });

    return res.status(200).json({
      success: true,
      count: updatedProducts.length,
      products: updatedProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -------------------------------------------
   GET ONE PRODUCT
-------------------------------------------- */
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------------------------------
   CREATE PRODUCT (MULTIPLE IMAGES)
-------------------------------------------- */
export const createProduct = async (req, res) => {
  // inside createProduct, at the very top
  console.log('--- CREATE PRODUCT REQUEST ---');
  console.log('Content-Type:', req.headers['content-type']);
  console.log('BODY (first 1kb):', JSON.stringify(req.body).slice(0, 1000));
  console.log('FILES RECEIVED (CREATE):', req.files);

  try {
    console.log("FILES RECEIVED (CREATE):", req.files);

    const data = req.body;

    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map(
          (file) =>
            new Promise((resolve, reject) => {
              const upload = cloudinary.uploader.upload_stream(
                { folder: "furniture-products" },
                (err, result) => {
                  console.log("CLOUDINARY ERROR (CREATE):", err);
                  console.log("CLOUDINARY RESULT (CREATE):", result);

                  if (err) reject(err);
                  else resolve({ public_id: result.public_id, url: result.secure_url });
                }
              );
              upload.end(file.buffer);
            })
        )
      );

      data.images = uploads;
    }

    const product = await Product.create(data);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};




/* -------------------------------------------
   UPDATE PRODUCT — KEEP OLD IMAGES + REMOVE SELECTED + ADD NEW
-------------------------------------------- */
export const updateProduct = async (req, res) => {
  try {
    console.log("FILES RECEIVED (UPDATE):", req.files);

    let product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    let updatedData = req.body;

    /* ------------------------------
       1️⃣ HANDLE IMAGE REMOVALS
    ------------------------------ */
    let removeList = [];
    if (updatedData.removeImages) {
      try {
        removeList = JSON.parse(updatedData.removeImages);
      } catch (_) {}
    }

    if (removeList.length > 0) {
      await Promise.all(
        removeList.map(async (public_id) => {
          try {
            await cloudinary.uploader.destroy(public_id);
          } catch (_) {}
        })
      );

      product.images = product.images.filter(
        (img) => !removeList.includes(img.public_id)
      );
    }

    /* ------------------------------
       2️⃣ HANDLE NEW IMAGE UPLOADS
    ------------------------------ */
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map(
          (file) =>
            new Promise((resolve, reject) => {
              const upload = cloudinary.uploader.upload_stream(
                { folder: "furniture-products" },
                (err, result) => {
                  console.log("CLOUDINARY ERROR (UPDATE):", err);
                  console.log("CLOUDINARY RESULT (UPDATE):", result);

                  if (err) reject(err);
                  else resolve({ public_id: result.public_id, url: result.secure_url });
                }
              );
              upload.end(file.buffer);
            })
        )
      );

      product.images = [...product.images, ...uploads];
    }

    /* ------------------------------
       3️⃣ UPDATE OTHER FIELDS
    ------------------------------ */
    product.name = updatedData.name ?? product.name;
    product.description = updatedData.description ?? product.description;
    product.price = updatedData.price ?? product.price;
    product.stock = updatedData.stock ?? product.stock;
    product.material = updatedData.material ?? product.material;
    product.color = updatedData.color ?? product.color;

    product.tag = updatedData.tag ?? product.tag;

    if (updatedData.dimensions) {
      try {
        product.dimensions = JSON.parse(updatedData.dimensions);
      } catch (_) {}
    }

    if (updatedData.isActive !== undefined) {
      product.isActive = updatedData.isActive === "true" || updatedData.isActive === true;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------------------------------
   DELETE PRODUCT — REMOVE IMAGES
-------------------------------------------- */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    // 1️⃣ Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images
          .filter((img) => img && img.public_id)
          .map(async (img) => {
            try {
              await cloudinary.uploader.destroy(img.public_id);
            } catch (err) {
              console.log("CLOUDINARY DELETE ERROR:", err);
            }
          })
      );
    }

    // 2️⃣ Remove product from ALL carts ✅ (IMPORTANT)
    await Cart.updateMany(
      {},
      { $pull: { items: { product: product._id } } }
    );

    // 3️⃣ Delete product from DB
    await Product.findByIdAndDelete(product._id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
