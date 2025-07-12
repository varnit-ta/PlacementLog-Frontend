import { createContext, useReducer } from "react";

type Post = {
    id: number;
    title: string;
    content: string;
};

type StateType = {
    posts: Post[];
};

type ActionType =
    | { type: "ADD"; payload: Post }
    | { type: "DELETE"; payload: number }
    | { type: "MODIFY"; payload: Post };

const PostReducer = (state: StateType, action: ActionType): StateType => {
    switch (action.type) {
        case "ADD":
            return { posts: [...state.posts, action.payload] };
        case "DELETE":
            return { posts: state.posts.filter(post => post.id !== action.payload) };
        case "MODIFY":
            return {
                posts: state.posts.map(post =>
                    post.id === action.payload.id ? action.payload : post
                )
            };
        default:
            return state;
    }
};

type PostsContextType = {
    state: StateType;
    dispatch: React.Dispatch<ActionType>;
};

export const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(PostReducer, {
        posts: []
    });

    return (
        <PostsContext.Provider value={{ state, dispatch }}>
            {children}
        </PostsContext.Provider>
    );
};
