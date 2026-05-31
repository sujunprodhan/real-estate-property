'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import Swal from 'sweetalert2';

const AuthButton = ({ scrolled }) => {
  const { data: session, status } = useSession();

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        signOut();
      }
    });
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-10 w-28">
        <span className="loading loading-spinner loading-xs text-primary"></span>
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="dropdown dropdown-end">
        {/* Dropdown Toggle (Only User Avatar) */}
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar hover:scale-105 active:scale-95 transition-all duration-300 ring-2 ring-primary/20 hover:ring-primary/45"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center text-primary-content font-extrabold text-sm uppercase">
                {session.user.name ? session.user.name.slice(0, 2) : 'US'}
              </div>
            )}
          </div>
        </div>

        {/* Dropdown Menu */}
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-50 p-2.5 shadow-2xl bg-base-100/95 backdrop-blur-md border border-base-200 rounded-2xl w-56 space-y-1.5"
        >
          {/* User Info Header */}
          <li className="px-3 py-2 border-b border-base-200/60 pointer-events-none mb-1">
            <span className="text-xs font-black text-base-content block truncate">{session.user.name}</span>
            <span className="text-[10px] text-base-content/50 font-bold block truncate mt-0.5">{session.user.email}</span>
          </li>

          {/* Profile Option */}
          <li>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-base-content/85 hover:bg-primary/10 hover:text-primary transition-all"
            >
              My Profile
            </Link>
          </li>

          {/* Log Out Option */}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-error hover:bg-error/10 hover:text-error transition-all w-full text-left"
            >
              <LogOut size={14} className="stroke-[2.5]" />
              Log Out
            </button>
          </li>
        </ul>
      </div>
    );
  }


  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
      <Link
        href={'/login'}
        className={`btn btn-ghost rounded-full w-full sm:w-28 font-semibold border transition-all flex items-center justify-center ${
          scrolled 
            ? 'border-base-content/20 text-base-content hover:bg-primary/10 hover:text-primary' 
            : 'border-white/30 text-white hover:bg-white/10 hover:text-white'
        }`}
      >
        Login
      </Link>
      <Link
        href={'/register'}
        className="btn btn-primary rounded-full w-full sm:w-28 font-semibold shadow-lg shadow-primary/30 border-none text-white flex items-center justify-center shrink-0"
      >
        Sign Up
      </Link>
    </div>
  );
};

export default AuthButton;

