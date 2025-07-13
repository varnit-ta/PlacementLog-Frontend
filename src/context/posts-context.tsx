import React, { createContext, useReducer } from "react";

export type PostBody = {
  companyName?: string;
  company?: string;
  role?: string;
  ctc?: string;
  cgpa?: string;
  rounds?: any;
  experience?: string;
  user?: string;
  [key: string]: any; // Allow additional fields
};

export type Post = {
  id: string;             // UUID string
  user_id: string;
  post_body: PostBody;
  reviewed?: boolean;
};

type StateType = Post[];

type ActionType =
  | { type: "ADD"; payload: Post[] }     // batch add (e.g. from fetch)
  | { type: "APPEND"; payload: Post }    // append single new post
  | { type: "DELETE"; payload: string }; // by id

const PostReducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case "ADD":
      return action.payload;
    case "APPEND":
      return [...state, action.payload];
    case "DELETE":
      return state.filter(post => post.id !== action.payload);
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
  const [state, dispatch] = useReducer(PostReducer, []);

  return (
    <PostsContext.Provider value={{ state, dispatch }}>
      {children}
    </PostsContext.Provider>
  );
};
