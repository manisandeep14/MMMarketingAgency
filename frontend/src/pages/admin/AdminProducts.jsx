// frontend/src/pages/admin/AdminProducts.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash, FaEdit, FaPlus, FaTimes } from "react-icons/fa";
import api from "../../utils/api";

// Normalize Cloudinary image objects
const normalizeImages = (images) => {
  if (!images || !Array.isArray(images)) return [];

  return images
    .filter(Boolean)
    .map((img) => {
      if (typeof img === "string") return { public_id: null, url: img };
      return {
        public_id: img.public_id || img.publicId || null,
        url: img.url || img.secure_url || null,
      };
    })
    .filter((i) => i.url);
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Sofa",
    stock: "",
    material: "Wood",
    color: "",
    length: "",
    width: "",
    height: "",
    isActive: true,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); // local preview URLs
  const [existingImages, setExistingImages] = useState([]); // normalized existing images
  const [removedImages, setRemovedImages] = useState([]); // public_ids marked for removal

  const [submitting, setSubmitting] = useState(false);

  const categories = ["Sofa", "Bed", "Chair", "Table", "Cabinet", "Wardrobe", "Decor", "Other"];

  useEffect(() => {
    fetchProducts();
    return () => {
      // cleanup previews on unmount
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data.products || []);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditMode(false);
    setSelectedProduct(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Sofa",
      stock: "",
      material: "Wood",
      color: "",
      length: "",
      width: "",
      height: "",
      isActive: true,
    });

    setImageFiles([]);
    clearPreviews();
    setExistingImages([]);
    setRemovedImages([]);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditMode(true);
    setSelectedProduct(product);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "Sofa",
      stock: product.stock ?? "",
      material: product.material || "Wood",
      color: product.color || "",
      length: product.dimensions?.length || "",
      width: product.dimensions?.width || "",
      height: product.dimensions?.height || "",
      isActive: product.isActive ?? true,
    });

    setExistingImages(normalizeImages(product.images));
    setImageFiles([]);
    clearPreviews();
    setRemovedImages([]);
    setShowModal(true);
  };

  const clearPreviews = () => {
    imagePreviews.forEach((u) => URL.revokeObjectURL(u));
    setImagePreviews([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const previews = files.map((f) => URL.createObjectURL(f));

    // revoke previous previews
    clearPreviews();
    setImageFiles(files);
    setImagePreviews(previews);
  };

  const removeNewPreview = (index) => {
    const updatedFiles = [...imageFiles];
    updatedFiles.splice(index, 1);
    setImageFiles(updatedFiles);

    const updatedPreviews = [...imagePreviews];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  };

  const toggleRemoveExistingImage = (img) => {
    if (!img.public_id) return;

    if (removedImages.includes(img.public_id)) {
      setRemovedImages(removedImages.filter((id) => id !== img.public_id));
    } else {
      setRemovedImages([...removedImages, img.public_id]);
    }
  };

  const resetAfterSubmit = () => {
    setImageFiles([]);
    clearPreviews();
    setExistingImages([]);
    setRemovedImages([]);
    setSelectedProduct(null);
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();

      // Add basic fields (stringify booleans/values)
      Object.entries(formData).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        data.append(key, value);
      });

      // Dimensions (as JSON)
      if (formData.length || formData.width || formData.height) {
        data.append(
          "dimensions",
          JSON.stringify({
            length: formData.length || 0,
            width: formData.width || 0,
            height: formData.height || 0,
            unit: "cm",
          })
        );
      }

      // Append new image files
      imageFiles.forEach((file) => {
        data.append("images", file);
      });

      // Removed images (only in edit mode)
      if (editMode && removedImages.length > 0) {
        data.append("removeImages", JSON.stringify(removedImages));
      }

      // Ensure multipart headers (this helps if a global axios default is set)
      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (editMode && selectedProduct) {
        await api.put(`/products/${selectedProduct._id}`, data, config);
        toast.success("Product updated successfully");
      } else {
        await api.post("/products", data, config);
        toast.success("Product created successfully");
      }

      // refresh and reset modal
      setShowModal(false);
      resetAfterSubmit();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (productId) => {
  if (!window.confirm("Are you sure?")) return;

  try {
    await api.delete(`/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    toast.success("Deleted successfully");
    fetchProducts();
  } catch (err) {
    console.log("DELETE ERROR:", err.response?.data || err);
    toast.error("Failed to delete");
  }
};


  return (
    <div className="container mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <div className="flex gap-4">
          <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
            <FaPlus /> Add Product
          </button>
          <Link to="/admin" className="btn-secondary">Back to Dashboard</Link>
        </div>
      </div>

      {/* PRODUCT LIST */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No products found</p>
          <button onClick={openCreateModal} className="btn-primary mt-4">Add Your First Product</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const imgs = normalizeImages(product.images);
            const mainImg = imgs[0]?.url;

            return (
              <div key={product._id} className="card">
                <div className="aspect-square bg-gray-200 overflow-hidden rounded-lg">
                  {mainImg ? (
                    <img src={mainImg} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">No Image</div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-primary-600 font-bold text-xl">₹{product.price?.toLocaleString?.() ?? product.price}</span>
                    <span className="text-sm text-gray-500">{product.category}</span>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(product)} className="flex-1 btn-secondary flex items-center justify-center gap-2">
                      <FaEdit /> Edit
                    </button>
                    <button onClick={() => deleteProduct(product._id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* MODAL HEADER */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between">
              <h2 className="text-2xl font-bold">{editMode ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => { setShowModal(false); resetAfterSubmit(); }}>
                <FaTimes size={24} />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input type="text" className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Product name" required />

              <textarea className="input-field" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" />

              <div className="grid grid-cols-2 gap-4">
                <input type="number" className="input-field" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Price" required />
                <input type="number" className="input-field" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder="Stock" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select className="input-field" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>

                <input type="text" className="input-field" value={formData.material} onChange={(e) => setFormData({ ...formData, material: e.target.value })} placeholder="Material" />
              </div>

              <input type="text" className="input-field" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} placeholder="Color" />

              <div className="grid grid-cols-3 gap-4">
                <input type="number" className="input-field" placeholder="Length" value={formData.length} onChange={(e) => setFormData({ ...formData, length: e.target.value })} />
                <input type="number" className="input-field" placeholder="Width" value={formData.width} onChange={(e) => setFormData({ ...formData, width: e.target.value })} />
                <input type="number" className="input-field" placeholder="Height" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} />
              </div>

              {/* FILE UPLOAD */}
              <input type="file" multiple accept="image/*" className="input-field" onChange={handleFileChange} />

              {/* NEW PREVIEWS */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {imagePreviews.map((url, idx) => (
                    <div key={idx} className="relative rounded overflow-hidden border">
                      <img src={url} alt={`preview-${idx}`} className="w-full h-24 object-cover" />
                      <button type="button" onClick={() => removeNewPreview(idx)} className="absolute top-1 right-1 bg-white p-1 rounded-full">
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* EXISTING IMAGES (EDIT MODE) */}
              {editMode && existingImages.length > 0 && (
                <>
                  <p className="text-sm text-gray-600">Click image to mark for removal</p>
                  <div className="grid grid-cols-4 gap-3">
                    {existingImages.map((img) => {
                      const removed = removedImages.includes(img.public_id);
                      const key = img.public_id || img.url;
                      return (
                        <div key={key} className={`relative rounded overflow-hidden border cursor-pointer ${removed ? "opacity-50" : ""}`} onClick={() => toggleRemoveExistingImage(img)}>
                          <img src={img.url} alt="existing" className="w-full h-24 object-cover" />
                          <div className="absolute top-1 right-1 bg-white p-1 rounded-full">
                            {removed ? <FaTimes /> : <FaTrash />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {removedImages.length > 0 && <p className="text-xs text-red-600 mt-2">{removedImages.length} image(s) marked for removal</p>}
                </>
              )}

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                Active Product
              </label>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 btn-primary" disabled={submitting}>
                  {submitting ? "Saving..." : editMode ? "Update Product" : "Create Product"}
                </button>
                <button type="button" onClick={() => { setShowModal(false); resetAfterSubmit(); }} className="flex-1 btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
