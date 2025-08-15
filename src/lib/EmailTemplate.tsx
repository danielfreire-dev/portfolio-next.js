/* eslint-disable no-undef */
import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import { useTranslations } from "next-intl";

const baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "";

export default function WelcomeEmail() {
	const t = useTranslations("email.welcome");

	return (
		<Html>
			<Head />
			<Body style={main}>
				<Preview className="capitalize">{t("preview")}</Preview>
				<Container style={container}>
					<Section style={coverSection}>
						<Section style={imageSection}>
							<Img
								src={`${baseUrl}/static/aws-logo.png`}
								width="75"
								height="45"
								alt="Daniel's Logo"
							/>
						</Section>
						<Section style={upperSection}>
							<Heading style={h1}>{t("heading")}</Heading>
							<Text style={mainText}>{t("maintext")}</Text>
						</Section>
						<Hr />
					</Section>
					<Text className="signature" style={footerText}>
						{/* This message was produced and distributed by Amazon Web Services,
						Inc., 410 Terry Ave. North, Seattle, WA 98109. © 2022, Amazon Web
						Services, Inc.. All rights reserved. AWS is a registered trademark
						of{" "}
						<Link href="https://daniel-freire.com" target="_blank" style={link}>
							daniel-freire.com
						</Link>
						, Inc. View our{" "}
						<Link href="https://daniel-freire.com" target="_blank" style={link}>
							privacy policy
						</Link>
						. */}
					</Text>
				</Container>
			</Body>
		</Html>
	);
}

const main = {
	backgroundColor: "#fff",
	color: "#212121",
};

const container = {
	padding: "20px",
	margin: "0 auto",
	backgroundColor: "#eee",
};

const h1 = {
	color: "#333",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "20px",
	fontWeight: "bold",
	marginBottom: "15px",
};

const link = {
	color: "#2754C5",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	textDecoration: "underline",
};

const text = {
	color: "#333",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	margin: "24px 0",
};

const imageSection = {
	backgroundColor: "#252f3d",
	display: "flex",
	padding: "20px 0",
	alignItems: "center",
	justifyContent: "center",
};

const coverSection = { backgroundColor: "#fff" };

const upperSection = { padding: "25px 35px" };

const lowerSection = { padding: "25px 35px" };

const footerText = {
	...text,
	fontSize: "12px",
	padding: "0 20px",
};

const verifyText = {
	...text,
	margin: 0,
	fontWeight: "bold",
	textAlign: "center" as const,
};

const codeText = {
	...text,
	fontWeight: "bold",
	fontSize: "36px",
	margin: "10px 0",
	textAlign: "center" as const,
};

const validityText = {
	...text,
	margin: "0px",
	textAlign: "center" as const,
};

const verificationSection = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
};

const mainText = { ...text, marginBottom: "14px" };

const cautionText = { ...text, margin: "0px" };
