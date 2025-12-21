// frontend/src/pages/Profile.jsx
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateUser } from "../redux/slices/authSlice";
import api from "../utils/api";

const emptyAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState(emptyAddress);

  // ---------------- PROFILE UPDATE ----------------
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/auth/profile", formData);
      if (response.data.success && response.data.user) {
        dispatch(updateUser(response.data.user));
        toast.success("Profile updated successfully");
        setEditMode(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  // ---------------- ADDRESS HELPERS ----------------
  const openAddAddress = () => {
    setEditingAddress(null);
    setAddressForm(emptyAddress);
    setShowAddressModal(true);
  };

  const openEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressForm({
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      addressLine1: addr.addressLine1 || "",
      addressLine2: addr.addressLine2 || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      isDefault: !!addr.isDefault,
    });
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingAddress && editingAddress._id) {
        res = await api.put(`/auth/address/${editingAddress._id}`, addressForm);
      } else {
        res = await api.post("/auth/address", addressForm);
      }

      if (res.data?.success && res.data.user) {
        dispatch(updateUser(res.data.user));
        toast.success(
          editingAddress
            ? "Address updated successfully"
            : "Address added successfully"
        );
        setShowAddressModal(false);
        setEditingAddress(null);
        setAddressForm(emptyAddress);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await api.delete(`/auth/address/${addressId}`);
      if (res.data.success) {
        dispatch(updateUser(res.data.user));
        toast.success("Address deleted successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete address");
    }
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 pb-16">
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-10">
          My Profile
        </h1>

        {/* PROFILE CARD */}
        <div className="bg-white/80 backdrop-blur rounded-2xl border border-sky-100 shadow-sm p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-slate-900">
                {user?.name}
              </h2>
              <p className="text-slate-600">{user?.email}</p>
              <span className="inline-block mt-2 px-4 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700">
                {user?.role}
              </span>
            </div>

            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="px-6 py-2 rounded-full border border-sky-200 text-slate-700 hover:bg-sky-50 transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          {!editMode ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500">Name</p>
                <p className="text-lg font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="text-lg font-medium">{user?.email}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <input
                className="input-field"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                className="input-field"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 btn-primary">Save Changes</button>
                <button
                  type="button"
                  className="flex-1 btn-secondary"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      name: user?.name || "",
                      email: user?.email || "",
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ADDRESSES */}
        <div className="bg-white/80 backdrop-blur rounded-2xl border border-sky-100 shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Saved Addresses</h2>
            <button onClick={openAddAddress} className="btn-primary">
              + Add Address
            </button>
          </div>

          {user?.addresses?.length ? (
            <div className="grid gap-4">
              {user.addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="p-4 rounded-xl border border-sky-100 bg-sky-50/50"
                >
                  <p className="font-semibold">{addr.fullName}</p>
                  <p className="text-sm text-slate-600">{addr.phone}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    {addr.addressLine1},{" "}
                    {addr.addressLine2 && `${addr.addressLine2}, `}
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>

                  {addr.isDefault && (
                    <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-sky-100 text-sky-700">
                      Default
                    </span>
                  )}

                  <div className="flex gap-3 mt-4">
                    <button
                      className="btn-secondary text-sm"
                      onClick={() => openEditAddress(addr)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger text-sm"
                      onClick={() => handleDeleteAddress(addr._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600">No saved addresses</p>
          )}
        </div>
      </div>

      {/* ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h3>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              {[
                "fullName",
                "phone",
                "addressLine1",
                "addressLine2",
                "city",
                "state",
                "pincode",
              ].map((field) => (
                <input
                  key={field}
                  name={field}
                  className="input-field"
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  value={addressForm[field]}
                  onChange={handleAddressChange}
                  required={field !== "addressLine2"}
                />
              ))}

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={addressForm.isDefault}
                  onChange={handleAddressChange}
                />
                Set as default address
              </label>

              <div className="flex gap-4 mt-4">
                <button className="flex-1 btn-primary">
                  {editingAddress ? "Save Changes" : "Add Address"}
                </button>
                <button
                  type="button"
                  className="flex-1 btn-secondary"
                  onClick={() => setShowAddressModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
