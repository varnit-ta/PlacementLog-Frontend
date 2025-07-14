import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PostsContextProvider } from "./context/posts-context.tsx";
import { UserContextProvider } from "./context/user-context.tsx";
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<UserContextProvider>
			<PostsContextProvider>
				<App />
				<Analytics/>
			</PostsContextProvider>
		</UserContextProvider>
	</StrictMode>
);
