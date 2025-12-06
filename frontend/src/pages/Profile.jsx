// frontend/src/pages/Profile.jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateUser } from '../redux/slices/authSlice';
import api from '../utils/api';

const emptyAddress = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  isDefault: false,
};

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Profile edit state
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Address modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState(emptyAddress);

  // ---------------- PROFILE UPDATE ----------------
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/auth/profile', formData);
      if (response.data.success && response.data.user) {
        dispatch(updateUser(response.data.user));
        toast.success('Profile updated successfully');
        setEditMode(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update profile'
      );
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
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      addressLine1: addr.addressLine1 || '',
      addressLine2: addr.addressLine2 || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      isDefault: !!addr.isDefault,
    });
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();

    try {
      let res;
      if (editingAddress && editingAddress._id) {
        // Update existing address
        res = await api.put(
          `/auth/address/${editingAddress._id}`,
          addressForm
        );
      } else {
        // Create new address
        res = await api.post('/auth/address', addressForm);
      }

      if (res.data?.success && res.data.user) {
        dispatch(updateUser(res.data.user));
        toast.success(
          editingAddress ? 'Address updated successfully' : 'Address added successfully'
        );
        setShowAddressModal(false);
        setEditingAddress(null);
        setAddressForm(emptyAddress);
      } else {
        toast.error(res.data?.message || 'Failed to save address');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to save address'
      );
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      const res = await api.delete(`/auth/address/${addressId}`);

      if (res.data.success) {
        dispatch(updateUser(res.data.user));
        toast.success('Address deleted successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    }
  };


  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ---------------- JSX ----------------
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Personal Info Card */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="btn-secondary"
              >
                Edit Profile
              </button>
            )}
          </div>

          {!editMode ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <p className="text-lg">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="text-lg">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Role</label>
                <p className="text-lg capitalize">{user?.role}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="input-field"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                    });
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Saved Addresses Card */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Saved Addresses</h2>
            <button
              className="btn-primary"
              onClick={openAddAddress}
            >
              Add New Address
            </button>
          </div>

          {user?.addresses && user.addresses.length > 0 ? (
            <div className="space-y-3">
              {user.addresses.map((addr, index) => (
                <div key={addr._id || index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{addr.fullName}</p>
                      <p className="text-gray-600">{addr.phone}</p>
                      <p className="text-gray-600 mt-1">
                        {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>

                      {addr.isDefault && (
                        <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-600 text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>

                    {/* Buttons section */}
                    <div className="flex gap-2">
                      <button
                        className="btn-secondary text-sm"
                        onClick={() => handleEditAddress(addr)}
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
                </div>
              ))}

            </div>
          ) : (
            <p className="text-gray-600">No saved addresses</p>
          )}
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowAddressModal(false);
                  setEditingAddress(null);
                  setAddressForm(emptyAddress);
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  className="input-field"
                  value={addressForm.fullName}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="input-field"
                  value={addressForm.phone}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  className="input-field"
                  value={addressForm.addressLine1}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2 (optional)
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  className="input-field"
                  value={addressForm.addressLine2}
                  onChange={handleAddressChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    className="input-field"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    className="input-field"
                    value={addressForm.state}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  className="input-field"
                  value={addressForm.pincode}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="isDefault"
                  type="checkbox"
                  name="isDefault"
                  checked={addressForm.isDefault}
                  onChange={handleAddressChange}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="isDefault"
                  className="text-sm text-gray-700"
                >
                  Set as default address
                </label>
              </div>

              <div className="flex gap-4 mt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingAddress ? 'Save Changes' : 'Add Address'}
                </button>
                <button
                  type="button"
                  className="btn-secondary flex-1"
                  onClick={() => {
                    setShowAddressModal(false);
                    setEditingAddress(null);
                    setAddressForm(emptyAddress);
                  }}
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
