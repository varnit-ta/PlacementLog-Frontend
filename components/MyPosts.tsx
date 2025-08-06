"use client"

import { useContext, useState, useEffect } from "react";
import { PostsContext } from "@/context/posts-context";
import { UserContext } from "@/context/user-context";
import { PostCard } from "./postcard";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Editor from "./editor";
import { apiService } from "@/lib/api";

const MyPosts = () => {
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

  // Fetch posts if not loaded - optimized to check if posts exist and contain current user's posts
  useEffect(() => {
    const userHasPosts = postsContext?.state?.some(post => post.user_id === user?.userId);
    if (user && (!postsContext?.state || postsContext.state.length === 0 || !userHasPosts)) {
      setLoadingPosts(true);
      apiService.getAllPosts().then(posts => {
        postsContext?.dispatch?.({ type: "ADD", payload: posts });
      }).catch(error => {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts");
      }).finally(() => setLoadingPosts(false));
    }
  }, [postsContext, user?.userId]);

  if (!user) {
    return <div className="py-8 text-center text-gray-600">Please log in to view your posts.</div>;
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

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">My Posts</h2>
          <p className="text-gray-600">View, edit, or delete your placement experiences.</p>
        </div>
        {loadingPosts ? (
          <div className="text-center text-gray-500 py-12">Loading your posts...</div>
        ) : myPosts.length === 0 ? (
          <div className="text-gray-600 text-center">You have not created any posts yet.</div>
        ) : (
          <div className="flex flex-col gap-8">
            {myPosts.map((post) => (
              <div key={post.id} className="relative border rounded-xl shadow-sm hover:shadow-md transition-all bg-white">
                {/* Status/Review Badge */}
                <div className="absolute top-4 right-4">
                  {post.reviewed === false ? (
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Under Review</span>
                  ) : post.post_body.status === "accepted" ? (
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Published</span>
                  ) : post.post_body.status === "rejected" ? (
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Rejected</span>
                  ) : (
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">Draft</span>
                  )}
                </div>
                {editingPost && editingPost.id === post.id ? (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                          className="block w-full border border-gray-300 rounded-md px-3 py-2"
                          value={editFields.companyName}
                          onChange={e => setEditFields((f: any) => ({ ...f, companyName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input
                          className="block w-full border border-gray-300 rounded-md px-3 py-2"
                          value={editFields.role}
                          onChange={e => setEditFields((f: any) => ({ ...f, role: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CTC (LPA)</label>
                        <input
                          className="block w-full border border-gray-300 rounded-md px-3 py-2"
                          value={editFields.ctc}
                          onChange={e => setEditFields((f: any) => ({ ...f, ctc: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
                        <input
                          className="block w-full border border-gray-300 rounded-md px-3 py-2"
                          value={editFields.cgpa}
                          onChange={e => setEditFields((f: any) => ({ ...f, cgpa: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rounds</label>
                        <input
                          className="block w-full border border-gray-300 rounded-md px-3 py-2"
                          value={editFields.rounds}
                          onChange={e => setEditFields((f: any) => ({ ...f, rounds: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          className="block w-full border border-gray-300 rounded-md px-3 py-2"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                      <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto" style={{ minHeight: '180px', maxHeight: '260px' }}>
                        <Editor
                          onContentChange={setEditExperience}
                          value={editExperience}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => { setEditingPost(null); }} disabled={isSaving}>Cancel</Button>
                      <Button onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <PostCard post={post} hideStatusBadge={true} />
                    {post.post_body.status === "rejected" && post.post_body.feedback && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-800">
                        <strong>Feedback:</strong> {post.post_body.feedback}
                      </div>
                    )}
                    <div className="flex gap-2 mt-4 justify-end px-4 pb-4">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(post.id)} disabled={isDeleting === post.id}>
                        {isDeleting === post.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Edit Modal */}
        {showEditModal && editingPost && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Edit Post</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={editFields.companyName}
                    onChange={e => setEditFields((f: any) => ({ ...f, companyName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={editFields.role}
                    onChange={e => setEditFields((f: any) => ({ ...f, role: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTC (LPA)</label>
                  <input
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={editFields.ctc}
                    onChange={e => setEditFields((f: any) => ({ ...f, ctc: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
                  <input
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={editFields.cgpa}
                    onChange={e => setEditFields((f: any) => ({ ...f, cgpa: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rounds</label>
                  <input
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={editFields.rounds}
                    onChange={e => setEditFields((f: any) => ({ ...f, rounds: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto" style={{ minHeight: '180px', maxHeight: '260px' }}>
                  <Editor
                    onContentChange={setEditExperience}
                    value={editExperience}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditModal(false)} disabled={isSaving}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts; 