// frontend/src/pages/admin/AdminInvites.jsx
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function AdminInvites() {
  const [email, setEmail] = useState('');
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadInvites = async () => {
    try {
      const res = await api.get('/admin/invites');
      setInvites(res.data.invites || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load invites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvites();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email required");

    try {
      setSending(true);
      await api.post("/admin/invites", { email });
      toast.success("Invite sent");
      setEmail("");
      loadInvites();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setSending(false);
    }
  };

  const resend = async (id) => {
    try {
      await api.post(`/admin/invites/${id}/resend`);
      toast.success("Invite resent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="p-6">

      {/* FORM */}
      <form onSubmit={handleSend} className="mb-6">
        <h2 className="text-xl font-bold mb-2">Invite Admin</h2>

        <input
          type="email"
          value={email}
          placeholder="admin@example.com"
          onChange={(e) => setEmail(e.target.value)}
          className="input-field w-full mb-2"
        />

        <button className="btn-primary" disabled={sending}>
          {sending ? "Sending..." : "Send Invite"}
        </button>
      </form>

      {/* TABLE */}
      <h3 className="text-lg font-semibold mb-4">Invites</h3>

      {loading ? (
        <p>Loading...</p>
      ) : invites.length === 0 ? (
        <p className="text-gray-500">No invites found.</p>
      ) : (
        <table className="min-w-full table-fixed border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Email</th>
              <th className="p-2">Status</th>
              <th className="p-2">Expires</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {invites.map((inv) => {
              const expired =
                inv.expiresAt && new Date(inv.expiresAt) < new Date();
              const used = inv.used;

              return (
                <tr key={inv._id} className="border-t">
                  <td className="p-2">{inv.email}</td>
                  <td className="p-2">
                    {used
                      ? "Used"
                      : expired
                      ? "Expired"
                      : "Pending"}
                  </td>
                  <td className="p-2">
                    {inv.expiresAt
                      ? new Date(inv.expiresAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-2">
                    {!used && !expired && (
                      <button
                        onClick={() => resend(inv._id)}
                        className="btn-secondary text-sm"
                      >
                        Resend
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

    </div>
  );
}
