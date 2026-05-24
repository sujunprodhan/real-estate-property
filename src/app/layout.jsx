import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


import Navbar from "../componets/layouts/Navbar";
import Footer from "../componets/layouts/Footer";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Real Estate App",
  description: "Find your dream property",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col relative overflow-x-hidden">
        {/* Animated Pulsing Background Orbs */}
        <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px] animate-pulse pointer-events-none -z-10" style={{ animationDuration: '4s' }}></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary/10 blur-[120px] animate-pulse pointer-events-none -z-10" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>

        <Navbar />

        <main className="flex-1 w-full relative z-0">{children}</main>

        <footer className="w-full relative z-10">
          <Footer />
        </footer>
      </body>
    </html>
  );
}
