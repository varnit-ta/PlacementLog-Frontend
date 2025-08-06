import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserContextProvider } from "@/context/user-context";
import { PostsContextProvider } from "@/context/posts-context";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { StructuredData } from "@/components/StructuredData";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VIT Placement Log 2026 - Placement Data Tracker for Vellore Institute of Technology",
  description: "Placement data tracker for Vellore Institute of Technology 2026 batch. Track VIT placements, company stats, salary packages, and placement experiences. Complete placement statistics for VIT students.",
  keywords: [
    "vit placement",
    "vit placement 2026",
    "vit placement 26",
    "vellore institute of technology placement",
    "vit placement statistics",
    "vit placement data",
    "vit placement tracker",
    "vit placements 2026",
    "vit placement records",
    "vit campus placement",
    "vit placement report",
    "vit placement portal",
    "vit placement experiences",
    "vit placement companies",
    "vit placement package",
    "vit placement salary",
    "vit chennai placement",
    "vit vellore placement",
    "vit bhopal placement",
    "vit ap placement"
  ].join(", "),
  authors: [{ name: "VIT Placement Log Team" }],
  creator: "VIT Placement Log",
  publisher: "VIT Placement Log",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://placement-log.vercel.app',
    siteName: 'VIT Placement Log 2026',
    title: 'VIT Placement Log 2026 - Placement Data Tracker for Vellore Institute of Technology',
    description: 'Placement data tracker for Vellore Institute of Technology 2026 batch. Track VIT placements, company stats, salary packages, and placement experiences.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VIT Placement Log 2026 - Placement Data Tracker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VIT Placement Log 2026 - Placement Data Tracker',
    description: 'Placement data tracker for Vellore Institute of Technology 2026 batch. Track placements, stats, and experiences.',
    images: ['/og-image.png'],
    creator: '@vitplacementlog',
  },
  verification: {
    google: "_SUcqdcGs5wcNK8gecdpeewL_o1f-dCKtBnnFwoMRtE",
  },
  alternates: {
    canonical: 'https://placement-log.vercel.app',
  },
  category: 'education',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://placement-log.vercel.app" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white flex flex-col`}
      >
        <UserContextProvider>
          <PostsContextProvider>
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-lg text-gray-600">Loading...</div>
                </div>
              }>
                {children}
              </Suspense>
            </main>
            <footer className="bg-gray-100 border-t border-gray-200 py-6 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Placement Log - Share your placement journey
                  </p>
                  <div className="flex justify-center space-x-6 text-sm">
                    <a
                      href="https://github.com/varnit-ta/PlacementLog-Backend"
                      target="_top"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Backend Repository
                    </a>
                    <a
                      href="https://github.com/varnit-ta/PlacementLog-Frontend"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Frontend Repository
                    </a>
                    <a
                      href="https://forms.gle/jSTDJA1XwPLYVrvk8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Feedback & Suggestions
                    </a>
                  </div>
                </div>
              </div>
            </footer>
            <Toaster />
          </PostsContextProvider>
        </UserContextProvider>
      </body>
    </html>
  );
}
