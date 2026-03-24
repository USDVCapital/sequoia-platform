import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ScrollRestoration from "@/components/ScrollRestoration";
import ClientProviders from "@/components/ClientProviders";
import LayoutShell from "@/components/layout/LayoutShell";
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
  metadataBase: new URL('https://sequoia-platform.vercel.app'),
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
  authors: [{ name: 'Sequoia Enterprise Solutions' }],
  creator: 'Sequoia Enterprise Solutions',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Sequoia Enterprise Solutions',
    description: 'Your trusted partner for business solutions, commercial lending, and recurring income opportunities.',
    url: 'https://sequoia-platform.vercel.app',
    siteName: 'Sequoia Enterprise Solutions',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sequoia Enterprise Solutions',
    description: 'Your trusted partner for business solutions, commercial lending, and recurring income opportunities.',
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
          <LayoutShell>{children}</LayoutShell>
        </ClientProviders>
      </body>
    </html>
  );
}
