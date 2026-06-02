'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { addBooking } from '../../../actions/server/booking';
import { Calendar, Clock, MessageSquare, Phone, User, Mail } from 'lucide-react';

const AddBooking = ({ property }) => {
  const { data: session } = useSession();
  const isLogin = !!session;
  const router = useRouter();
  const path = usePathname();

  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');

  const bookingShow = () => {
    if (isLogin) {
      document.getElementById('booking_modal').showModal();
    } else {
      router.push(`/login?callbackUrl=${path}`);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      Swal.fire({
        icon: 'error',
        title: 'Required Fields',
        text: 'Please select both Date and Time for the showing.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        propertyId: property._id,
        propertyTitle: property.title,
        propertyImage: property.images?.[0] || '',
        propertyPrice: property.price || 0,
        propertyLocation: property.location || {},
        userEmail: session.user.email,
        userName: session.user.name || '',
        date,
        time,
        phone,
        message,
        agent: property.agent,
      };

      const result = await addBooking(payload);

      if (result?.success) {
        document.getElementById('booking_modal').close();
        setDate('');
        setTime('');
        setMessage('');
        setPhone('');

        await Swal.fire({
          icon: 'success',
          title: 'Showing Booked Successfully!',
          text: 'Your viewing has been requested. The agent will contact you shortly.',
          confirmButtonColor: '#10b981',
        });

        window.dispatchEvent(new Event('bookings-updated'));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Booking Failed',
          text: result?.error || 'Could not schedule the showing. Please try again.',
          confirmButtonColor: '#ef4444',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'An unexpected error occurred.',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={bookingShow}
        className="btn bg-white hover:bg-neutral-100 text-primary w-full rounded-2xl font-bold border-none shadow-lg text-[16px] h-14 transition-all duration-300 transform hover:scale-[1.015] active:scale-[0.98]"
      >
        Book a Showing
      </button>

      <dialog id="booking_modal" className="modal modal-bottom sm:modal-middle text-base-content">
        <div className="modal-box bg-base-100 rounded-3xl border border-base-200 shadow-2xl p-8 max-w-lg w-full relative">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-base-content/50 hover:text-base-content">
              ✕
            </button>
          </form>

          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-base-100">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-base-content text-left">Schedule a Showing</h3>
              <p className="text-xs font-bold text-base-content/50 uppercase tracking-widest mt-0.5 text-left truncate max-w-[280px]">
                {property.title}
              </p>
            </div>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-5 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-base-200/40 border border-base-200/50 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-base-content/70">
                <User size={14} className="text-primary shrink-0" />
                <span className="truncate">{session?.user?.name || 'Guest'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-base-content/70">
                <Mail size={14} className="text-primary shrink-0" />
                <span className="truncate">{session?.user?.email || 'N/A'}</span>
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/75 flex items-center gap-1.5">
                  <Calendar size={14} className="text-primary" /> Preferred Date
                </span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 font-bold focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden"
              />
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/75 flex items-center gap-1.5">
                  <Clock size={14} className="text-primary" /> Preferred Time
                </span>
              </label>
              <select
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="select select-bordered w-full rounded-xl bg-base-100 border-base-300 font-bold focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden"
              >
                <option value="" disabled>
                  Select a viewing time slot
                </option>
                <option value="09:00 AM">09:00 AM - 10:00 AM</option>
                <option value="10:00 AM">10:00 AM - 11:00 AM</option>
                <option value="11:00 AM">11:00 AM - 12:00 PM</option>
                <option value="01:00 PM">01:00 PM - 02:00 PM</option>
                <option value="02:00 PM">02:00 PM - 03:00 PM</option>
                <option value="03:00 PM">03:00 PM - 04:00 PM</option>
                <option value="04:00 PM">04:00 PM - 05:00 PM</option>
                <option value="05:00 PM">05:00 PM - 06:00 PM</option>
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/75 flex items-center gap-1.5">
                  <Phone size={14} className="text-primary" /> Phone Number
                </span>
              </label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 font-bold focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden"
              />
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/75 flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-primary" /> Message for Agent
                </span>
              </label>
              <textarea
                placeholder="Let the agent know if you have any questions or specific preferences."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="textarea textarea-bordered w-full rounded-xl bg-base-100 border-base-300 font-medium focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden p-3.5"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full text-white font-extrabold rounded-2xl shadow-lg shadow-primary/20 h-13 uppercase tracking-wider"
              >
                {loading ? <span className="loading loading-spinner">Processing...</span> : 'Confirm Showing Booking'}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default AddBooking;
