import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/context/user-context";
import { apiService, type Post } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Trash2, Shield, Clock, CheckSquare, AlertTriangle, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export const AdminDashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { state: user } = useContext(UserContext)!;

  useEffect(() => {
    if (!user) {
      setError("Please log in as admin");
      setIsLoading(false);
      return;
    }

    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allPosts = await apiService.getAllPostsForAdmin();
      setPosts(allPosts);
    } catch (err: any) {
      console.error("Error fetching posts:", err);
      setError(err.message || "Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (postId: string, action: 'approve' | 'reject') => {
    try {
      await apiService.reviewPost(postId, action);
      await fetchPosts();
      toast.success(`Post ${action}d successfully`);
    } catch (err: any) {
      console.error(`Error ${action}ing post:`, err);
      toast.error(err.message || `Failed to ${action} post`);
    }
  };

  const handleDelete = async (postId: string) => {
    // Use a custom confirm dialog or toast for confirmation
    toast.custom((t) => (
      <div>
        <div className="mb-2">Are you sure you want to delete this post?</div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={async () => {
              toast.dismiss(t);
              try {
                await apiService.deletePostAsAdmin(postId);
                await fetchPosts();
                toast.success("Post deleted successfully");
              } catch (err: any) {
                console.error("Error deleting post:", err);
                toast.error(err.message || "Failed to delete post");
              }
            }}
          >
            Delete
          </button>
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => toast.dismiss(t)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading admin dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pendingPosts = posts.filter(post => post.reviewed === false);
  const approvedPosts = posts.filter(post => post.reviewed === true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage and review placement posts</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingPosts.length}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved Posts</p>
                  <p className="text-2xl font-bold text-green-600">{approvedPosts.length}</p>
                </div>
                <CheckSquare className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <Clock className="w-6 h-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Pending Reviews ({pendingPosts.length})
            </h2>
          </div>
          
          {pendingPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pendingPosts.map((post) => {
                const companyDisplay = post.post_body.companyName || post.post_body.company || "Unknown Company";
                return (
                  <Card key={post.id} className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-900 mb-1">{companyDisplay}</CardTitle>
                          <p className="text-sm text-gray-600">{post.post_body.role}</p>
                          <p className="text-xs text-gray-500 mt-1">by {post.user_id}</p>
                        </div>
                        <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          <Clock className="w-3 h-3" />
                          <span>Pending</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3 mb-4">
                        {post.post_body.ctc && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">CTC:</span>
                            <span className="font-medium">{post.post_body.ctc} LPA</span>
                          </div>
                        )}
                        {post.post_body.cgpa && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">CGPA:</span>
                            <span className="font-medium">{post.post_body.cgpa}</span>
                          </div>
                        )}
                        {post.post_body.rounds && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Rounds:</span>
                            <span className="font-medium">{post.post_body.rounds}</span>
                          </div>
                        )}
                      </div>
                      
                      {post.post_body.experience && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-700 mb-2">Experience Preview:</p>
                          <div 
                            className="text-xs text-gray-600 line-clamp-3 bg-gray-50 p-3 rounded"
                            dangerouslySetInnerHTML={{ 
                              __html: post.post_body.experience.substring(0, 150) + '...' 
                            }}
                          />
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleReview(post.id, 'approve')}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReview(post.id, 'reject')}
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No posts are pending review.</p>
            </div>
          )}
        </div>

        {/* Approved Posts */}
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <CheckSquare className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Approved Posts ({approvedPosts.length})
            </h2>
          </div>
          
          {approvedPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {approvedPosts.map((post) => {
                const companyDisplay = post.post_body.companyName || post.post_body.company || "Unknown Company";
                return (
                  <Card key={post.id} className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-900 mb-1">{companyDisplay}</CardTitle>
                          <p className="text-sm text-gray-600">{post.post_body.role}</p>
                          <p className="text-xs text-gray-500 mt-1">by {post.user_id}</p>
                        </div>
                        <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          <span>Approved</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3 mb-4">
                        {post.post_body.ctc && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">CTC:</span>
                            <span className="font-medium">{post.post_body.ctc} LPA</span>
                          </div>
                        )}
                        {post.post_body.cgpa && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">CGPA:</span>
                            <span className="font-medium">{post.post_body.cgpa}</span>
                          </div>
                        )}
                        {post.post_body.rounds && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Rounds:</span>
                            <span className="font-medium">{post.post_body.rounds}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Approved Posts</h3>
              <p className="text-gray-600">Approved posts will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 