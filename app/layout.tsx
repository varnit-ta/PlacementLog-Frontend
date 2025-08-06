import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserContextProvider } from "@/context/user-context";
import { PostsContextProvider } from "@/context/posts-context";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
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
  title: "Placement Log - Share your placement journey",
  description: "Discover placement experiences from students across different companies. Browse through real placement stories, interview experiences, and career insights.",
  keywords: "placement experiences, job interviews, career insights, student placements, company reviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
