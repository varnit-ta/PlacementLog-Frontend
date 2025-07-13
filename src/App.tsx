import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { PostCreationForm } from "./pages/post-creation-page";
import { Dashboard } from "./pages/dashboard";
import { AdminDashboard } from "./pages/admin-dashboard";
import { AdminAuthPage } from "./pages/admin-auth-page";
import { useContext } from "react";
import { UserContext } from "./context/user-context";
import { AuthPage } from "./pages/auth-page";
import { Toaster } from "./components/ui/sonner";

export default function App() {
	const userContext = useContext(UserContext);
	const user = userContext?.state;

	return (
		<div className="min-h-screen bg-white">
			<BrowserRouter>
				<Navbar />

				<main className="flex-1">
					<Routes>
						<Route path="/" element={<Dashboard />} />
						<Route
							path="/create"
							element={user ? <PostCreationForm /> : <Navigate to="/auth" />}
						/>
						<Route
							path="/admin"
							element={user ? <AdminDashboard /> : <Navigate to="/admin-auth" />}
						/>
						<Route path="/auth" element={<AuthPage />} />
						<Route path="/admin-auth" element={<AdminAuthPage />} />
					</Routes>
				</main>

				<footer className="bg-gray-100 border-t border-gray-200 py-6 mt-16">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center">
							<p className="text-sm text-gray-600 mb-2">
								Placement Log - Share your placement journey
							</p>
							<div className="flex justify-center space-x-6 text-sm">
								<a
									href="https://github.com/varnit-ta/PlacementLog-Backend"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-600 hover:text-gray-800 transition-colors"
								>
									Backend Repository
								</a>
								<a
									href="https://github.com/varnit-ta/PlacementLog-Frontend"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-600 hover:text-gray-800 transition-colors"
								>
									Frontend Repository
								</a>
							</div>
						</div>
					</div>
				</footer>
			</BrowserRouter>
			<Toaster />
		</div>
	);
}
