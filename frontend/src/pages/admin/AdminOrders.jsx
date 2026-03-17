import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ NEW: filter state
  const [filter, setFilter] = useState('active'); 
  // active = Pending, Processing, Shipped

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
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

  // ✅ NEW: filter logic
  const filteredOrders = orders.filter((order) => {
    if (filter === 'active') {
      return ['Pending', 'Processing', 'Shipped'].includes(order.orderStatus);
    }
    if (filter === 'delivered') {
      return order.orderStatus === 'Delivered';
    }
    if (filter === 'cancelled') {
      return order.orderStatus === 'Cancelled';
    }
    return true; // all
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="mb-8">

        {/* ✅ Title - Full Row */}
        <h1 className="text-3xl font-bold mb-4">
          Manage Orders
        </h1>

        {/* ✅ Controls Row */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          
          {/* Filter Styled Like Button */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-full sm:w-auto"
          >
            <option value="active" className="text-black">Active Orders</option>
            <option value="delivered" className="text-black">Delivered</option>
            <option value="cancelled" className="text-black">Cancelled</option>
            <option value="all" className="text-black">All Orders</option>
          </select>

          {/* Back Button */}
          <Link
            to="/admin"
            className="btn-secondary w-full sm:w-auto text-center"
          >
            Back to Dashboard
          </Link>

        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="card p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-mono text-sm">{order._id}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Customer: {order.user?.name} ({order.user?.email})
                  </p>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-primary-600">
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

              <div className="border-t pt-4 flex flex-wrap gap-2">
                <select
                  value={order.orderStatus}
                  onChange={(e) =>
                    updateOrderStatus(order._id, e.target.value)
                  }
                  className="input-field w-auto"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <Link to={`/orders/${order._id}`} className="btn-secondary">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;