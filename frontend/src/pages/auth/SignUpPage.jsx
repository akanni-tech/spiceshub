import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { supabase } from '../../authResource/supabaseClient';
import { Eye, EyeClosed } from 'lucide-react'
import { addUser } from '../../hooks/services';

export function SignUpPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';

    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?\d{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitSignUpForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          //pased as data object for 'user_metadata
          firstname: formData.firstName,
          lastname: formData.lastName,
          phoneNumber: formData.phoneNumber,
        }
      }
    })

    if (error) {
      toast.error(error.message || "Unexpected error during sign up");
      setLoading(false)
      return;
    }

    if (data.user && data.session) {
      toast.success("Account created! Please check email for a confirmation")
      setLoading(false)
      navigate("/")
      // send data to the backend in this part
      const supabase_uuid = data.user.id

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        supabase_id: supabase_uuid
      }

      // try {
      //   const response = await fetch('http://127.0.0.1:5000/User/api/users', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(payload)
      //   });

      //   if (!response.ok) {
      //     toast.error("Backend failed to store user data.", response.statusText);
      //   }

      // } catch (error) {
      //   toast.error("Network error during backend sync:", error);
      // }
      const handleaddUser = async () => {
        await addUser(payload);
        toast.success("added user to db")
      };

      handleaddUser()

    } else {
      toast.error("Sign up successful, but could not retrieve session.");
    }

  }

  const handleGoogleSignUp = async () => {
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
    <div className="min-h-screen flex items-center justify-center bg-[#FFE6A7] px-6 py-10">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8 space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#99582A]">Create Account</h1>
          <p className="text-[#2C2C2C] mt-1">Start your premium shopping experience</p>
        </div>

        <form onSubmit={submitSignUpForm} className="space-y-3">

          {/* Full Name */}
          <div className='flex space-x-2'>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#2C2C2C]">First Name</label>
              <input
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-[#99582A]"
              />
              {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#2C2C2C]">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-[#99582A]"
              />
              {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#2C2C2C]">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-[#99582A]"
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#2C2C2C]">Phone Number</label>
            <input
              type="tel"
              placeholder="+2547XXXXXXXX"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-[#99582A]"
            />
            {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#2C2C2C]">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg bg-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-[#99582A]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeClosed /> : <Eye />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#2C2C2C]">Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg bg-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-[#99582A]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeClosed /> : <Eye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#99582A] text-white font-semibold rounded-lg hover:bg-[#7A461F] transition disabled:opacity-60"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#F0F0F0]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#666666]">or</span>
            </div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full py-3 border border-[#F0F0F0] rounded-lg flex items-center justify-center gap-3 hover:bg-[#F0F0F0] transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-[#2C2C2C] font-medium">Continue with Google</span>
          </button>

          {/* Sign in link */}
          <div className="text-center pt-1">
            <p className="text-[#666666]">
              Already have an account?{' '}
              <Link to={'/login'}>
                <button
                  type="button"
                  className="text-[#99582A] font-medium hover:underline"
                >
                  Sign in
                </button>
              </Link>
            </p>
          </div>

          {/* Continue as guest */}

          <div className="text-center pt-4 border-t border-[#EAEAEA]">
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
