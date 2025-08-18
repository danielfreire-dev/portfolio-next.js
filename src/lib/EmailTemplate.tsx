import {
	Body,
	Container,
	Font,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	pixelBasedPreset,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import localFont from "next/font/local";

export default function WelcomeEmail(t, firstName: string, lastName: string) {
	return (
		<Html>
			<Head>
				<Font
					fontFamily="Mozilla Headline"
					fallbackFontFamily="Arial, Verdana"
					webFont={{
						url: [
							"https://fonts.googleapis.com/css2?family=Mozilla+Headline:wght@200..700&display=swap",
						],
						format: "woff2",
					}}
					fontWeight={400}
					fontDisplay="swap"
					fontStyle="normal"
				/>
				<Font
					fontFamily="IBM Plex Sans"
					fallbackFontFamily="Verdana"
					webFont={{
						url: "https://fonts.googleapis.com/css2?family=IBM+IBM Plex Sans+Sans:ital,wght@0,100..700;1,100..700&display=swap",
						format: "woff2",
					}}
					fontWeight={400}
					fontStyle="normal"
				/>
			</Head>
			<Tailwind>
				<Body style={main}>
					<Preview>{t("preview")}</Preview>
					<Container style={container}>
						<Section style={coverSection}>
							<Section style={upperSection}>
								<Heading style={h1}>{t("name")}</Heading>
								<Text style={mainText}>
									{t("heading")} {firstName + " " + lastName + ","}
								</Text>
								<Text style={mainText}>{t("intro")}</Text>
								<Text style={mainText}>{t("introduction")}</Text>
								<Text style={mainText}>{t("happensNext0")}</Text>
								<Text style={mainText}> • {t("happensNext1")}</Text>
								<Text style={mainText}> • {t("happensNext2")}</Text>
								<Text style={mainText}> • {t("happensNext3")}</Text>
								<Text style={mainText}>{t("whileWait0")}</Text>
								<Text style={mainText}>{t("whileWait1")}</Text>
								<Text style={mainText}>{t("whileWait2")}</Text>
								<Text style={mainText}>{t("conclusion")}</Text>
							</Section>
							<Hr />
							<Text className="signature" style={footerText}>
								{t("signature")}
							</Text>
							<Text className="signature" style={footerText}>
								<Link
									href="https://daniel-freire.com"
									target="_blank"
									style={link}
								>
									{t("name")}
								</Link>
							</Text>
						</Section>

						<Text className="signature whitespace-pre-wrap" style={footerText}>
							{t("view")}{" "}
							<Link
								href={`https://daniel-freire.com/${t("privacyPolicyUrl")}`}
								target="_blank"
								style={link}
							>
								{t("privacyPolicy")}
							</Link>
							.
						</Text>
					</Container>
				</Body>
			</Tailwind>
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
	fontFamily: "Mozilla Headline, IBM Plex Sans, Arial, Verdana",
	fontSize: "20px",
	fontWeight: "bold",
	marginBottom: "15px",
};

const Moz = { fontFamily: "Mozilla Headline, Arial, Verdana" };

const link = {
	color: "#2754C5",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'IBM Plex Sans', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	textDecoration: "underline",
	fontStyle: "capitalize",
};

const text = {
	color: "#333",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'IBM Plex Sans', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	margin: "24px 0",
};

const coverSection = { backgroundColor: "#fff" };

const upperSection = { padding: "25px 35px" };

const footerText = {
	...text,
	fontSize: "12px",
	padding: "0 20px",
};

const mainText = { ...text, marginBottom: "14px" };
