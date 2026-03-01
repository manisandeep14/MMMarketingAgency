import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/my-orders");

      setOrders(response.data.orders);

      // 🔔 Notifications for Delivered / Cancelled
      const notifiedOrders =
        JSON.parse(localStorage.getItem("notifiedOrders")) || [];

      response.data.orders.forEach((order) => {
        if (
          (order.orderStatus === "Delivered" ||
            order.orderStatus === "Cancelled") &&
          !notifiedOrders.includes(order._id)
        ) {
          if (order.orderStatus === "Delivered") {
            toast.success("🎉 Your order has been delivered successfully!");
          }

          if (order.orderStatus === "Cancelled") {
            toast.error("⚠️ Your order has been cancelled.");
          }

          notifiedOrders.push(order._id);
        }
      });

      localStorage.setItem("notifiedOrders", JSON.stringify(notifiedOrders));

    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------
     STATUS MESSAGE
  ------------------------------------------ */
  const getStatusMessage = (status) => {
    const messages = {
      Pending: '🕒 Your order has been received and is waiting for confirmation.',
      Processing: '⚙️ Great news! We are preparing your items carefully.',
      Shipped: '🚚 Your order is on the way. Get ready!',
      Delivered: '🎉 Delivered successfully! We hope you love it.',
      Cancelled: '❌ This order has been cancelled. If you need help, contact support.',
    };

    return messages[status] || 'Your order is being processed.';
  };

  /* -----------------------------------------
     TRACKING DETAILS BOX
  ------------------------------------------ */
  const getTrackingDetails = (order) => {
    const baseContact =
      'Supplier will contact within 24 hours. You can reach them at 9989594937.';

    switch (order.orderStatus) {
      case 'Pending':
        return {
          title: 'Order Received',
          message:
            'Your expected delivery date will be confirmed once the order is processed.',
          contact: baseContact,
        };

      case 'Processing':
        return {
          title: 'Preparing Your Order',
          message: 'Estimated delivery time: 5–7 days from today.',
          contact: baseContact,
        };

      case 'Shipped':
        return {
          title: 'On The Way',
          message: 'Estimated delivery time: 3–4 days.',
          contact: baseContact,
        };

      case 'Delivered':
        return {
          title: 'Successfully Delivered',
          message: `Delivered on ${new Date(
            order.deliveredAt
          ).toLocaleDateString()}`,
          contact: 'We hope you enjoy your purchase!',
        };

      case 'Cancelled':
        return {
          title: 'Order Cancelled',
          message:
            'Supplier cancelled your order (as per your request).',
          contact:
            'For assistance, contact supplier at 9989594937.',
        };

      default:
        return {
          title: 'Order Update',
          message: 'Your order is being processed.',
          contact: baseContact,
        };
    }
  };

  /* -----------------------------------------
     STATUS COLORS
  ------------------------------------------ */
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

  /* -----------------------------------------
     LOADING
  ------------------------------------------ */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-sky-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-t-sky-500 border-slate-200 mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  /* -----------------------------------------
     MAIN UI
  ------------------------------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 pb-12 sm:pb-16">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 pt-6 sm:pt-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-slate-900">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white/80 backdrop-blur rounded-2xl border border-sky-100 shadow-sm">
            <p className="text-base sm:text-xl text-slate-600 mb-4">
              No orders yet
            </p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 transition shadow-md"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white/80 backdrop-blur rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition p-4 sm:p-6"
              >
                {/* TOP ROW */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">Order ID</p>
                    <p className="font-mono text-xs sm:text-sm break-all">
                      {order._id}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 mt-2">
                      Placed on{' '}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs sm:text-sm text-slate-500">Total</p>
                    <p className="text-xl sm:text-2xl font-bold text-sky-600">
                      ₹{order.totalPrice.toLocaleString()}
                    </p>
                    <div className="mt-2 space-y-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>

                      <p className="text-xs sm:text-sm text-slate-600 bg-sky-50 border border-sky-100 rounded-lg px-3 py-2">
                        {getStatusMessage(order.orderStatus)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ITEMS + TRACKING SECTION */}
                <div className="border-t border-sky-100 pt-4 flex flex-col sm:flex-row gap-6">

                  {/* LEFT SIDE */}
                  <div className="flex-1">
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {order.orderItems.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 border border-sky-100"
                        >
                          <img
                            src={item.image || '/placeholder.png'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}

                      {order.orderItems.length > 3 && (
                        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-sky-50 rounded-xl flex items-center justify-center text-xs sm:text-sm font-semibold text-slate-600 border border-sky-100">
                          +{order.orderItems.length - 3}
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-block mt-4 px-5 py-2 rounded-full border border-sky-200 text-slate-700 hover:bg-sky-50 transition text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>

                  {/* RIGHT SIDE TRACKING BOX */}
                  <div className="flex-1">
                    <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 shadow-sm h-full">

                      {/* TITLE */}
                      <h3 className="text-sm sm:text-base font-semibold text-sky-700 mb-4">
                        {getTrackingDetails(order).title}
                      </h3>

                      {/* TIMELINE */}
                      {order.orderStatus !== "Cancelled" && (
                        <div className="flex items-center justify-between mb-4">

                          {["Pending", "Processing", "Shipped", "Delivered"].map((step, index) => {
                            const statusOrder = ["Pending", "Processing", "Shipped", "Delivered"];
                            const currentIndex = statusOrder.indexOf(order.orderStatus);
                            const stepIndex = statusOrder.indexOf(step);

                            const isCompleted = stepIndex <= currentIndex;

                            return (
                              <div key={step} className="flex-1 flex flex-col items-center relative">

                                {/* LINE */}
                                {index !== 0 && (
                                  <div
                                    className={`absolute top-3 left-[-50%] w-full h-1 ${
                                      isCompleted ? "bg-sky-500" : "bg-sky-200"
                                    }`}
                                  ></div>
                                )}

                                {/* CIRCLE */}
                                <div
                                  className={`w-6 h-6 rounded-full z-10 flex items-center justify-center text-xs font-bold ${
                                    isCompleted
                                      ? "bg-sky-500 text-white"
                                      : "bg-sky-200 text-sky-600"
                                  }`}
                                >
                                  {isCompleted ? "✓" : ""}
                                </div>

                                {/* LABEL */}
                                <span className="text-[10px] sm:text-xs mt-2 text-slate-600 text-center">
                                  {step}
                                </span>
                              </div>
                            );
                          })}

                        </div>
                      )}

                      {/* CANCEL STATE SPECIAL UI */}
                      {order.orderStatus === "Cancelled" && (
                        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm text-center font-medium">
                          Order Cancelled
                        </div>
                      )}

                      {/* MESSAGE */}
                      <p className="text-sm text-slate-700 mb-2">
                        {getTrackingDetails(order).message}
                      </p>

                      {/* CONTACT */}
                      <p className="text-xs sm:text-sm text-slate-600">
                        {getTrackingDetails(order).contact}
                      </p>

                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;