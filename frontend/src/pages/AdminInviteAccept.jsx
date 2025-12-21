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
        email: form.email || undefined,
        password: form.password,
      };

      const res = await api.post('/admin/invites/consume', payload);

      if (res.data?.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        toast.success('Admin account created successfully');
        navigate('/admin');
      } else {
        toast.error(res.data?.message || 'Failed to accept invite');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to accept invite'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-sky-50 px-4">
      <div className="w-full max-w-md">
        <div className="card p-8 shadow-xl border border-sky-100 rounded-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            {/* <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-sky-100 text-sky-600 text-2xl font-bold mb-4">
              A
            </div> */}
            <h1 className="text-2xl font-extrabold text-slate-900">
              Accept Admin Invite
            </h1>
            <p className="text-sm text-slate-600 mt-2">
              Complete your admin account setup
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                className="input-field w-full"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
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
              <p className="mt-1 text-xs text-slate-500">
                If left empty, the invited email will be used.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="input-field w-full"
                placeholder="Create a secure password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="input-field w-full"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Creating admin account...' : 'Create Admin Account'}
            </button>
          </form>

          {/* Footer Note */}
          <p className="text-xs text-center text-slate-500 mt-6">
            You’re setting up a privileged admin account.  
            Please keep your credentials secure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminInviteAccept;
