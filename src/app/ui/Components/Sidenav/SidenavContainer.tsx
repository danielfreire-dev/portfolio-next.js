"use client";
import React, { useState } from "react";
import Sidenav from "./Sidenav";
import { UserLanguageType } from "../../types";

const SidenavContainer: React.FC = () => {
	const [userLanguage, setUserLanguage] = useState<UserLanguageType>("en-US");

	const handleLanguageChange = (newLanguage: UserLanguageType) => {
		setUserLanguage(newLanguage);
	};

	return (
		<Sidenav
			userLanguage={userLanguage}
			onLanguageChange={handleLanguageChange}
		/>
	);
};

export default SidenavContainer;
