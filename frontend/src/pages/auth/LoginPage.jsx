import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { supabase } from '../../authResource/supabaseClient';

export function LoginPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success('Welcome back!');
      onNavigate('home');
    }, 1500);
  };

  const handleLogin = async(e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    const {data, error} = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password
    })

    if (error) {
      toast.error(error.message || "Unexpected error during log in");
      setLoading(false)
      return;
    }

    if (data.user && data.session) {
      toast.success("Now logged in")
      setLoading(false)
      navigate("/products")
    }

  }

  const handleGoogleLogin = async () => {
    try {
        // 1. Call the signInWithOAuth method
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            // In production, use deployed URL.
            redirectTo: `${window.location.origin}/products`, 
          },
        });
  
        if (error) {
          throw error;
        }
        
      } catch (error) {
        toast.error('Error during Google login:', error.message);
      }
    };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white shadow-md rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-[#2C2C2C] text-center">Welcome Back</h2>
        <p className="text-center text-[#666666] mt-1">Sign in to continue your shopping</p>

        <form onSubmit={handleLogin} className="space-y-5 mt-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#2C2C2C]">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-[#99582A] focus:border-[#99582A]"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#2C2C2C]">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-[#99582A] focus:border-[#99582A]"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            {/* <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#99582A] focus:ring-[#99582A]"
              />
              <span className="text-sm text-[#666666]">Remember me</span>
            </label> */}
            <Link to={'/sso'}>
              <button
                type="button"
                className="text-sm text-[#99582A] hover:underline"
              >
                SSO 
              </button>
            </Link>

            <Link to={'/forgot-password'}>
              <button
                type="button"
                className="text-sm text-[#99582A] hover:underline"
              >
                Forgot Password?
              </button>
            </Link>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#99582A] text-white py-2 rounded-lg hover:bg-[#7d4520] transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#666666]">or</span>
            </div>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" className="w-5 h-5" />
            Continue with Google
          </button>

          {/* Sign up link */}
          <div className="text-center pt-2">
            <p className="text-[#666666]">
              Don't have an account?{' '}
              <Link to={'/signup'}>
                <button
                  type="button"
                  onClick={() => onNavigate('signup')}
                  className="text-[#99582A] hover:underline"
                >
                  Create one
                </button>
              </Link>
            </p>
          </div>

          {/* Guest */}
          <div className="text-center pt-4 border-t border-gray-200 mt-6">
            <Link to={'/'}>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="text-[#666666] hover:text-[#99582A] transition-colors"
              >
                ← Continue browsing as guest
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
