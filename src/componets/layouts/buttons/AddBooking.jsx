'use client';

import { usePathname, useRouter } from 'next/navigation';

const AddBooking = ({ property }) => {
  const isLogin = false;
  const router = useRouter();
  const path = usePathname();
  
  const bookingShow = () => {
    if (isLogin) {
      alert(property._id);
    } else {
      router.push(`/login?callbackUrl=${path}`);
    }
  };

  return (
    <button 
      onClick={bookingShow}
      className="btn bg-white hover:bg-neutral-100 text-primary w-full rounded-2xl font-bold border-none shadow-lg text-[16px] h-14"
    >
      Book a Showing
    </button>
  );
};

export default AddBooking;
