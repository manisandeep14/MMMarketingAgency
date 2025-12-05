// frontend/src/pages/AdminInviteAccept.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const AdminInviteAccept = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.password) {
      toast.error('Name and password are required');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        token,
        name: form.name,
        // if email left blank, backend will use invite.email
        email: form.email || undefined,
        password: form.password,
      };

      const res = await api.post('/admin/invites/consume', payload);

      if (res.data?.success) {
        // store token + user so new admin is logged in
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        toast.success('Admin account created successfully');
        navigate('/admin');
      } else {
        toast.error(res.data?.message || 'Failed to accept invite');
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to accept invite';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-10">
      <div className="card max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2 text-center">Accept Admin Invite</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Set up your admin account by filling the details below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              className="input-field w-full"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (optional)
            </label>
            <input
              type="email"
              name="email"
              className="input-field w-full"
              placeholder="Use invite email or leave blank"
              value={form.email}
              onChange={handleChange}
            />
            <p className="mt-1 text-xs text-gray-500">
              If left empty, we will use the email the invite was sent to.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="input-field w-full"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="input-field w-full"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Creating admin...' : 'Create Admin Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminInviteAccept;
