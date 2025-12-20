import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import api from "../utils/api";
import { setUser } from "../redux/slices/authSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");
      setCart(response.data.cart);

      if (user?.addresses && user.addresses.length > 0) {
        const defaultAddr =
          user.addresses.find((addr) => addr.isDefault) ||
          user.addresses[0];
        setSelectedAddress(defaultAddr);
      }
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load cart");
      navigate("/cart");
    }
  };

  const calculateTotal = () => {
    return (
      cart.items?.reduce(
        (total, item) =>
          total + (item.product?.price || 0) * item.quantity,
        0
      ) || 0
    );
  };

  const validItems = cart.items?.filter((item) => item.product) || [];

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/addresses", addressForm);

      if (res.data?.success && res.data.user) {
        dispatch(setUser(res.data.user));
        toast.success("Address added successfully");

        const newAddress =
          res.data.user.addresses[
            res.data.user.addresses.length - 1
          ];
        setSelectedAddress(newAddress);
        setShowAddressForm(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add address");
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }

    setProcessing(true);

    try {
      const total = calculateTotal();

      const razorpayResponse = await api.post(
        "/orders/razorpay/create",
        { amount: total }
      );

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway");
        setProcessing(false);
        return;
      }

      const options = {
        key: razorpayResponse.data.key,
        amount: razorpayResponse.data.order.amount,
        currency: "INR",
        name: "MM Furniture",
        description: "Furniture Purchase",
        order_id: razorpayResponse.data.order.id,
        handler: async (response) => {
          try {
            const orderData = {
              shippingAddress: selectedAddress,
              paymentInfo: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                status: "Completed",
              },
              itemsPrice: total,
              shippingPrice: 0,
              totalPrice: total,
            };

            const orderResponse = await api.post("/orders", orderData);

            if (orderResponse.data.success) {
              toast.success("Order placed successfully!");
              navigate(`/orders/${orderResponse.data.order._id}`);
            }
          } catch (error) {
            toast.error("Order placement failed");
            setProcessing(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: selectedAddress?.phone || "",
        },
        theme: { color: "#4F46E5" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setProcessing(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Payment initialization failed"
      );
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-sky-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-sky-500 border-slate-200 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <h1 className="text-4xl font-extrabold mb-8 text-slate-900">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">

            {/* ADDRESS */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow border border-sky-100">
              <h2 className="text-xl font-semibold mb-4">
                Delivery Address
              </h2>

              {user?.addresses?.length > 0 && (
                <div className="space-y-3 mb-4">
                  {user.addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`block p-4 rounded-xl cursor-pointer border transition ${
                        selectedAddress?._id === addr._id
                          ? "border-sky-400 bg-sky-50"
                          : "border-sky-100 hover:bg-sky-50"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={selectedAddress?._id === addr._id}
                        onChange={() => setSelectedAddress(addr)}
                        className="mr-3"
                      />
                      <strong>{addr.fullName}</strong> – {addr.phone}
                      <br />
                      <span className="text-slate-600 text-sm">
                        {addr.addressLine1},{" "}
                        {addr.addressLine2 && `${addr.addressLine2}, `}
                        {addr.city}, {addr.state} – {addr.pincode}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {!showAddressForm ? (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="w-full px-4 py-2 rounded-full border border-sky-200 hover:bg-sky-50 transition"
                >
                  + Add New Address
                </button>
              ) : (
                <form
                  onSubmit={handleAddressSubmit}
                  className="space-y-4 mt-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="input-field"
                      value={addressForm.fullName}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      className="input-field"
                      value={addressForm.phone}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          phone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Address Line 1"
                    className="input-field"
                    value={addressForm.addressLine1}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        addressLine1: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="Address Line 2"
                    className="input-field"
                    value={addressForm.addressLine2}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        addressLine2: e.target.value,
                      })
                    }
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      className="input-field"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          city: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="text"
                      placeholder="State"
                      className="input-field"
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          state: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      className="input-field"
                      value={addressForm.pincode}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          pincode: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <button className="flex-1 btn-primary">
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* ORDER ITEMS */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow border border-sky-100">
              <h2 className="text-xl font-semibold mb-4">
                Order Items
              </h2>

              <div className="space-y-4">
                {validItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex gap-4 pb-4 border-b border-sky-100"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100">
                      {item.product.images?.[0]?.url ? (
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
                      <h3 className="font-semibold">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sky-600 font-bold">
                        ₹
                        {(
                          item.product.price * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-sky-100">
              <h2 className="text-xl font-semibold mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({validItems.length})</span>
                  <span>
                    ₹{calculateTotal().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">
                    FREE
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-sky-600">
                    ₹{calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={processing || !selectedAddress}
                className="w-full py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 disabled:opacity-50"
              >
                {processing ? "Processing..." : "Place Order"}
              </button>

              <p className="text-xs text-slate-500 mt-4 text-center">
                By placing your order, you agree to our terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
