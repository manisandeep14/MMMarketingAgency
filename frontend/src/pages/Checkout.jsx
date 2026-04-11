import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import api from "../utils/api";
import { setUser } from "../redux/slices/authSlice";
import MapPicker from "./MapPicker";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [deliveryDistance, setDeliveryDistance] = useState(null);
  const [location, setLocation] = useState(null);

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

  useEffect(() => {
    if (location) {
      fetchDeliveryPrice();
    }
  }, [location]);

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

  const calculateDiscount = () => {
    return (
      cart.items?.reduce(
        (total, item) =>
          total + ((item.product?.discount || 0) * item.quantity),
        0
      ) || 0
    );
  };

  const calculateAssembly = () => {
    return (
      cart.items?.reduce(
        (total, item) =>
          total + ((item.product?.assemblyCharge || 0) * item.quantity),
        0
      ) || 0
    );
  };

  const fetchDeliveryPrice = async () => {

    if (!location) return;
    try {
      const res = await api.post("/orders/delivery-price", {
        lat: location.lat,
        lng: location.lng
      });

      setDeliveryPrice(res.data.deliveryPrice);
      setDeliveryDistance(res.data.distance);
    } catch (error) {
      toast.error("Failed to calculate delivery");
    }
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;

    try {
      const res = await api.put("/cart", {
        productId,
        quantity: newQty,
      });

      setCart(res.data.cart);
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const validItems = cart.items?.filter((item) => item.product) || [];

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/address", addressForm);

      if (res.data?.success && res.data.user) {
        dispatch(setUser(res.data.user));
        toast.success("Address added successfully");

        const newAddress =
          res.data.user.addresses[
            res.data.user.addresses.length - 1
          ];
        setSelectedAddress(newAddress);
        // fetchDeliveryPrice(newAddress);
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
    if (!location) {
      toast.error("Please select delivery location on map");
      return;
    }

    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }

    setProcessing(true);

    try {
      const itemsPrice = calculateTotal();
      const discountPrice = calculateDiscount();
      const assemblyPrice = calculateAssembly();

      const total =
        itemsPrice - discountPrice + assemblyPrice + deliveryPrice;

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
            
            // ✅ Step 1: Verify payment signature
            const verifyRes = await api.post("/orders/razorpay/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            
            if (!verifyRes.data.isValid) {
              toast.error("Payment verification failed");
              setProcessing(false);
              return;
            }
            const itemsPrice = calculateTotal();
            // const total = calculateTotal() + deliveryPrice;
            // ✅ Step 2: Create order only after verification
            const orderData = {
              shippingAddress: selectedAddress,
              deliveryLocation: {
                lat: location.lat,
                lng: location.lng,
                mapLink: `https://www.google.com/maps?q=${location.lat},${location.lng}`
              },
              paymentInfo: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                status: "Completed",
              },
              itemsPrice: itemsPrice,
              discountPrice,
              assemblyPrice,
              shippingPrice: deliveryPrice,
              totalPrice: total,
            };

            const orderResponse = await api.post("/orders", orderData);

            if (orderResponse.data.success) {
              toast.success("Order placed successfully!");
              navigate(`/orders/${orderResponse.data.order._id}`);
            }

          } catch (error) {
            console.log("Order Error:", error.response?.data);
            toast.error(error.response?.data?.message || "Order placement failed");
          } finally {
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
      // setProcessing(false);
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
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-t-sky-500 border-slate-200 mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-slate-600">
            Loading checkout...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-6 sm:pt-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-slate-900">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">

            {/* ADDRESS */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 sm:p-6 shadow border border-sky-100">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Delivery Address
              </h2>

              {user?.addresses?.length > 0 && (
                <div className="space-y-3 mb-4">
                  {user.addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`block p-3 sm:p-4 rounded-xl cursor-pointer border transition ${
                        selectedAddress?._id === addr._id
                          ? "border-sky-400 bg-sky-50"
                          : "border-sky-100 hover:bg-sky-50"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={selectedAddress?._id === addr._id}
                        onChange={() => {
                          setSelectedAddress(addr);
                          // fetchDeliveryPrice(addr);
                        }}
                        className="mr-3"
                      />
                      <strong>{addr.fullName}</strong> – {addr.phone}
                      <br />
                      <span className="text-slate-600 text-xs sm:text-sm">
                        {addr.addressLine1},{" "}
                        {addr.addressLine2 && `${addr.addressLine2}, `}
                        {addr.city}, {addr.state} – {addr.pincode}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              <div className="mt-4 border border-sky-100 rounded-xl p-3">

                <p className="text-sm font-semibold mb-2">
                📍 Select Delivery Location
                </p>

                <MapPicker setLocation={setLocation} />

              </div>

              {!showAddressForm ? (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="w-full px-4 py-2 rounded-full border border-sky-200 hover:bg-sky-50 transition text-sm sm:text-base"
                >
                  + Add New Address
                </button>
              ) : (
                <form
                  onSubmit={handleAddressSubmit}
                  className="space-y-4 mt-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 sm:p-6 shadow border border-sky-100">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Order Items
              </h2>

              <div className="space-y-4">
                {validItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-start gap-4 pb-4 border-b border-sky-100"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100">
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

                    <div className="flex-1 flex justify-between gap-4">

                        {/* LEFT SIDE */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">

                            <h3 className="font-semibold text-sm sm:text-base">
                              {item.product.name}
                            </h3>

                            {item.product.discount > 0 && item.product.price > 0 && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                {Math.round(
                                  (item.product.discount / item.product.price) * 100
                                )}% OFF
                              </span>
                            )}

                          </div>

                          {item.product.description && (
                            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg">
                              {item.product.description}
                            </p>
                          )}
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.product._id, item.quantity - 1)
                              }
                              className="w-7 h-7 flex items-center justify-center rounded border border-sky-300 text-sky-600"
                            >
                              -
                            </button>

                            <span className="text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  Math.min(item.product.stock, item.quantity + 1)
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center rounded border border-sky-300 text-sky-600"
                            >
                              +
                            </button>
                          </div>

                          <p className="text-sky-600 font-bold text-sm sm:text-base">
                            ₹{(
                              (item.product.price - (item.product.discount || 0)) *
                              item.quantity
                            ).toLocaleString()}
                          </p>
                        </div>

                      </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white/80 backdrop-blur rounded-2xl p-4 sm:p-6 shadow-lg border border-sky-100">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 text-sm sm:text-base">

                <div className="flex justify-between">
                  <span>Subtotal ({validItems.length})</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{calculateDiscount().toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <div className="text-right">
                    <div className="text-green-600 font-medium">
                      {location ? `₹${deliveryPrice}` : "Select location"}
                    </div>
                    {deliveryDistance && (
                      <div className="text-xs text-slate-500">
                        {deliveryDistance} km from store
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <span>Assembly Charges</span>
                  <span>₹{calculateAssembly().toLocaleString()}</span>
                </div>

                <div className="border-t pt-4 flex justify-between font-bold text-base sm:text-lg">
                  <span>Total</span>
                  <span className="text-sky-600">
                    ₹{(
                      calculateTotal() -
                      calculateDiscount() +
                      calculateAssembly() +
                      deliveryPrice
                    ).toLocaleString()}
                  </span>
                </div>

                <p className="text-green-600 text-sm">
                  You saved ₹{calculateDiscount().toLocaleString()} today!
                </p>

              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={processing || !selectedAddress || !location}
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
