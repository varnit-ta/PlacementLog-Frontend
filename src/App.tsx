import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { PostCreationForm } from "./pages/post-creation-page";
import { Dashboard } from "./pages/dashboard";
import { useContext } from "react";
import { UserContext } from "./context/user-context";
import { AuthPage } from "./pages/auth-page";

export default function App() {
	const userContext = useContext(UserContext);
	const user = userContext?.state;

	return (
		<div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
			<BrowserRouter>
				{/* Navbar at the top */}
				<Navbar />

				{/* Main content */}
				<div className="p-5">
					<Routes>
						<Route path="/" element={<Dashboard />} />
						<Route
							path="/create"
							element={user ? <PostCreationForm /> : <Navigate to="/auth" />}
						/>
						<Route path="/auth" element={<AuthPage />} />
					</Routes>
				</div>

				{/* Footer at the bottom */}
				<footer className="text-center text-sm text-muted-foreground py-4 border-t bg-white">
					Contribute or Fix issue on{" "}
					<a
						href="https://github.com/varnit-ta/PlacementLog-Backend"
						target="_blank"
						rel="noopener noreferrer"
						className="underline text-blue-600 hover:text-blue-800"
					>
						@Backend
					</a>{" "}
					or{" "}
					<a
						href="https://github.com/varnit-ta/PlacementLog-Frontend"
						target="_blank"
						rel="noopener noreferrer"
						className="underline text-blue-600 hover:text-blue-800"
					>
						@Frontend
					</a>
				</footer>
			</BrowserRouter>
		</div>
	);
}
