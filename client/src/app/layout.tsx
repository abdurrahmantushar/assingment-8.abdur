import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import ThemeProvider from "@/components/shared/ThemeProvider";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SocialImpact | Make a Difference",
  description:
    "Discover community events, volunteer, and make a positive impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <Suspense
            fallback={
              <div className="h-20 border-b border-gray-100 bg-white dark:border-white/10 dark:bg-[#101810]" />
            }
          >
            <Navbar />
          </Suspense>

          {children}

          <Footer />

          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}