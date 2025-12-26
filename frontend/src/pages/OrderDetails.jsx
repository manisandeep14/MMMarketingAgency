import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.order);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load order details');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Processing: 'bg-blue-100 text-blue-800',
      Shipped: 'bg-purple-100 text-purple-800',
      Delivered: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-sky-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-t-sky-500 border-slate-200 mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600">
            Loading order...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 via-white to-sky-50 px-4">
        <p className="text-lg sm:text-xl text-slate-600">
          Order not found
        </p>
        <Link to="/orders" className="btn-primary inline-block mt-4">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-6 sm:pt-8">

        {/* BACK LINK */}
        <Link
          to="/orders"
          className="inline-block mb-4 text-sky-600 hover:underline text-sm sm:text-base"
        >
          ← Back to Orders
        </Link>

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Order Details
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 break-all">
              Order ID: {order._id}
            </p>
            <p className="text-xs sm:text-sm text-slate-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <span
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold ${getStatusColor(
              order.orderStatus
            )}`}
          >
            {order.orderStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">

            {/* ORDER ITEMS */}
            <div className="bg-white/80 backdrop-blur rounded-2xl border border-sky-100 shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Order Items
              </h2>

              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 sm:gap-4 pb-4 border-b border-sky-100 last:border-b-0"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-sky-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-sm sm:text-base">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sky-600 font-bold text-sm sm:text-base mt-1">
                        ₹{item.price.toLocaleString()} × {item.quantity} = ₹
                        {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DELIVERY ADDRESS */}
            <div className="bg-white/80 backdrop-blur rounded-2xl border border-sky-100 shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Delivery Address
              </h2>
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p className="text-slate-600 text-sm">
                {order.shippingAddress.phone}
              </p>
              <p className="text-slate-600 text-sm mt-2">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 &&
                  `, ${order.shippingAddress.addressLine2}`}
              </p>
              <p className="text-slate-600 text-sm">
                {order.shippingAddress.city}, {order.shippingAddress.state} –{' '}
                {order.shippingAddress.pincode}
              </p>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur rounded-2xl border border-sky-100 shadow-lg p-4 sm:p-6 sticky top-24">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span>Items ({order.orderItems.length})</span>
                  <span>₹{order.itemsPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {order.shippingPrice === 0
                      ? 'FREE'
                      : `₹${order.shippingPrice.toLocaleString()}`}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-base sm:text-lg">
                  <span>Total</span>
                  <span className="text-sky-600">
                    ₹{order.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2 text-sm sm:text-base">
                  Payment Status
                </h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    order.paymentInfo.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.paymentInfo.status}
                </span>

                {order.paymentInfo.razorpayPaymentId && (
                  <p className="text-xs text-slate-600 mt-2 break-all">
                    Payment ID: {order.paymentInfo.razorpayPaymentId}
                  </p>
                )}
              </div>

              {order.deliveredAt && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">
                    Delivered On
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {new Date(order.deliveredAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
