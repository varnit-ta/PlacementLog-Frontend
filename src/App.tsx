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
		<div className="app p-5">
			<BrowserRouter>
				<Navbar />

				<div className="pages flex-grow">
					<Routes>
						<Route 
							path="/" 
							element={<Dashboard />} 
						/>

						<Route
							path="/create"
							element={user ? <PostCreationForm /> : <Navigate to="/auth"/>}
						/>

						<Route
							path="/auth"
							element={<AuthPage/>}
						/>
					</Routes>
				</div>
			</BrowserRouter>
		</div>
	);
}
