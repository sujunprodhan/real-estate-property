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
  getProperty,
  addProperty,
  updateProperty,
  deleteProperty,
} from '../../actions/server/property';
import {
  getBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
} from '../../actions/server/blog';
import { getUnreadCount } from '../../actions/server/message';
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
  Building,
  BookOpen,
  Plus,
  Edit,
  DollarSign,
  MapPin,
  Tag,
  MessageSquare,
} from 'lucide-react';
import ChatInterface from '../../componets/chat/ChatInterface';

const propertyPresets = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
];

const blogPresets = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
];

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Property Modals
  const [showPropertyModal, setShowPropertyModal] = useState(false); // false | 'add' | 'edit'
  const [propertyImageFile, setPropertyImageFile] = useState(null);
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    price: '',
    location: '',
    image: '',
    beds: '',
    baths: '',
    sqft: '',
    type: 'Villa',
    description: '',
    category: 'Villa',
  });

  // Blog Modals
  const [showBlogModal, setShowBlogModal] = useState(false); // false | 'add' | 'edit'
  const [blogImageFile, setBlogImageFile] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    tag: 'Market Insights',
    excerpt: '',
    image: '',
    introduction: '',
    contentParagraphs: '',
  });

  const isAdmin = session?.user?.role === 'admin';

  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '801df07212c14c5c7db6a2aee813d11b';
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) return data.data.url;
      return null;
    } catch (err) {
      return null;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allBookings, allUsers, allProperties, allBlogs] = await Promise.all([
        getAllBookings(),
        getAllUsers(),
        getProperty(),
        getBlogs(),
      ]);
      setBookings(allBookings);
      setUsers(allUsers);
      setProperties(allProperties);
      setBlogs(allBlogs);
    } catch (err) {
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
      setLoading(false);
      return;
    }
    if (status === 'authenticated' && isAdmin) {
      fetchData();
      
      const checkUnread = async () => {
        try {
          const count = await getUnreadCount(session.user.email, true);
          setUnreadCount(count);
        } catch (err) {
          console.error(err);
        }
      };
      
      checkUnread();
      const interval = setInterval(checkUnread, 3000);
      return () => clearInterval(interval);
    }
  }, [status, isAdmin]);

  // Handle auto-open via search params
  useEffect(() => {
    if (status === 'authenticated' && isAdmin) {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab');
      
      if (tabParam) {
        setActiveTab(tabParam);
      }
      
      if (searchParams.get('addProperty') === 'true') {
        setActiveTab('properties');
        handleOpenAddProperty();
        window.history.replaceState(null, '', '/dashboard?tab=properties');
      } else if (searchParams.get('addBlog') === 'true') {
        setActiveTab('blogs');
        handleOpenAddBlog();
        window.history.replaceState(null, '', '/dashboard?tab=blogs');
      } else if (tabParam) {
        window.history.replaceState(null, '', `/dashboard?tab=${tabParam}`);
      }
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

  // Confirm booking
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

  // Reject booking
  const handleRejectBooking = (bookingId) => {
    Swal.fire({
      title: 'Reject this showing?',
      text: 'Are you sure you want to decline this property visit request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, reject request',
    }).then((result) => {
      if (result.isConfirmed) {
        updateBookingStatus(bookingId, 'Rejected').then((res) => {
          if (res?.success) {
            setBookings(
              bookings.map((b) =>
                b._id === bookingId ? { ...b, status: 'Rejected' } : b
              )
            );
            Swal.fire({
              title: 'Rejected!',
              text: 'Property showing request has been declined.',
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

  // Cancel booking
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

  // Promote demote user roles
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

  // Property Handlers
  const handleOpenAddProperty = () => {
    setPropertyImageFile(null);
    setPropertyForm({
      title: '',
      price: '',
      location: '',
      image: '',
      beds: '',
      baths: '',
      sqft: '',
      type: 'Villa',
      description: '',
      category: 'Villa',
    });
    setShowPropertyModal('add');
  };

  const handleOpenEditProperty = (prop) => {
    setPropertyImageFile(null);
    setPropertyForm({
      _id: prop._id,
      title: prop.title || '',
      price: prop.price || '',
      location: prop.location || '',
      image: prop.image || (prop.images ? prop.images[0] : ''),
      beds: prop.beds || '',
      baths: prop.baths || '',
      sqft: prop.sqft || '',
      type: prop.type || prop.propertyType || 'Villa',
      description: prop.description || '',
      category: prop.category || prop.propertyType || 'Villa',
    });
    setShowPropertyModal('edit');
  };

  const handleDeleteProperty = (propertyId, title) => {
    Swal.fire({
      title: 'Delete Property Listing?',
      text: `Are you sure you want to permanently delete "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProperty(propertyId).then((res) => {
          if (res?.success) {
            setProperties(properties.filter((p) => p._id !== propertyId));
            Swal.fire('Deleted!', 'Property has been deleted.', 'success');
          } else {
            Swal.fire('Error!', res?.error || 'Could not delete property.', 'error');
          }
        });
      }
    });
  };

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = propertyForm.image;
      if (propertyImageFile) {
        finalImageUrl = await uploadImageToImgbb(propertyImageFile) || propertyForm.image;
      }
      const dataToSubmit = { ...propertyForm, image: finalImageUrl, images: [finalImageUrl] };

      if (showPropertyModal === 'add') {
        const res = await addProperty(dataToSubmit);
        setLoading(false);
        if (res?.success) {
          setShowPropertyModal(false);
          fetchData();
          Swal.fire('Added!', 'Property listing has been created.', 'success');
        } else {
          Swal.fire('Error!', res?.error || 'Failed to create listing.', 'error');
        }
      } else if (showPropertyModal === 'edit') {
        const res = await updateProperty(propertyForm._id, dataToSubmit);
        setLoading(false);
        if (res?.success) {
          setShowPropertyModal(false);
          fetchData();
          Swal.fire('Updated!', 'Property listing has been updated.', 'success');
        } else {
          Swal.fire('Error!', res?.error || 'Failed to update listing.', 'error');
        }
      }
    } catch (err) {
      setLoading(false);
      Swal.fire('Error!', 'An unexpected error occurred.', 'error');
    }
  };

  // Blog Handlers
  const handleOpenAddBlog = () => {
    setBlogImageFile(null);
    setBlogForm({
      title: '',
      tag: 'Market Insights',
      excerpt: '',
      image: '',
      introduction: '',
      contentParagraphs: '',
    });
    setShowBlogModal('add');
  };

  const handleOpenEditBlog = (post) => {
    setBlogImageFile(null);
    const paragraphsText = post.content
      ? post.content
          .filter((c) => c.type === 'paragraph')
          .map((c) => c.text)
          .join('\n\n')
      : '';

    setBlogForm({
      _id: post._id,
      title: post.title || '',
      tag: post.tag || 'Market Insights',
      excerpt: post.excerpt || '',
      image: post.image || '',
      introduction: post.introduction || '',
      contentParagraphs: paragraphsText,
    });
    setShowBlogModal('edit');
  };

  const handleDeleteBlog = (blogId, title) => {
    Swal.fire({
      title: 'Delete Blog Article?',
      text: `Are you sure you want to permanently delete "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBlog(blogId).then((res) => {
          if (res?.success) {
            setBlogs(blogs.filter((b) => b._id !== blogId));
            Swal.fire('Deleted!', 'Blog article has been deleted.', 'success');
          } else {
            Swal.fire('Error!', res?.error || 'Could not delete blog.', 'error');
          }
        });
      }
    });
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const paragraphs = blogForm.contentParagraphs
        .split('\n\n')
        .filter(Boolean)
        .map((pText) => ({
          type: 'paragraph',
          text: pText.trim(),
        }));
        
      let finalImageUrl = blogForm.image;
      if (blogImageFile) {
        finalImageUrl = await uploadImageToImgbb(blogImageFile) || blogForm.image;
      }

      const blogData = {
        title: blogForm.title,
        tag: blogForm.tag,
        excerpt: blogForm.excerpt,
        image: finalImageUrl,
        introduction: blogForm.introduction,
        content: [
          { type: 'heading', text: '1. Overview & Insights' },
          ...paragraphs,
        ],
        author: {
          name: session?.user?.name || 'Administrator',
          role: 'Elite Advisor',
          avatar: session?.user?.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        },
      };

      if (showBlogModal === 'add') {
        const res = await addBlog(blogData);
        setLoading(false);
        if (res?.success) {
          setShowBlogModal(false);
          fetchData();
          Swal.fire('Added!', 'Blog article has been published.', 'success');
        } else {
          Swal.fire('Error!', res?.error || 'Failed to publish article.', 'error');
        }
      } else if (showBlogModal === 'edit') {
        const res = await updateBlog(blogForm._id, blogData);
        setLoading(false);
        if (res?.success) {
          setShowBlogModal(false);
          fetchData();
          Swal.fire('Updated!', 'Blog article has been updated.', 'success');
        } else {
          Swal.fire('Error!', res?.error || 'Failed to update article.', 'error');
        }
      }
    } catch (err) {
      setLoading(false);
      Swal.fire('Error!', 'An unexpected error occurred.', 'error');
    }
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
              <span className="badge badge-sm badge-neutral ml-auto font-black">{bookings.length}</span>
            </button>
            
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider w-full text-left transition-all ${
                activeTab === 'properties'
                  ? 'bg-accent text-accent-content shadow-lg shadow-accent/20 scale-[1.01]'
                  : 'hover:bg-base-100 text-base-content/75 hover:text-accent'
              }`}
            >
              <Building size={16} />
              Manage Properties
              <span className="badge badge-sm badge-neutral ml-auto font-black">{properties.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('blogs')}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider w-full text-left transition-all ${
                activeTab === 'blogs'
                  ? 'bg-accent text-accent-content shadow-lg shadow-accent/20 scale-[1.01]'
                  : 'hover:bg-base-100 text-base-content/75 hover:text-accent'
              }`}
            >
              <BookOpen size={16} />
              Manage Blogs
              <span className="badge badge-sm badge-neutral ml-auto font-black">{blogs.length}</span>
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
              <span className="badge badge-sm badge-neutral ml-auto font-black">{users.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider w-full text-left transition-all relative ${
                activeTab === 'messages'
                  ? 'bg-accent text-accent-content shadow-lg shadow-accent/20 scale-[1.01]'
                  : 'hover:bg-base-100 text-base-content/75 hover:text-accent'
              }`}
            >
              <MessageSquare size={16} />
              User Messages
              {unreadCount > 0 && (
                <span className="badge badge-sm badge-accent absolute top-3.5 right-4 font-black animate-pulse">{unreadCount}</span>
              )}
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
              Authorized personnel access only. Maintain listings, bookings, blog stories, and permissions.
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
              <span className="text-3xl font-black text-base-content block mt-1">{bookings.length} Slots</span>
            </div>
          </div>
          
          <div className="bg-base-200/60 border border-base-100/60 p-6 rounded-3xl shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-success/10 border border-success/25 text-success flex items-center justify-center shadow-inner shrink-0">
              <Building size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black text-base-content/40 uppercase tracking-widest block">Properties</span>
              <span className="text-3xl font-black text-base-content block mt-1">{properties.length} Listings</span>
            </div>
          </div>

          <div className="bg-base-200/60 border border-base-100/60 p-6 rounded-3xl shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-warning/10 border border-warning/25 text-warning flex items-center justify-center shadow-inner shrink-0">
              <BookOpen size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black text-base-content/40 uppercase tracking-widest block">Blog Stories</span>
              <span className="text-3xl font-black text-base-content block mt-1">{blogs.length} Articles</span>
            </div>
          </div>

          <div className="bg-base-200/60 border border-base-100/60 p-6 rounded-3xl shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-500 flex items-center justify-center shadow-inner shrink-0">
              <Users size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black text-base-content/40 uppercase tracking-widest block">Total Users</span>
              <span className="text-3xl font-black text-base-content block mt-1">{users.length} Accounts</span>
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
                          <td className="font-extrabold text-xs text-base-content py-4">
                            <div className="flex items-center gap-3">
                              {booking.propertyImage && (
                                <img src={booking.propertyImage} alt={booking.propertyTitle} className="w-10 h-10 rounded-lg object-cover shadow-sm" />
                              )}
                              <span>{booking.propertyTitle}</span>
                            </div>
                          </td>
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
                                booking.status === 'Confirmed' ? 'badge-success text-white' :
                                booking.status === 'Rejected' ? 'badge-error text-white' : 'badge-warning text-white'
                              }`}
                            >
                              {booking.status || 'Pending'}
                            </span>
                          </td>
                          <td className="text-right">
                            <div className="flex justify-end items-center gap-2">
                              {booking.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => handleConfirmBooking(booking._id)}
                                    className="btn btn-xs btn-success text-white rounded-full font-black px-3 py-2 hover:scale-[1.03] transition-transform"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectBooking(booking._id)}
                                    className="btn btn-xs btn-error text-white rounded-full font-black px-3 py-2 hover:scale-[1.03] transition-transform"
                                  >
                                    Reject
                                  </button>
                                </>
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

          {/* TAB 2: MANAGE PROPERTIES */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-base-100 pb-4">
                <h3 className="text-lg font-black text-base-content uppercase tracking-tight flex items-center gap-2">
                  <Building size={18} className="text-accent" />
                  Estate Inventory Control
                </h3>
                <button
                  onClick={handleOpenAddProperty}
                  className="btn btn-accent btn-sm rounded-full font-black text-xs text-white flex items-center gap-1 shadow-lg shadow-accent/20"
                >
                  <Plus size={14} /> Add Property
                </button>
              </div>

              {properties.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <Building size={48} className="mx-auto text-base-content/20" />
                  <p className="text-sm font-extrabold text-base-content/40 uppercase tracking-widest">
                    No properties in catalogue.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="table w-full">
                    <thead>
                      <tr className="border-b border-base-100/60 font-black text-[10px] text-base-content/40 tracking-wider uppercase">
                        <th>Property Listing</th>
                        <th>Location</th>
                        <th>Type / Category</th>
                        <th>Price Tag</th>
                        <th className="text-right">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-base-100/40">
                      {properties.map((prop) => (
                        <tr key={prop._id} className="hover:bg-base-100/20 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              {(prop.image || (prop.images && prop.images[0])) && (
                                <img
                                  src={prop.image || prop.images[0]}
                                  alt={prop.title}
                                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-base-content/10 shrink-0"
                                />
                              )}
                              <div>
                                <span className="font-extrabold text-xs text-base-content block">{prop.title}</span>
                                <span className="text-[9px] text-base-content/50 font-bold block mt-0.5">
                                  {prop.beds} Bed • {prop.baths} Bath • {prop.sqft} sqft
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="text-xs font-semibold text-base-content/85">
                            <span className="flex items-center gap-1">
                              <MapPin size={12} className="text-accent" />
                              {typeof prop.location === 'object' ? `${prop.location?.city || prop.location?.address || ''}` : prop.location}
                            </span>
                          </td>
                          <td>
                            <span className="text-[10px] font-black uppercase tracking-wider badge badge-neutral badge-sm">
                              {prop.category || prop.propertyType || 'Villa'}
                            </span>
                          </td>
                          <td className="text-xs font-black text-emerald-500">
                            ${(Number(prop.price) || 0).toLocaleString()}
                          </td>
                          <td className="text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditProperty(prop)}
                                className="btn btn-ghost btn-circle btn-sm hover:text-accent"
                                aria-label="Edit Property"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteProperty(prop._id, prop.title)}
                                className="btn btn-ghost btn-circle btn-sm hover:text-error"
                                aria-label="Delete Property"
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

          {/* TAB 3: MANAGE BLOGS */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-base-100 pb-4">
                <h3 className="text-lg font-black text-base-content uppercase tracking-tight flex items-center gap-2">
                  <BookOpen size={18} className="text-accent" />
                  Blog Insights Control
                </h3>
                <button
                  onClick={handleOpenAddBlog}
                  className="btn btn-accent btn-sm rounded-full font-black text-xs text-white flex items-center gap-1 shadow-lg shadow-accent/20"
                >
                  <Plus size={14} /> Add Blog Post
                </button>
              </div>

              {blogs.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <BookOpen size={48} className="mx-auto text-base-content/20" />
                  <p className="text-sm font-extrabold text-base-content/40 uppercase tracking-widest">
                    No articles published.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="table w-full">
                    <thead>
                      <tr className="border-b border-base-100/60 font-black text-[10px] text-base-content/40 tracking-wider uppercase">
                        <th>Blog Article Title</th>
                        <th>Insights Tag</th>
                        <th>Published Date</th>
                        <th>Author</th>
                        <th className="text-right">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-base-100/40">
                      {blogs.map((post) => (
                        <tr key={post._id || post.slug} className="hover:bg-base-100/20 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              {post.image && (
                                <img
                                  src={post.image}
                                  alt={post.title}
                                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-base-content/10 shrink-0"
                                />
                              )}
                              <div>
                                <span className="font-extrabold text-xs text-base-content block max-w-sm truncate">{post.title}</span>
                                <span className="text-[10px] text-base-content/50 font-semibold block mt-0.5 line-clamp-1">
                                  {post.excerpt}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="text-[10px] font-black uppercase tracking-wider badge badge-accent badge-sm">
                              {post.tag}
                            </span>
                          </td>
                          <td className="text-xs font-bold text-base-content/75">{post.date || 'Today'}</td>
                          <td className="text-xs font-semibold text-base-content/85">
                            {post.author?.name || 'Administrator'}
                          </td>
                          <td className="text-right">
                            {post._id ? (
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditBlog(post)}
                                  className="btn btn-ghost btn-circle btn-sm hover:text-accent"
                                  aria-label="Edit Blog"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteBlog(post._id, post.title)}
                                  className="btn btn-ghost btn-circle btn-sm hover:text-error"
                                  aria-label="Delete Blog"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] font-black text-accent/50 uppercase tracking-wider mr-2">
                                (Static Post)
                              </span>
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

          {/* TAB 4: MANAGE USERS */}
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
                                u.role === 'admin' ? 'badge-primary text-white' : 'badge-neutral text-base-content/77'
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

          {/* TAB 5: USER MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <ChatInterface session={session} isAdminMode={true} />
            </div>
          )}

        </div>

      </main>

      {/* ================= MODAL: ADD / EDIT PROPERTY ================= */}
      {showPropertyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-base-200 border border-base-100 rounded-[2.5rem] w-full max-w-2xl p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <h3 className="text-xl font-black uppercase text-base-content border-b border-base-100 pb-3 flex items-center gap-2">
              <Building size={20} className="text-accent" />
              {showPropertyModal === 'add' ? 'Create New Estate Listing' : 'Edit Estate Listing'}
            </h3>

            <form onSubmit={handlePropertySubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="text-[10px] font-black uppercase text-base-content/65">Property Title</span>
                  </label>
                  <input
                    type="text"
                    value={propertyForm.title}
                    onChange={(e) => setPropertyForm({ ...propertyForm, title: e.target.value })}
                    placeholder="e.g. Modernist Oceanfront Villa"
                    className="input input-bordered w-full rounded-2xl bg-base-100 border-base-100 font-bold text-xs"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="text-[10px] font-black uppercase text-base-content/65">Price (USD)</span>
                  </label>
                  <input
                    type="number"
                    value={propertyForm.price}
                    onChange={(e) => setPropertyForm({ ...propertyForm, price: e.target.value })}
                    placeholder="e.g. 1250000"
                    className="input input-bordered w-full rounded-2xl bg-base-100 border-base-100 font-bold text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="text-[10px] font-black uppercase text-base-content/65">Location</span>
                  </label>
                  <input
                    type="text"
                    value={typeof propertyForm.location === 'object' ? `${propertyForm.location?.city || propertyForm.location?.address || ''}` : propertyForm.location || ''}
                    onChange={(e) => setPropertyForm({ ...propertyForm, location: e.target.value })}
                    placeholder="e.g. Miami Beach, Florida"
                    className="input input-bordered w-full rounded-2xl bg-base-100 border-base-100 font-bold text-xs"
                    required
                  />
                </div>
                
                {/* Cover Image with Presets and Preview */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="text-[10px] font-black uppercase text-base-content/65">Upload Cover Image</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setPropertyImageFile(file);
                        setPropertyForm({ ...propertyForm, image: URL.createObjectURL(file) });
                      }
                    }}
                    className="file-input file-input-bordered w-full rounded-2xl bg-base-100 border-base-100 font-bold text-xs"
                    required={!propertyForm.image}
                  />
                  
                  {/* Preset picker */}
                  <div className="mt-2 space-y-1">
                    <span className="text-[8px] font-black text-accent uppercase tracking-wider block">Click a preset image option:</span>
                    <div className="flex gap-2.5 overflow-x-auto py-1">
                      {propertyPresets.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPropertyForm({ ...propertyForm, image: url })}
                          className={`w-14 h-10 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${propertyForm.image === url ? 'border-accent scale-105' : 'border-transparent hover:scale-105'}`}
                        >
                          <img src={url} alt="preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live preview */}
                  {propertyForm.image && (
                    <div className="mt-3 aspect-video w-full max-w-[200px] rounded-xl overflow-hidden border border-base-100 shadow-inner">
                      <img src={propertyForm.image} alt="Live Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="text-[10px] font-black uppercase text-base-content/65">Bedrooms</span>
                  </label>
                  <input
                    type="number"
                    value={propertyForm.beds}
                    onChange={(e) => setPropertyForm({ ...propertyForm, beds: e.target.value })}
                    placeholder="e.g. 4"
                    className="input input-bordered w-full rounded-2xl bg-base-100 border-base-100 font-bold text-xs"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="text-[10px] font-black uppercase text-base-content/65">Bathrooms</span>
                  </label>
                  <input
                    type="number"
                    value={propertyForm.baths}
                    onChange={(e) => setPropertyForm({ ...propertyForm, baths: e.target.value })}
                    placeholder="e.g. 3"
                    className="input input-bordered w-full rounded-2xl bg-base-100 border-base-100 font-bold text-xs"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="text-[10px] font-black uppercase text-base-content/65">Square Feet</span>
                  </label>
                  <input
                    type="number"
                    value={propertyForm.sqft}
                    onChange={(e) => setPropertyForm({ ...propertyForm, sqft: e.target.value })}
                    placeholder="e.g. 3200"
                    className="input input-bordered w-full rounded-2xl bg-base-100 border-base-100 font-bold text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="text-[10px] font-black uppercase text-base-content/65">Property Type</span>
                  </label>
                  <select
                    value={propertyForm.type}
                    onChange={(e) => setPropertyForm({ ...propertyForm, type: e.target.value, category: e.target.value })}
                    className="select select-bordered w-full rounded-2xl bg-base-100 border-base-100 font-bold text-xs focus:outline-none"
                  >
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Land">Land</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="text-[10px] font-black uppercase text-base-content/65">Listing Description</span>
                </label>
                <textarea
                  value={propertyForm.description}
                  onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
                  placeholder="Describe your premium listing specs..."
                  className="textarea textarea-bordered w-full rounded-2xl bg-base-100 border-base-100 font-bold text-xs h-24"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPropertyModal(false)}
                  className="btn btn-ghost rounded-full px-6 font-extrabold uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-accent text-white rounded-full px-8 font-extrabold uppercase text-xs"
                >
                  {showPropertyModal === 'add' ? 'Publish Listing' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT BLOG ================= */}
      {showBlogModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-base-200 border border-base-100 rounded-[2.5rem] w-full max-w-2xl p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <h3 className="text-xl font-black uppercase text-base-content border-b border-base-100 pb-3 flex items-center gap-2">
              <BookOpen size={20} className="text-accent" />
              {showBlogModal === 'add' ? 'Publish New Blog Post' : 'Edit Blog Post'}
            </h3>

            <form onSubmit={handleBlogSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="text-[10px] font-black uppercase text-base-content/65">Article Title</span>
                  </label>
                  <input
                    type="text"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    placeholder="e.g. Coastal Land Investments Trends"
                    className="input input-bordered w-full rounded-2xl bg-base-100 border-base-100 font-bold text-xs"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="text-[10px] font-black uppercase text-base-content/65">Category Tag</span>
                  </label>
                  <select
                    value={blogForm.tag}
                    onChange={(e) => setBlogForm({ ...blogForm, tag: e.target.value })}
                    className="select select-bordered w-full rounded-2xl bg-base-100 border-base-100 font-bold text-xs focus:outline-none"
                  >
                    <option value="Market Insights">Market Insights</option>
                    <option value="Interior Design">Interior Design</option>
                    <option value="Home Guide">Home Guide</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="text-[10px] font-black uppercase text-base-content/65">Excerpt / Sub-headline</span>
                </label>
                <input
                  type="text"
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  placeholder="Provide a quick 1-sentence description..."
                  className="input input-bordered w-full rounded-2xl bg-base-100 border-base-100 font-bold text-xs"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="text-[10px] font-black uppercase text-base-content/65">Upload Cover Image</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setBlogImageFile(file);
                      setBlogForm({ ...blogForm, image: URL.createObjectURL(file) });
                    }
                  }}
                  className="file-input file-input-bordered w-full rounded-2xl bg-base-100 border-base-100 font-bold text-xs"
                  required={!blogForm.image}
                />

                {/* Blog Preset picker */}
                <div className="mt-2 space-y-1">
                  <span className="text-[8px] font-black text-accent uppercase tracking-wider block">Click a preset image option:</span>
                  <div className="flex gap-2.5 overflow-x-auto py-1">
                    {blogPresets.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setBlogForm({ ...blogForm, image: url })}
                        className={`w-14 h-10 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${blogForm.image === url ? 'border-accent scale-105' : 'border-transparent hover:scale-105'}`}
                      >
                        <img src={url} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Blog Live preview */}
                {blogForm.image && (
                  <div className="mt-3 aspect-video w-full max-w-[200px] rounded-xl overflow-hidden border border-base-100 shadow-inner">
                    <img src={blogForm.image} alt="Live Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="text-[10px] font-black uppercase text-base-content/65">Introduction Paragraph</span>
                </label>
                <textarea
                  value={blogForm.introduction}
                  onChange={(e) => setBlogForm({ ...blogForm, introduction: e.target.value })}
                  placeholder="Write the introduction for your article..."
                  className="textarea textarea-bordered w-full rounded-2xl bg-base-100 border-base-100 font-bold text-xs h-20"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label py-1 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-base-content/65">Content Paragraphs</span>
                  <span className="text-[8px] font-black text-accent uppercase tracking-wider">(Separate paragraphs with two enters / empty line)</span>
                </label>
                <textarea
                  value={blogForm.contentParagraphs}
                  onChange={(e) => setBlogForm({ ...blogForm, contentParagraphs: e.target.value })}
                  placeholder="Write paragraph content here.&#10;&#10;Press Enter twice to start the next paragraph."
                  className="textarea textarea-bordered w-full rounded-2xl bg-base-100 border-base-100 font-bold text-xs h-36"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBlogModal(false)}
                  className="btn btn-ghost rounded-full px-6 font-extrabold uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-accent text-white rounded-full px-8 font-extrabold uppercase text-xs"
                >
                  {showBlogModal === 'add' ? 'Publish Post' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
