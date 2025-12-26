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
      const response = await api.get('/orders/my-orders');
      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load orders');
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
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

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
                    <p className="text-xs sm:text-sm text-slate-500">
                      Order ID
                    </p>
                    <p className="font-mono text-xs sm:text-sm break-all">
                      {order._id}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 mt-2">
                      Placed on{' '}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs sm:text-sm text-slate-500">
                      Total
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-sky-600">
                      ₹{order.totalPrice.toLocaleString()}
                    </p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* ITEMS PREVIEW */}
                <div className="border-t border-sky-100 pt-4">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
