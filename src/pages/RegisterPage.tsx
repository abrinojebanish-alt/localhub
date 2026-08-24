import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Alert } from '../components/common/Alert';
import { userService } from '../services/userService';
import { generateId } from '../lib/utils';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'customer' | 'business'>('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      // Validation
      if (!formData.name || !formData.email || !formData.password || !formData.phone) {
        setError('Please fill all required fields');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      if (userType === 'business' && !formData.businessName) {
        setError('Business name is required');
        setLoading(false);
        return;
      }

      // Create user
      const newUser = {
        id: generateId('user'),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: userType,
        verified: false,
        createdAt: new Date(),
        ...(userType === 'business' && { businessName: formData.businessName }),
      };

      userService.registerUser(newUser);
      userService.login(formData.email, formData.password);

      // Redirect to dashboard
      if (userType === 'customer') {
        navigate('/dashboard/customer');
      } else {
        navigate('/dashboard/provider');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Join LocalHub</h1>
              <p className="text-gray-600 text-sm">Create your account to get started</p>
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

            {/* User Type Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setUserType('customer')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  userType === 'customer'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-semibold text-gray-900">Customer</div>
                <div className="text-xs text-gray-600 mt-1">Book services</div>
              </button>
              <button
                onClick={() => setUserType('business')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  userType === 'business'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-semibold text-gray-900">Business</div>
                <div className="text-xs text-gray-600 mt-1">List services</div>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  Full Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input-base"
                />
              </div>

              {/* Business Name Field (only for business) */}
              {userType === 'business' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name*
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Your Business Name"
                    className="input-base"
                  />
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email Address*
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

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-2" />
                  Phone Number*
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="input-base"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock size={16} className="inline mr-2" />
                  Password*
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-base"
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock size={16} className="inline mr-2" />
                  Confirm Password*
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-base"
                />
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <input type="checkbox" id="terms" className="mt-1" required />
                <label htmlFor="terms">
                  I agree to the <a href="#" className="text-primary-600 hover:underline">Terms & Conditions</a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
