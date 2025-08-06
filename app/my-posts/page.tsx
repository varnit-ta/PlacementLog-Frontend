"use client";

import { useContext, useState, useEffect } from "react";
import { PostsContext } from "@/context/posts-context";
import { UserContext } from "@/context/user-context";
import { PostCard } from "@/components/postcard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Editor from "@/components/editor";
import { apiService } from "@/lib/api";
import { User, FileText, Edit, Trash2, AlertCircle } from "lucide-react";

export default function MyPostsPage() {
  const postsContext = useContext(PostsContext);
  const userContext = useContext(UserContext);
  const user = userContext?.state;
  const [editingPost, setEditingPost] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [editExperience, setEditExperience] = useState("");
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Fetch posts if not loaded
  useEffect(() => {
    if (!postsContext?.state || postsContext.state.length === 0) {
      setLoadingPosts(true);
      apiService.getAllPosts().then(posts => {
        postsContext?.dispatch?.({ type: "ADD", payload: posts });
      }).finally(() => setLoadingPosts(false));
    }
  }, [postsContext]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600">Please log in to view your posts.</p>
          </div>
        </div>
      </div>
    );
  }

  const myPosts = Array.isArray(postsContext?.state)
    ? postsContext.state.filter((post) => post.user_id === user.userId)
    : [];

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setEditFields({
      companyName: post.post_body.companyName || "",
      role: post.post_body.role || "",
      ctc: post.post_body.ctc || "",
      cgpa: post.post_body.cgpa || "",
      rounds: post.post_body.rounds || "",
      status: post.post_body.status || "pending",
    });
    setEditExperience(post.post_body.experience || "");
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setIsDeleting(id);
    try {
      await apiService.deletePost(id);
      postsContext?.dispatch?.({ type: "DELETE", payload: id });
      toast.success("Post deleted.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete post");
    }
    setIsDeleting(null);
  };

  const handleSave = async () => {
    if (!editingPost) return;
    setIsSaving(true);
    try {
      const updatedBody = {
        ...editingPost.post_body,
        ...editFields,
        experience: editExperience,
      };
      const updatedPost = await apiService.updatePost(editingPost.id, updatedBody);
      postsContext?.dispatch?.({ type: "ADD", payload: postsContext.state.map((p) => p.id === editingPost.id ? updatedPost : p) });
      toast.success("Post updated and sent for review.");
      setShowEditModal(false);
      setEditingPost(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update post");
    }
    setIsSaving(false);
  };

  const getStatusBadge = (post: any) => {
    if (post.reviewed === false) {
      return (
        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
          <AlertCircle className="w-3 h-3 mr-1" />
          Under Review
        </span>
      );
    } else if (post.post_body.status === "accepted") {
      return (
        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
          <FileText className="w-3 h-3 mr-1" />
          Published
        </span>
      );
    } else if (post.post_body.status === "rejected") {
      return (
        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
          <AlertCircle className="w-3 h-3 mr-1" />
          Rejected
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
          <FileText className="w-3 h-3 mr-1" />
          Draft
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
              <p className="text-gray-600 mt-1">View, edit, or delete your placement experiences.</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{myPosts.length}</p>
                </div>
                <FileText className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">Under Review</p>
                  <p className="text-2xl font-bold text-yellow-800">
                    {myPosts.filter(post => post.reviewed === false).length}
                  </p>
                </div>
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Published</p>
                  <p className="text-2xl font-bold text-green-800">
                    {myPosts.filter(post => post.reviewed === true && post.post_body.status === "accepted").length}
                  </p>
                </div>
                <FileText className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        {loadingPosts ? (
          <div className="text-center text-gray-500 py-12">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            Loading your posts...
          </div>
        ) : myPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Posts Yet</h3>
            <p className="text-gray-600 mb-6">You haven't created any posts yet. Share your placement experience!</p>
            <Button 
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => window.location.href = '/create'}
            >
              Create Your First Post
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {myPosts.map((post) => (
              <div key={post.id} className="relative border rounded-xl shadow-sm hover:shadow-md transition-all bg-white">
                {/* Status/Review Badge */}
                <div className="absolute top-4 right-4 z-10">
                  {getStatusBadge(post)}
                </div>

                <PostCard post={post} hideStatusBadge={true} />
                
                {/* Feedback for rejected posts */}
                {post.post_body.status === "rejected" && post.post_body.feedback && (
                  <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-red-800 mb-1">Feedback from Admin</h4>
                        <p className="text-red-700 text-sm">{post.post_body.feedback}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 justify-end px-6 pb-6">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEdit(post)}
                    className="flex items-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(post.id)} 
                    disabled={isDeleting === post.id}
                    className="flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{isDeleting === post.id ? "Deleting..." : "Delete"}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">Edit Post</h3>
                <p className="text-gray-600 mt-1">Make changes to your placement experience</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editFields.companyName}
                      onChange={e => setEditFields((f: any) => ({ ...f, companyName: e.target.value }))}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <input
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editFields.role}
                      onChange={e => setEditFields((f: any) => ({ ...f, role: e.target.value }))}
                      placeholder="Enter role/position"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CTC (LPA)</label>
                    <input
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editFields.ctc}
                      onChange={e => setEditFields((f: any) => ({ ...f, ctc: e.target.value }))}
                      placeholder="Enter CTC"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CGPA</label>
                    <input
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editFields.cgpa}
                      onChange={e => setEditFields((f: any) => ({ ...f, cgpa: e.target.value }))}
                      placeholder="Enter your CGPA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rounds</label>
                    <input
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editFields.rounds}
                      onChange={e => setEditFields((f: any) => ({ ...f, rounds: e.target.value }))}
                      placeholder="Number of interview rounds"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editFields.status}
                      onChange={e => setEditFields((f: any) => ({ ...f, status: e.target.value }))}
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ minHeight: '200px', maxHeight: '300px' }}>
                    <Editor
                      onContentChange={setEditExperience}
                      value={editExperience}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <Button 
                  variant="outline" 
                  onClick={() => setShowEditModal(false)} 
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
