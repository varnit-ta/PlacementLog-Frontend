import * as React from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { UserContext } from "@/context/user-context"
import { useContext } from "react"
import { apiService } from "@/lib/api"
import { 
  Home, 
  Plus, 
  Shield, 
  LogIn, 
  LogOut, 
  User,
  Menu,
  List
} from "lucide-react"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const userContext = useContext(UserContext)
  const user = userContext?.state;
  // user now has userId, username, regno, token
  const navigate = useNavigate()
  const location = useLocation()
  const { dispatch } = React.useContext(UserContext)!

  const handleSignOut = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      dispatch({ type: "LOGOUT" })
      localStorage.removeItem("user")
      navigate("/")
    }
  }

  const isActive = (path: string) => location.pathname === path
  const isAdmin = apiService.isUserAdmin()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/vite.svg" alt="Logo" className="w-5 h-5" />
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
                    to="/"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
                      to="/create"
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
                      to="/admin"
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
                      to="/my-posts"
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive("/my-posts")
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <List className="w-4 h-4" />
                      <span>My Posts</span>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
                to="/create"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
                to="/admin"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
                to="/my-posts"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/my-posts") 
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <List className="w-4 h-4" />
                <span>My Posts</span>
              </Link>
            )}
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
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/auth"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:block">Login</span>
                </Link>
                <Link
                  to="/admin-auth"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors"
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
