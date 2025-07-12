import { PostsContext } from "@/context/posts-context";
import { useContext, useEffect } from "react";
import { PostCard } from "@/components/postcard";

const baseUrl = import.meta.env.VITE_API_URL;

export const Dashboard = () => {
  const postContext = useContext(PostsContext);
  const dispatch = postContext?.dispatch;

  useEffect(() => {
    const fetchAllPosts = async () => {
      if (!dispatch) return;

      try {
        const res = await fetch(`${baseUrl}/posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        dispatch({ type: "ADD", payload: data.data });
      } catch (err) {
        console.log("Error fetching posts:", err);
      }
    };

    fetchAllPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {postContext?.state ? (
        postContext.state.map((post: any, idx: number) => (
          <PostCard key={post.id ?? idx} post={post} />
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No posts available.</p>
      )}
    </div>
  );
};
