import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Link } from 'react-router';
import { supabase } from '../../authResource/supabaseClient';

export function SSOPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    setError('');
    return true;
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      toast.error('Please enter a valid email');
      return;
    }

    setLoading(true)

    // 1. Initiate the sign-in with OTP
    const {error} = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: window.location.origin + '/products'
        }
    });

    setLoading(false)
    setEmailSent(true)

    if (error) {
        toast.error(error.message);
    } else {
        const successMsg = "success! Check your email and click to log in instantly";
        toast.success(successMsg)
    }
  }

  // SUCCESS SCREEN
  if (emailSent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-lg bg-white shadow-md rounded-xl p-8 text-center space-y-6">
          <h2 className="text-2xl font-semibold text-[#2C2C2C]">Check Your Email</h2>
          <p className="text-[#666666]">
            We've sent an automatic login link
          </p>

          <div className="flex justify-center">
            <div className="w-20 h-20 bg-[#FFE6A7] rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-[#99582A]" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>Email sent successfully</span>
            </div>

            <p className="text-[#666666]">
              We've sent a magic link to<br />
              <span className="text-[#2C2C2C]">{email}</span>
            </p>

            <p className="text-sm text-[#999999]">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setEmailSent(false)}
              className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
            >
              Try Another Email
            </button>

            <Link to={'/login'}>
              <button
                type="button"
                className="w-full text-[#99582A] hover:underline flex items-center justify-center gap-2 pt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // FORM SCREEN
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-[#2C2C2C] text-center">Magic Link</h2>
        <p className="text-center text-[#666666] mt-1">
          Enter your email to receive an automatic login link
        </p>

        <form onSubmit={handleMagicLink} className="space-y-5 mt-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-[#2C2C2C]">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:border-[#99582A] focus:ring-[#99582A]"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#99582A] text-white py-2 rounded-lg hover:bg-[#7d4520] transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>

          {/* Back to login */}
          <Link to={'/login'}>
            <button
              type="button"
              className="w-full text-[#99582A] hover:underline flex items-center justify-center gap-2 pt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
