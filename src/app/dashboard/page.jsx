'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import {
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} from '../../actions/server/booking';
import {
  getAllUsers,
  updateUserRole,
} from '../../actions/server/user';
import {
  User,
  Users,
  Calendar,
  LogOut,
  Home,
  CheckCircle,
  Clock,
  Trash2,
  SlidersHorizontal,
  Shield,
  ShieldAlert,
  ArrowLeft,
  UserCheck,
  UserX,
} from 'lucide-react';

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = session?.user?.role === 'admin';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allBookings, allUsers] = await Promise.all([
        getAllBookings(),
        getAllUsers(),
      ]);
      setBookings(allBookings);
      setUsers(allUsers);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated' && !isAdmin) {
      // Not an admin, don't fetch data
      setLoading(false);
      return;
    }
    if (status === 'authenticated' && isAdmin) {
      fetchData();
    }
  }, [status, isAdmin]);

  // Handle Logout
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of the Administrator Control Panel.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, log out',
    }).then((result) => {
      if (result.isConfirmed) {
        signOut({ callbackUrl: '/' });
      }
    });
  };

  // Confirm booking showing slot
  const handleConfirmBooking = (bookingId) => {
    Swal.fire({
      title: 'Confirm this showing?',
      text: 'Are you sure you want to approve this property visit request?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, confirm booking',
    }).then((result) => {
      if (result.isConfirmed) {
        updateBookingStatus(bookingId, 'Confirmed').then((res) => {
          if (res?.success) {
            setBookings(
              bookings.map((b) =>
                b._id === bookingId ? { ...b, status: 'Confirmed' } : b
              )
            );
            Swal.fire({
              title: 'Confirmed!',
              text: 'Property showing confirmed successfully.',
              icon: 'success',
              confirmButtonColor: '#10b981',
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: res?.error || 'Could not update status.',
              icon: 'error',
              confirmButtonColor: '#ef4444',
            });
          }
        });
      }
    });
  };

  // Cancel booking showing slot
  const handleCancelBooking = (bookingId, title) => {
    Swal.fire({
      title: 'Cancel walkthrough?',
      text: `Are you sure you want to cancel the tour request for "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, cancel it',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBooking(bookingId).then((res) => {
          if (res?.success) {
            setBookings(bookings.filter((b) => b._id !== bookingId));
            Swal.fire({
              title: 'Cancelled!',
              text: 'Walkthrough booking has been deleted.',
              icon: 'success',
              confirmButtonColor: '#10b981',
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: res?.error || 'Could not cancel booking.',
              icon: 'error',
              confirmButtonColor: '#ef4444',
            });
          }
        });
      }
    });
  };

  // Toggle User Role (make user admin / make admin user)
  const handleToggleRole = (user) => {
    const nextRole = user.role === 'admin' ? 'user' : 'admin';
    const actionText = nextRole === 'admin' ? 'Promote this user to Administrator?' : 'Demote this user to standard User?';

    Swal.fire({
      title: 'Modify User Role?',
      text: actionText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: nextRole === 'admin' ? '#3b82f6' : '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: nextRole === 'admin' ? 'Yes, Promote' : 'Yes, Demote',
    }).then((result) => {
      if (result.isConfirmed) {
        updateUserRole(user._id, nextRole).then((res) => {
          if (res?.success) {
            setUsers(
              users.map((u) =>
                u._id === user._id ? { ...u, role: nextRole } : u
              )
            );
            Swal.fire({
              title: 'Success!',
              text: `User has been successfully updated to ${nextRole}.`,
              icon: 'success',
              confirmButtonColor: '#10b981',
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: res?.error || 'Failed to update user role.',
              icon: 'error',
              confirmButtonColor: '#ef4444',
            });
          }
        });
      }
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-ring loading-lg text-primary scale-125"></span>
          <p className="text-xs font-black uppercase tracking-widest text-base-content/40 animate-pulse">
            Loading Admin Control Room...
          </p>
        </div>
      </div>
    );
  }

  // If not admin, access denied
  if (status === 'authenticated' && !isAdmin) {
    return (
      <div className="min-h-screen bg-base-300 text-base-content flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-base-200 border border-base-100 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-error/10 flex items-center justify-center text-error border border-error/25">
            <ShieldAlert size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase tracking-tight">Access Denied</h1>
            <p className="text-xs text-base-content/60 font-bold leading-relaxed">
              This panel is restricted exclusively to authorized administrators. Standard accounts do not possess appropriate clearances.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/profile"
              className="btn btn-primary rounded-full w-full font-bold uppercase text-xs flex items-center justify-center gap-2 text-white shadow-lg shadow-primary/20"
            >
              <ArrowLeft size={16} /> Return To Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Count states
  const totalBookingsCount = bookings.length;
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const pendingCount = totalBookingsCount - confirmedCount;
  const totalUsersCount = users.length;

  return (
    <div className="min-h-screen bg-base-300 text-base-content flex flex-col lg:flex-row transition-all duration-300">
      
      {/* 1. SIDEBAR */}
      <aside className="w-full lg:w-80 bg-base-200 border-r border-base-100 flex flex-col justify-between shrink-0 p-6 gap-6 relative">
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-accent-content font-black text-xl shadow-lg shadow-accent/30 group-hover:scale-105 transition-transform duration-300">
              A
            </div>
            <span className="text-xl font-black bg-linear-to-r from-accent to-indigo-500 bg-clip-text text-transparent tracking-tight">
              ESTATE<span className="text-base-content font-bold">CONTROL</span>
            </span>
          </Link>

          {/* Admin Avatar */}
          <div className="flex items-center gap-3 p-3 bg-base-100/50 rounded-2xl border border-base-100/60 shadow-xs">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'Admin'}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-accent/20 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-accent-content font-black text-base shrink-0 uppercase shadow-md">
                {session?.user?.name ? session.user.name.slice(0, 2) : 'AD'}
              </div>
            )}
            <div className="overflow-hidden">
              <h4 className="font-extrabold text-xs text-base-content truncate">{session?.user?.name || 'Administrator'}</h4>
              <span className="text-[10px] text-accent font-black tracking-wider uppercase block mt-0.5">
                Root System Admin
              </span>
            </div>
          </div>

          {/* Navigation Tab Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider w-full text-left transition-all ${
                activeTab === 'bookings'
                  ? 'bg-accent text-accent-content shadow-lg shadow-accent/20 scale-[1.01]'
                  : 'hover:bg-base-100 text-base-content/75 hover:text-accent'
              }`}
            >
              <Calendar size={16} />
              Manage Bookings
              <span className="badge badge-sm badge-neutral ml-auto font-black">{totalBookingsCount}</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider w-full text-left transition-all ${
                activeTab === 'users'
                  ? 'bg-accent text-accent-content shadow-lg shadow-accent/20 scale-[1.01]'
                  : 'hover:bg-base-100 text-base-content/75 hover:text-accent'
              }`}
            >
              <Users size={16} />
              Manage Users
              <span className="badge badge-sm badge-neutral ml-auto font-black">{totalUsersCount}</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-3 pt-6 border-t border-base-100/50">
          <Link
            href="/profile"
            className="btn btn-outline btn-accent btn-sm rounded-full w-full font-bold flex items-center justify-center gap-2 text-xs"
          >
            <User size={14} />
            My Personal Profile
          </Link>
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-error btn-sm rounded-full w-full font-bold flex items-center justify-center gap-2 text-xs"
          >
            <LogOut size={14} />
            Exit Console
          </button>
        </div>
      </aside>

      {/* 2. MAIN ADMIN WORKSPACE */}
      <main className="flex-1 p-6 lg:p-10 space-y-10 overflow-y-auto">
        
        {/* Banner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-base-200 pb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-base-content uppercase flex items-center gap-2.5">
              <SlidersHorizontal size={26} className="text-accent" />
              Admin Control Room
            </h1>
            <p className="text-xs text-base-content/60 font-bold mt-1">
              Authorized personnel access only. Maintain and configure bookings and permissions.
            </p>
          </div>
          <div>
            <Link href="/" className="btn btn-neutral btn-sm rounded-full font-bold text-xs">
              <Home size={14} /> View Live Website
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-base-200/60 border border-base-100/60 p-6 rounded-3xl shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/25 text-accent flex items-center justify-center shadow-inner shrink-0">
              <Calendar size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black text-base-content/40 uppercase tracking-widest block">Total Tours</span>
              <span className="text-3xl font-black text-base-content block mt-1">{totalBookingsCount} Slots</span>
            </div>
          </div>
          
          <div className="bg-base-200/60 border border-base-100/60 p-6 rounded-3xl shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-success/10 border border-success/25 text-success flex items-center justify-center shadow-inner shrink-0">
              <CheckCircle size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black text-base-content/40 uppercase tracking-widest block">Approved</span>
              <span className="text-3xl font-black text-base-content block mt-1">{confirmedCount} Active</span>
            </div>
          </div>

          <div className="bg-base-200/60 border border-base-100/60 p-6 rounded-3xl shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-warning/10 border border-warning/25 text-warning flex items-center justify-center shadow-inner shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black text-base-content/40 uppercase tracking-widest block">Awaiting</span>
              <span className="text-3xl font-black text-base-content block mt-1">{pendingCount} Pending</span>
            </div>
          </div>

          <div className="bg-base-200/60 border border-base-100/60 p-6 rounded-3xl shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-500 flex items-center justify-center shadow-inner shrink-0">
              <Users size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black text-base-content/40 uppercase tracking-widest block">Total Users</span>
              <span className="text-3xl font-black text-base-content block mt-1">{totalUsersCount} Accounts</span>
            </div>
          </div>
        </div>

        {/* Tab Workspaces */}
        <div className="bg-base-200 border border-base-100 rounded-3xl p-6 lg:p-8 shadow-xl">
          
          {/* TAB 1: MANAGE BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-base-100 pb-4">
                <h3 className="text-lg font-black text-base-content uppercase tracking-tight flex items-center gap-2">
                  <Calendar size={18} className="text-accent" />
                  Showing Bookings Catalog
                </h3>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <Calendar size={48} className="mx-auto text-base-content/20" />
                  <p className="text-sm font-extrabold text-base-content/40 uppercase tracking-widest">
                    No showings scheduled in system.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="table w-full">
                    <thead>
                      <tr className="border-b border-base-100/60 font-black text-[10px] text-base-content/40 tracking-wider uppercase">
                        <th>Property Listing</th>
                        <th>Client Details</th>
                        <th>Date & Time</th>
                        <th>Tour Status</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-base-100/40">
                      {bookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-base-100/20 transition-colors">
                          <td className="font-extrabold text-xs text-base-content py-4">{booking.propertyTitle}</td>
                          <td className="text-xs font-semibold text-base-content/85">
                            <div className="font-extrabold">{booking.userName || 'Client'}</div>
                            <div className="text-[10px] text-base-content/55 font-bold mt-0.5">{booking.userEmail}</div>
                            {booking.phone && (
                              <div className="text-[10px] text-accent/80 font-bold mt-0.5">{booking.phone}</div>
                            )}
                            {booking.message && (
                              <div className="text-[10px] bg-base-100 p-2 rounded-lg mt-1 text-base-content/75 font-normal max-w-xs break-words">
                                {booking.message}
                              </div>
                            )}
                          </td>
                          <td className="text-xs font-bold text-accent">{booking.date} at {booking.time}</td>
                          <td>
                            <span
                              className={`badge badge-sm font-black uppercase text-[8px] tracking-wider px-2 py-2 ${
                                booking.status === 'Confirmed' ? 'badge-success text-white' : 'badge-warning text-white'
                              }`}
                            >
                              {booking.status || 'Pending'}
                            </span>
                          </td>
                          <td className="text-right">
                            <div className="flex justify-end items-center gap-2">
                              {booking.status !== 'Confirmed' && (
                                <button
                                  onClick={() => handleConfirmBooking(booking._id)}
                                  className="btn btn-xs btn-success text-white rounded-full font-black px-3.5 hover:scale-[1.03] transition-transform"
                                >
                                  Confirm
                                </button>
                              )}
                              <button
                                onClick={() => handleCancelBooking(booking._id, booking.propertyTitle)}
                                className="btn btn-ghost btn-circle btn-sm hover:text-error"
                                aria-label="Cancel appointment"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MANAGE USERS */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-base-100 pb-4">
                <h3 className="text-lg font-black text-base-content uppercase tracking-tight flex items-center gap-2">
                  <Users size={18} className="text-accent" />
                  Account Permissions Console
                </h3>
              </div>

              {users.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <Users size={48} className="mx-auto text-base-content/20" />
                  <p className="text-sm font-extrabold text-base-content/40 uppercase tracking-widest">
                    No registered user accounts found.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="table w-full">
                    <thead>
                      <tr className="border-b border-base-100/60 font-black text-[10px] text-base-content/40 tracking-wider uppercase">
                        <th>User Avatar & Name</th>
                        <th>Email Address</th>
                        <th>OAuth Provider</th>
                        <th>Access Clearance</th>
                        <th className="text-right">Administrative Privilege Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-base-100/40">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-base-100/20 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              {u.image ? (
                                <img
                                  src={u.image}
                                  alt={u.name}
                                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-base-content/10 shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/25 text-accent flex items-center justify-center font-extrabold text-[11px] shrink-0 uppercase shadow-inner">
                                  {u.name ? u.name.slice(0, 2) : 'US'}
                                </div>
                              )}
                              <span className="font-extrabold text-xs text-base-content">{u.name}</span>
                            </div>
                          </td>
                          <td className="text-xs font-semibold text-base-content/85">{u.email}</td>
                          <td>
                            <span className="text-[10px] font-black uppercase tracking-wider badge badge-ghost badge-sm text-base-content/60">
                              {u.provider || 'credentials'}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge badge-sm font-black uppercase text-[8px] tracking-wider px-2.5 py-2 flex items-center gap-1 w-fit ${
                                u.role === 'admin' ? 'badge-primary text-white' : 'badge-neutral text-base-content/70'
                              }`}
                            >
                              {u.role === 'admin' ? (
                                <>
                                  <Shield size={10} /> Admin
                                </>
                              ) : (
                                <>
                                  <User size={10} /> User
                                </>
                              )}
                            </span>
                          </td>
                          <td className="text-right">
                            {/* Prevent modifying own logged-in admin role to stay safe */}
                            {u.email === session?.user?.email ? (
                              <span className="text-[10px] font-black text-accent/50 uppercase tracking-wider mr-2">
                                (You / Root Admin)
                              </span>
                            ) : (
                              <button
                                onClick={() => handleToggleRole(u)}
                                className={`btn btn-xs rounded-full font-black px-3.5 hover:scale-[1.03] transition-transform ${
                                  u.role === 'admin'
                                    ? 'btn-outline btn-error'
                                    : 'btn-outline btn-accent'
                                }`}
                              >
                                {u.role === 'admin' ? (
                                  <span className="flex items-center gap-1 uppercase text-[9px]"><UserX size={12} /> Demote to User</span>
                                ) : (
                                  <span className="flex items-center gap-1 uppercase text-[9px]"><UserCheck size={12} /> Promote to Admin</span>
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>

      </main>

    </div>
  );
};

export default AdminDashboard;
