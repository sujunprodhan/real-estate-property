'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const GithubLogin = () => {
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn('github', {
      callbackUrl: params.get('callback') || '/',
    });
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={loading}
      className="relative w-full group overflow-hidden transition-all duration-300 hover:scale-[1.015] active:scale-[0.97]"
    >
      {/* Outer glow on hover */}
      <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-slate-500/10 via-base-content/5 to-slate-400/10 blur-sm" />

      {/* Button body */}
      <span className="relative flex items-center justify-center gap-4 w-full bg-base-100 hover:bg-base-200/50 border border-base-300 hover:border-base-300/80 text-base-content rounded-2xl px-6 py-4 transition-all duration-300 shadow-sm hover:shadow">
        {/* GitHub logo */}
        <span className="flex-shrink-0 w-9 h-9 bg-base-200 dark:bg-white/10 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
          {loading ? (
            <span className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
          ) : (
            <svg
              className="w-5 h-5 shrink-0 fill-current text-base-content"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          )}
        </span>

        {/* Text */}
        <span className="flex flex-col text-left">
          <span className="text-base-content font-black text-sm tracking-tight leading-none">
            {loading ? 'Redirecting...' : 'GitHub Account'}
          </span>
        </span>

        {/* Right arrow shimmer effect */}
        <span className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-slate-400">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
    </button>
  );
};

export default GithubLogin;
