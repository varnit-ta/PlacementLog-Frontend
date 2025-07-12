import { PostsContext } from "@/context/posts-context"
import { useContext, useEffect } from "react"

const baseUrl = import.meta.env.VITE_API_URL;

export const Dashboard = () => {
    const postContext = useContext(PostsContext)
    const dispatch  = postContext?.dispatch

    useEffect(() => {
        const fetchAllPosts = async () => {
            if (!dispatch)
                return;

            try {
                const res = await fetch(`${baseUrl}/posts`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                if (!res.ok)
                    throw new Error("Failed to fetch posts")

                const data = await res.json()

                dispatch({type: "ADD", payload: data.data})
            }catch (err){
                console.log("Error fetching posts:", err)
            }
        };

        fetchAllPosts();
    }, [])


    return (
        <div>
            {Array.isArray(postContext?.state) ? (
                postContext.state.map((post: any, idx: number) => (
                    <div key={post.id ?? idx}>
                        {/* Render post properties here */}
                        <pre>{JSON.stringify(post, null, 2)}</pre>
                    </div>
                ))
            ) : null}
        </div>
    )
}