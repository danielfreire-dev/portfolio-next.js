"use client";
import React, { createContext, useContext, useState } from "react";
import { UserLanguageType } from "../types";
import { AppContextType } from "../types";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
	const [userLanguage, setUserLanguage] = useState<UserLanguageType>("pt-PT");

	return (
		<AppContext.Provider value={{ userLanguage, setUserLanguage }}>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useAppContext must be used within an AppProvider");
	}
	return context;
};
