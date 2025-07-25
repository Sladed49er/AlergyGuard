'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Mail, 
  Lock, 
  AlertCircle,
  Heart,
  Sparkles,
  Apple,
  Wheat,
  Fish,
  Milk
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Floating allergen icons for background
  const floatingIcons = [
    { Icon: Apple, delay: 0, duration: 20, initialX: -100, initialY: 100 },
    { Icon: Wheat, delay: 5, duration: 25, initialX: 400, initialY: 50 },
    { Icon: Fish, delay: 10, duration: 30, initialX: 200, initialY: 300 },
    { Icon: Milk, delay: 15, duration: 22, initialX: -50, initialY: 200 },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-blue-200/20"
            initial={{ x: item.initialX, y: item.initialY }}
            animate={{
              x: [item.initialX, item.initialX + 300, item.initialX],
              y: [item.initialY, item.initialY - 100, item.initialY],
              rotate: [0, 360],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <item.Icon size={60} />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          {/* Logo and Header */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl mb-4">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AllergyGuard
            </h2>
            <p className="mt-2 text-gray-600">Protecting your family, one meal at a time</p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 text-center flex items-center justify-center gap-2">
                Welcome Back
                <Heart className="w-6 h-6 text-pink-500 animate-pulse" />
              </h3>
              <p className="text-center text-gray-600 mt-1">Sign in to keep your family safe</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="family@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full relative py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <Sparkles className="w-5 h-5 ml-2" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                New to AllergyGuard?{' '}
                <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                  Create an account
                </Link>
              </p>
            </div>

            {/* Features */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="inline-flex p-2 bg-blue-100 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-600">Safe Meals</p>
                </div>
                <div className="space-y-2">
                  <div className="inline-flex p-2 bg-purple-100 rounded-lg">
                    <Heart className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-600">Family Care</p>
                </div>
                <div className="space-y-2">
                  <div className="inline-flex p-2 bg-pink-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-pink-600" />
                  </div>
                  <p className="text-xs text-gray-600">Instant Alerts</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}