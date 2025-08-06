"use client";

import { PostsContext } from "@/context/posts-context";
import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { PostCard } from "@/components/postcard";
import { apiService } from "@/lib/api";
import { Search, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { FixedSizeList as List } from "react-window";

export default function Dashboard() {
  const postContext = useContext(PostsContext);
  const dispatch = postContext?.dispatch;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  useEffect(() => {
    const fetchAllPosts = async () => {
      if (!dispatch) return;

      setIsLoading(true);
      setError(null);

      try {
        const posts = await apiService.getAllPosts();
        dispatch({ type: "ADD", payload: posts });
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        const errorMessage = err.message || "Failed to fetch posts";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPosts();
  }, [dispatch]);

  // Ensure posts is always an array and handle the search filtering with useMemo
  const posts = Array.isArray(postContext?.state) ? postContext.state : [];
  
  const filteredPosts = useMemo(() => {
    if (!debouncedSearchTerm) return posts;
    const searchLower = debouncedSearchTerm.toLowerCase();
    
    return posts.filter((post: any) => {
      const companyName = post.post_body?.companyName || post.post_body?.company || "";
      const role = post.post_body?.role || "";
      const userId = post.user_id || post.post_body?.user || "";
      
      return (
        companyName.toLowerCase().includes(searchLower) ||
        role.toLowerCase().includes(searchLower) ||
        userId.toLowerCase().includes(searchLower)
      );
    });
  }, [posts, debouncedSearchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 py-16">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Skeleton className="w-10 h-10" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Posts</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Placement Dashboard
              </h1>
              <p className="text-gray-600">
                Discover placement experiences from students across different companies
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">
                {filteredPosts.length} posts available
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by company, role, or user..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Posts List - one per row */}
        {filteredPosts.length > 0 ? (
          filteredPosts.length > 20 ? (
            <List
              height={800}
              itemCount={filteredPosts.length}
              itemSize={320}
              width={"100%"}
              className="flex flex-col gap-8"
            >
              {({ index, style }: { index: number; style: React.CSSProperties }) => (
                <div style={style} key={filteredPosts[index].id ?? index}>
                  <PostCard post={filteredPosts[index]} />
                </div>
              )}
            </List>
          ) : (
            <div className="flex flex-col gap-8">
              {filteredPosts.map((post: any, idx: number) => (
                <div key={post.id ?? idx}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "No posts found" : "No posts available"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? "Try adjusting your search terms"
                : "Be the first to share your placement experience!"
              }
            </p>
            {!searchTerm && (
              <button 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={() => window.location.href = '/create'}
              >
                Create Your First Post
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
