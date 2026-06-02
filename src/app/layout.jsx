import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


import NextAuthProvider from "../provider/NextAuthProvider";
import LayoutWrapper from "../provider/LayoutWrapper";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import LiveSupportWidget from "../componets/layouts/LiveSupportWidget";

export const metadata = {
  title: "Real Estate App",
  description: "Find your dream property",
};

export default function RootLayout({ children }) {
  return (
    <NextAuthProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        data-theme="light"
        suppressHydrationWarning
      >
        <body className="min-h-screen flex flex-col relative overflow-x-hidden" suppressHydrationWarning>
          {/* Animated Pulsing Background Orbs */}
          <div
            className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px] animate-pulse pointer-events-none -z-10"
            style={{ animationDuration: '4s' }}
          ></div>
          <div
            className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary/10 blur-[120px] animate-pulse pointer-events-none -z-10"
            style={{ animationDuration: '5s', animationDelay: '1s' }}
          ></div>

          <LayoutWrapper>{children}</LayoutWrapper>
          <LiveSupportWidget />
        </body>
      </html>
    </NextAuthProvider>
  );
}

