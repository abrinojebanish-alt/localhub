import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Alert } from '../components/common/Alert';
import { userService } from '../services/userService';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setError('Please fill all fields');
        setLoading(false);
        return;
      }

      const user = userService.login(formData.email, formData.password);
      
      if (!user) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      if (rememberMe) {
        localStorage.setItem('rememberEmail', formData.email);
      }

      // Redirect based on user role
      if (user.role === 'customer') {
        navigate('/dashboard/customer');
      } else {
        navigate('/dashboard/provider');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials
  const fillDemoCustomer = () => {
    setFormData({
      email: 'customer@example.com',
      password: 'password123',
    });
  };

  const fillDemoProvider = () => {
    setFormData({
      email: 'owner1@example.com',
      password: 'password123',
    });
  };

  React.useEffect(() => {
    const savedEmail = localStorage.getItem('rememberEmail');
    if (savedEmail) {
      setFormData(prev => ({
        ...prev,
        email: savedEmail,
      }));
      setRememberMe(true);
    }
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold mx-auto mb-4">
                L
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600 text-sm">Login to your LocalHub account</p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert
                type="error"
                message={error}
                onClose={() => setError('')}
                closeable
              />
            )}

            {/* Demo Credentials Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-xs">
              <p className="text-gray-700 mb-2 font-semibold">Demo Credentials:</p>
              <div className="space-y-1 text-gray-600">
                <button
                  type="button"
                  onClick={fillDemoCustomer}
                  className="block text-blue-600 hover:text-blue-700 font-medium"
                >
                  Customer Demo
                </button>
                <button
                  type="button"
                  onClick={fillDemoProvider}
                  className="block text-blue-600 hover:text-blue-700 font-medium"
                >
                  Provider Demo
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-base"
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    <Lock size={16} className="inline mr-2" />
                    Password
                  </label>
                  <a href="#" className="text-xs text-primary-600 hover:text-primary-700">
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-base"
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
              >
                {loading ? 'Logging in...' : 'Login'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign up now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
