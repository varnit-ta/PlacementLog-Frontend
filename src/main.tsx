import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PostsContextProvider } from "./context/posts-context.tsx";
import { UserContextProvider } from "./context/user-context.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<UserContextProvider>
			<PostsContextProvider>
				<App />
			</PostsContextProvider>
		</UserContextProvider>
	</StrictMode>
);
