import {
	Body,
	Container,
	Font,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

/**
 * Welcome email template sent after a user submits the contact form.
 *
 * Renders a multi-language email using the `next-intl` translation object
 * and the recipient's first/last name. Styled with Tailwind and inline
 * styles via `@react-email/components`.
 */
export default function WelcomeEmail(t: any, firstName: string, lastName: string) {
	return (
		<Html>
			<Head>
				{/* <Font
					fontFamily="Mozilla Headline"
					fallbackFontFamily="sans-serif"
					webFont={{
						url: "https://fonts.googleapis.com/css2?family=Mozilla+Headline:wght@200..700&display=swap",
						format: "woff2",
					}}
					fontWeight={400}
					fontStyle="normal"
				/> */}
				<Font
					fontFamily="IBM Plex Sans"
					fallbackFontFamily="serif"
					webFont={{
						url: "https://fonts.googleapis.com/css2?family=IBM+IBM Plex Sans+Sans:ital,wght@0,100..700;1,100..700&display=swap",
						format: "woff2",
					}}
					fontWeight={400}
					fontStyle="normal"
				/>
				<style>
					{/* eslint-disable-next-line i18next/no-literal-string */}
					{`
            @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Mozilla+Headline:wght@200..700&display=swap');
            *{
            font-family: 'IBM Plex Sans', 'Mozilla Headline', sans-serif;
            }`}
				</style>
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
							<Text
								className="signature"
								style={footerText}>
								{t("signature")}
							</Text>
							<Text
								className="signature"
								style={footerText}>
								<Link
									href="https://daniel-freire.com"
									target="_blank"
									style={link}>
									{t("name")}
								</Link>
							</Text>
						</Section>

						<Text
							className="signature whitespace-pre-wrap"
							style={footerText}>
							{t("view")}{" "}
							<Link
								href={`https://daniel-freire.com/${t("privacyPolicyUrl")}`}
								target="_blank"
								style={link}>
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

/**
 * Email body background and text colour.
 *
 * Sets a white background and dark grey text as the base canvas for the
 * entire email. These values cascade through all child elements unless
 * overridden by more specific style objects.
 */
const main = {
	backgroundColor: "#fff",
	color: "#212121",
};

/**
 * Outer container with a light grey background.
 *
 * Provides a subtle visual boundary around the email content so it stands out
 * from the email client's default white canvas. Centered with auto margins.
 */
const container = {
	padding: "20px",
	margin: "0 auto",
	backgroundColor: "#eee",
};

/**
 * Heading style for the recipient's name.
 *
 * Uses the Mozilla Headline typeface for a distinctive brand look, falling
 * back to Arial and Verdana on clients that don't support web fonts.
 */
const h1 = {
	color: "#333",
	fontFamily: "Mozilla Headline, Arial, Verdana",
	fontSize: "20px",
	fontWeight: "bold",
	marginBottom: "15px",
};

/**
 * Link style used for the signature and privacy-policy link.
 *
 * Applies a blue colour with underline and a system font stack that matches
 * the sender's brand palette. The `fontStyle: "capitalize"` ensures link text
 * renders in title case regardless of the translation value.
 */
const link = {
	color: "#2754C5",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'IBM Plex Sans', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	textDecoration: "underline",
	fontStyle: "capitalize",
};

/**
 * Base text style used throughout the email body.
 *
 * Defines the shared typography properties (colour, font stack, size, margin)
 * that are inherited or spread into more specific text-style objects below.
 */
const text = {
	color: "#333",
	fontFamily:
		"IBM Plex Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	margin: "24px 0",
};

/**
 * White background cover section.
 *
 * Creates a clean white card surface inside the grey container so the text
 * content has maximum contrast and readability.
 */
const coverSection = { backgroundColor: "#fff" };

/**
 * Padding for the upper content section.
 *
 * Adds consistent horizontal and vertical spacing around the greeting and
 * body paragraphs inside the white cover card.
 */
const upperSection = { padding: "25px 35px" };

/**
 * Smaller text style used in the footer.
 *
 * Spreads the base text style and reduces the font size to 12px with
 * horizontal padding, producing the compact legal/attribution text at the
 * bottom of the email.
 */
const footerText = {
	...text,
	fontSize: "12px",
	padding: "0 20px",
};

/**
 * Main body text with reduced bottom margin.
 *
 * Spreads the base text style and tightens the bottom margin to 14px so
 * paragraphs sit closer together, improving scannability of the multi-
 * paragraph welcome message.
 */
const mainText = { ...text, marginBottom: "14px" };
