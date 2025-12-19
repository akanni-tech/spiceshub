import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { supabase } from '../../authResource/supabaseClient';

export function ResetPasswordPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    
    // 1. Use the updatePassword method
    const { error } = await supabase.auth.updateUser(formData.password);

    setLoading(false);
    setResetSuccess(true)

    if (error) {
      console.error('Password update error:', error.message);
      toast.error(`Error updating password: ${error.message}`);
    } else {
      toast.success('Password updated successfully! Redirecting...');
      setFormData({
        password: '',
        confirmPassword: ''
      });
      // 2. Redirect the user to a secure page after success
      setTimeout(() => {
        navigate('/products'); // Change this to your main authenticated route
      }, 2000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setResetSuccess(true);
      toast.success('Password reset successfully!');
    }, 1500);
  };

  // Password strength helper
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { label: '', color: '', width: '0%' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (strength <= 3) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const strength = getPasswordStrength();

  // SUCCESS SCREEN
  if (resetSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-lg bg-white shadow-md rounded-xl p-8 text-center space-y-6">
          <h2 className="text-2xl font-semibold text-[#2C2C2C]">Password Reset</h2>
          <p className="text-[#666666]">Your password has been successfully reset</p>

          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <p className="text-[#2C2C2C]">Your password has been reset successfully.</p>
          <p className="text-sm text-[#666666]">You can now sign in with your new password.</p>

          <Link to={'/login'}>
            <button
              onClick={() => onNavigate('login')}
              className="w-full bg-[#99582A] text-white py-2 rounded-lg hover:bg-[#7d4520] transition"
            >
              Continue to Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // RESET FORM
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-[#2C2C2C] text-center">Create New Password</h2>
        <p className="text-center text-[#666666] mt-1">
          Choose a strong password for your account
        </p>

        <form onSubmit={handlePasswordUpdate} className="space-y-5 mt-6">

          {/* Security banner */}
          <div className="bg-[#FFE6A7]/30 border-2 border-[#FFE6A7] rounded-xl p-4 flex gap-3">
            <Shield className="w-5 h-5 text-[#99582A] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#666666]">
              Choose a strong password with at least 8 characters, including letters, numbers, and symbols.
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#2C2C2C]">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#99582A] focus:ring-[#99582A]"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Strength indicator */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#666666]">Password strength:</span>
                <span
                  className={
                    strength.label === 'Weak'
                      ? 'text-red-500'
                      : strength.label === 'Medium'
                      ? 'text-yellow-500'
                      : 'text-green-500'
                  }
                >
                  {strength.label}
                </span>
              </div>

              <div className="h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                <div
                  className={`h-full ${strength.color} transition-all duration-300`}
                  style={{ width: strength.width }}
                />
              </div>
            </div>
          )}

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium text-[#2C2C2C]">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#99582A] focus:ring-[#99582A]"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#99582A] text-white py-2 rounded-lg hover:bg-[#7d4520] transition disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
