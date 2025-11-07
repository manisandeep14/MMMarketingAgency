import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/auth/verify-email/${token}`);
        if (response.data.success) {
          setStatus('success');
          toast.success('Email verified successfully!');
        }
      } catch (error) {
        setStatus('error');
        toast.error(error.response?.data?.message || 'Verification failed');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full text-center">
        {status === 'verifying' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Verifying Email...</h2>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        )}
        {status === 'success' && (
          <div>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Email Verified!</h2>
            <p className="text-gray-600 mb-8">Your email has been successfully verified. You can now log in.</p>
            <Link to="/login" className="btn-primary inline-block">
              Go to Login
            </Link>
          </div>
        )}
        {status === 'error' && (
          <div>
            <div className="text-red-500 text-6xl mb-4">✗</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Verification Failed</h2>
            <p className="text-gray-600 mb-8">The verification link is invalid or has expired.</p>
            <Link to="/register" className="btn-primary inline-block">
              Register Again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
