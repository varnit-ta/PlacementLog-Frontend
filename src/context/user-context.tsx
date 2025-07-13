import React, { createContext, useEffect, useReducer } from "react";

type UserType = {
	userId: string;
	username: string;
	token: string;
} | null;

type ActionType = { type: "LOGIN"; payload: UserType } | { type: "LOGOUT" };

interface UserContextType {
	state: UserType;
	dispatch: React.Dispatch<ActionType>;
}

const UserReducer = (state: UserType, action: ActionType): UserType => {
	switch (action.type) {
		case "LOGIN":
			return action.payload;
		case "LOGOUT":
			return null;
		default:
			return state;
	}
};

export const UserContext = createContext<UserContextType | undefined>(
	undefined
);

export const UserContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [state, dispatch] = useReducer(UserReducer, null);

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			try {
				const userData = JSON.parse(storedUser);
				// Handle both old format (userId) and new format (userid from backend)
				const userId = userData.userId || userData.userid;
				const username = userData.username;
				if (userId && userData.token) {
					dispatch({ 
						type: "LOGIN", 
						payload: { userId, username, token: userData.token } 
					});
				}
			} catch (error) {
				console.error("Error parsing stored user data:", error);
				localStorage.removeItem("user");
			}
		}
	}, []);

	return (
		<UserContext.Provider value={{ state, dispatch }}>
			{children}
		</UserContext.Provider>
	);
};
