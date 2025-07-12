import React, { createContext, useEffect, useReducer } from "react";

type UserType = {
	userId: string;
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
			dispatch({ type: "LOGIN", payload: JSON.parse(storedUser) });
		}
	}, []);

	return (
		<UserContext.Provider value={{ state, dispatch }}>
			{children}
		</UserContext.Provider>
	);
};
