import React, { useState } from "react";
import Sidenav from "./Sidenav";
import { UserLanguageType } from "../types";

const ParentComponent: React.FC = () => {
	const [userLanguage, setUserLanguage] = useState<UserLanguageType>("en-US");

	const handleLanguageChange = (newLanguage: UserLanguageType) => {
		setUserLanguage(newLanguage);
	};

	return (
		<div>
			<Sidenav
				userLanguage={userLanguage}
				onLanguageChange={handleLanguageChange}
			/>
			{/* Other components */}
		</div>
	);
};

export default ParentComponent;
