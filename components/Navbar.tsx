"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { UserContext } from "@/context/user-context"
import { useContext, useMemo, useCallback } from "react"
import { apiService } from "@/lib/api"
import { 
  Home, 
  Plus, 
  Shield, 
  LogIn, 
  LogOut, 
  User,
  Menu,
  List,
  BarChart3
} from "lucide-react"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function Navbar() {
  const userContext = useContext(UserContext)
  const user = userContext?.state;
  const isLoadingUser = userContext?.loading;
  // user now has userId, username, regno, token
  const router = useRouter()
  const pathname = usePathname()
  const { dispatch } = React.useContext(UserContext)!

  // Memoize admin check to avoid expensive operations on every render
  const isAdmin = useMemo(() => {
    return user ? apiService.isUserAdmin() : false;
  }, [user?.token]);

  const handleSignOut = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      dispatch({ type: "LOGOUT" })
      localStorage.removeItem("user")
      router.push("/")
    }
  }

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  // Show loading state while user context is initializing
  if (isLoadingUser) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Skeleton className="w-32 h-6" />
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-20 h-6" />
              ))}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/vercel.svg" alt="Logo" className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-gray-900">PlacementLog</span>
            </Link>
          </div>

          {/* Mobile Nav: Hamburger + Drawer */}
          <div className="flex md:hidden items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Open navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <nav className="flex flex-col gap-1 p-4">
                  <Link
                    href="/"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-75 ${
                      isActive("/")
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  {!isAdmin && user && (
                    <Link
                      href="/create"
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-75 ${
                        isActive("/create")
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Post</span>
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      href="/admin-dashboard"
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-75 ${
                        isActive("/admin-dashboard")
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  {!isAdmin && user && (
                    <Link
                      href="/my-posts"
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-75 ${
                        isActive("/my-posts")
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <List className="w-4 h-4" />
                      <span>My Posts</span>
                    </Link>
                  )}
                  <Link
                    href="/placement-stats"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-75 ${
                      isActive("/placement-stats")
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Placement Stats</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-75 ${
                isActive("/") 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            {!isAdmin && (
              <Link
                href="/create"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-75 ${
                  isActive("/create") 
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Create Post</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-75 ${
                  isActive("/admin") 
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
            {!isAdmin && user && (
              <Link
                href="/my-posts"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-75 ${
                  isActive("/my-posts") 
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <List className="w-4 h-4" />
                <span>My Posts</span>
              </Link>
            )}
            <Link
              href="/placement-stats"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-75 ${
                isActive("/placement-stats")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Placement Stats</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-700" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user.username}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-75"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-75"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:block">Login</span>
                </Link>
                <Link
                  href="/admin-auth"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors duration-75"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:block">Admin</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
