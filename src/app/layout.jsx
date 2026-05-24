import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Footer from "../componets/layouts/Footer";
import Navbar from "../componets/layouts/Navbar";



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
    >
      <body className="min-h-screen flex flex-col">
        <header className="container mx-auto">
          <Navbar />
        </header>

        <main className="container mx-auto flex-1">{children}</main>

        <footer className="container mx-auto">
          <Footer />
        </footer>
      </body>
    </html>
  );
}
