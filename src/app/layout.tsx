import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrainingAnnouncementBar from "@/components/ui/TrainingAnnouncementBar";
import ScrollToTop from "@/components/motion/ScrollToTop";
import ScrollRestoration from "@/components/ScrollRestoration";
import ClientProviders from "@/components/ClientProviders";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sequoia Enterprise Solutions | Fueling Growth & Expanding Possibilities",
  description:
    "Sequoia Enterprise Solutions is a solution-driven commercial lending and business consulting platform. Access 500+ vetted lending partners, business funding, wellness programs, and clean energy solutions.",
  keywords: [
    "commercial real estate loans",
    "business funding",
    "fix and flip financing",
    "SBA loans",
    "employee wellness program",
    "commercial lending consultant",
    "Sequoia Enterprise Solutions",
  ],
  openGraph: {
    title: 'Sequoia Enterprise Solutions',
    description: 'Your trusted partner for business solutions, commercial lending, and recurring income opportunities.',
    url: 'https://sequoia-platform.vercel.app',
    siteName: 'Sequoia Enterprise Solutions',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClientProviders>
          <ScrollRestoration />
          <TrainingAnnouncementBar />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ScrollToTop />
        </ClientProviders>
      </body>
    </html>
  );
}
