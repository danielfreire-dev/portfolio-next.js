import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfileCard from "@/ui/Components/ProfileCard";

/** Default props required by ProfileCard. */
const defaultCardProps = {
	avatarUrl: "/images/photo.svg",
	name: "Daniel Freire",
	title: "Software Engineer",
	handle: "dainelli",
	status: "Online",
	contactText: "Contact",
	showUserInfo: true,
};

describe("ProfileCard", () => {
	describe("rendering with default props", () => {
		beforeEach(() => {
			render(<ProfileCard {...defaultCardProps} />);
		});

		it("should render the avatar image", () => {
			const avatar = screen.getByAltText("Daniel Freire avatar");
			expect(avatar).toBeInTheDocument();
			expect(avatar.tagName).toBe("IMG");
		});

		it("should render the user name", () => {
			expect(screen.getByText("Daniel Freire")).toBeInTheDocument();
		});

		it("should render the user title", () => {
			expect(screen.getByText("Software Engineer")).toBeInTheDocument();
		});

		it("should render the handle with @ prefix", () => {
			expect(screen.getByText("@dainelli")).toBeInTheDocument();
		});

		it("should render the status", () => {
			expect(screen.getByText("Online")).toBeInTheDocument();
		});

		it("should render the contact button with default text", () => {
			const button = screen.getByRole("button", { name: "Contact Daniel Freire" });
			expect(button).toBeInTheDocument();
			expect(button).toHaveTextContent("Contact");
		});
	});

	describe("rendering with custom props", () => {
		const customProps = {
			avatarUrl: "/custom-avatar.jpg",
			name: "Jane Doe",
			title: "Designer",
			handle: "janedoe",
			status: "Away",
			contactText: "Message",
			showUserInfo: true,
		};

		beforeEach(() => {
			render(<ProfileCard {...customProps} />);
		});

		it("should render the custom avatar", () => {
			const avatar = screen.getByAltText("Jane Doe avatar");
			expect(avatar).toHaveAttribute("src", "/custom-avatar.jpg");
		});

		it("should render the custom name", () => {
			expect(screen.getByText("Jane Doe")).toBeInTheDocument();
		});

		it("should render the custom title", () => {
			expect(screen.getByText("Designer")).toBeInTheDocument();
		});

		it("should render the custom handle", () => {
			expect(screen.getByText("@janedoe")).toBeInTheDocument();
		});

		it("should render the custom status", () => {
			expect(screen.getByText("Away")).toBeInTheDocument();
		});

		it("should render the custom contact button text", () => {
			const button = screen.getByRole("button", { name: "Contact Jane Doe" });
			expect(button).toHaveTextContent("Message");
		});
	});

	describe("contact button click", () => {
		it("should call onContactClick when button is clicked", () => {
			const onContactClick = vi.fn();
			render(
				<ProfileCard
					{...defaultCardProps}
					onContactClick={onContactClick}
				/>,
			);

			const button = screen.getByRole("button", { name: "Contact Daniel Freire" });
			button.click();

			expect(onContactClick).toHaveBeenCalledTimes(1);
		});
	});

	describe("when showUserInfo is false", () => {
		it("should not render the user info section", () => {
			render(
				<ProfileCard
					{...defaultCardProps}
					showUserInfo={false}
				/>,
			);

			expect(screen.queryByText("@dainelli")).not.toBeInTheDocument();
			expect(screen.queryByText("Online")).not.toBeInTheDocument();
			expect(screen.queryByRole("button", { name: "Contact Daniel Freire" })).not.toBeInTheDocument();
		});
	});

	describe("tilt functionality", () => {
		it("should render without crashing when enableTilt is false", () => {
			expect(() => {
				render(
					<ProfileCard
						{...defaultCardProps}
						enableTilt={false}
					/>,
				);
			}).not.toThrow();
		});

		it("should render the card with correct CSS classes", () => {
			render(
				<ProfileCard
					{...defaultCardProps}
					enableTilt={false}
				/>,
			);
			const wrapper = document.querySelector(".pc-card-wrapper");
			expect(wrapper).toBeInTheDocument();
		});
	});
});
