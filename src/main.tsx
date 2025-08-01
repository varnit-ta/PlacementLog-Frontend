import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.tsx";
import { PostsContextProvider } from "./context/posts-context.tsx";
import { UserContextProvider } from "./context/user-context.tsx";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<HelmetProvider>
			<UserContextProvider>
				<PostsContextProvider>
					<App />
					<Analytics/>
					<SpeedInsights/>
				</PostsContextProvider>
			</UserContextProvider>
		</HelmetProvider>
	</StrictMode>
);
