'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '../componets/layouts/Navbar';
import Footer from '../componets/layouts/Footer';

const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();

  // Hide global navbar and footer on profile/dashboard routes
  const isDashboard = pathname.startsWith('/profile') || pathname.startsWith('/dashboard');

  return (
    <>
      {!isDashboard && <Navbar />}
      <main className="flex-1 w-full relative z-0">{children}</main>
      {!isDashboard && <Footer />}
    </>
  );
};

export default LayoutWrapper;
