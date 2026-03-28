'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

import { login } from '../actions';

export default function AdminLoginPage() {
  const router = useRouter(); // Keeping for other navigation if needed, but and form action will handle redirect
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      if (result.error.includes('Invalid login credentials')) {
        setError('Incorrect email or password. Please check your credentials.');
      } else {
        setError(result.error);
      }
      setLoading(false);
    }
    // If successful, the server action will redirect automatically
  }

  if (!mounted) return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-white/20 border-t-brand-secondary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10 space-y-4">
          <Image src="/logo.png" alt="FitZone Apparels" width={60} height={60} className="rounded-xl" style={{ filter: 'brightness(0) invert(1)' }} />
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              FIT<span className="text-brand-secondary">ZONE</span> Admin
            </h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to access the dashboard</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-brand-lg shadow-float p-8 space-y-6">
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-brand p-4 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-brand-dark">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="amrit@fitzone.in"
                  className="w-full pl-10 pr-4 py-3 rounded-brand border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-brand-dark">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-brand border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" /> Sign In
                </span>
              )}
            </Button>
          </form>

          <p className="text-xs text-center text-brand-muted">
            Only authorised FitZone administrators can access this area.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
