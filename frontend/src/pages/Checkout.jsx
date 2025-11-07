import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../utils/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setCart(response.data.cart);
      
      if (user?.addresses && user.addresses.length > 0) {
        const defaultAddr = user.addresses.find((addr) => addr.isDefault) || user.addresses[0];
        setSelectedAddress(defaultAddr);
      }
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load cart');
      navigate('/cart');
    }
  };

  const calculateTotal = () => {
    return cart.items?.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0) || 0;
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/addresses', addressForm);
      toast.success('Address added successfully');
      setSelectedAddress(response.data.addresses[response.data.addresses.length - 1]);
      setShowAddressForm(false);
      setAddressForm({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false,
      });
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    setProcessing(true);

    try {
      const total = calculateTotal();
      
      const razorpayResponse = await api.post('/orders/razorpay/create', {
        amount: total,
      });

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load payment gateway');
        setProcessing(false);
        return;
      }

      const options = {
        key: razorpayResponse.data.key,
        amount: razorpayResponse.data.order.amount,
        currency: 'INR',
        name: 'MM Furniture',
        description: 'Furniture Purchase',
        order_id: razorpayResponse.data.order.id,
        handler: async (response) => {
          try {
            const orderData = {
              shippingAddress: selectedAddress,
              paymentInfo: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                status: 'Completed',
              },
              itemsPrice: total,
              shippingPrice: 0,
              totalPrice: total,
            };

            const orderResponse = await api.post('/orders', orderData);
            
            if (orderResponse.data.success) {
              toast.success('Order placed successfully!');
              navigate(`/orders/${orderResponse.data.order._id}`);
            }
          } catch (error) {
            toast.error('Order placement failed');
            setProcessing(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: selectedAddress?.phone || '',
        },
        theme: {
          color: '#4F46E5',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setProcessing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment initialization failed');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            
            {user?.addresses && user.addresses.length > 0 && (
              <div className="space-y-3 mb-4">
                {user.addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className={`block p-4 border rounded-lg cursor-pointer ${
                      selectedAddress?._id === addr._id ? 'border-primary-600 bg-primary-50' : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress?._id === addr._id}
                      onChange={() => setSelectedAddress(addr)}
                      className="mr-3"
                    />
                    <strong>{addr.fullName}</strong> - {addr.phone}
                    <br />
                    {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}
                    {addr.city}, {addr.state} - {addr.pincode}
                  </label>
                ))}
              </div>
            )}

            {!showAddressForm ? (
              <button
                onClick={() => setShowAddressForm(true)}
                className="btn-secondary w-full"
              >
                + Add New Address
              </button>
            ) : (
              <form onSubmit={handleAddressSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="input-field"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="input-field"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address Line 1"
                  className="input-field"
                  value={addressForm.addressLine1}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  className="input-field"
                  value={addressForm.addressLine2}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                />
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    className="input-field"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    className="input-field"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    className="input-field"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="btn-primary flex-1">
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.product._id} className="flex gap-4 pb-4 border-b">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.images && item.product.images[0] ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-primary-600 font-bold">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({cart.items.length} items)</span>
                <span>₹{calculateTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">₹{calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={processing || !selectedAddress}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : 'Place Order'}
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              By placing your order, you agree to our terms and conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
