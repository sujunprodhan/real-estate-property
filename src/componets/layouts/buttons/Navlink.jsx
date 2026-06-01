"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navlink = ({ href, children, scrolled }) => {
  const path = usePathname();

  const isActive = href === '/' ? path === '/' : path?.startsWith(href);
  const textClass = isActive
    ? 'text-primary'
    : scrolled
      ? 'text-base-content/80 hover:text-primary'
      : 'text-white/80 hover:text-white';

  return (
    <Link
      href={href}
      prefetch={false}
      className={`relative group px-4 py-2 font-bold transition-colors duration-300 ${textClass}`}
    >
      <span className="relative z-10">{children}</span>

      {/* Underline animation */}
      <span
        className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />

      {/* Active glow pill */}
      {isActive && (
        <span className="absolute inset-0 rounded-lg -z-0 transition-all duration-500"></span>
      )}
    </Link>
  );
};

export default Navlink;
