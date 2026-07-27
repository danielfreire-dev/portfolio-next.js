/* eslint-disable react/no-multi-comp */

/**
 * Shimmer animation utility class for skeleton loading states.
 *
 * Applies a CSS `before` pseudo-element with a translate + shimmer keyframe
 * animation that creates a glossy sweep effect across placeholder blocks.
 * Reused by every skeleton component to maintain visual consistency.
 */
const shimmer =
	"before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

/**
 * Skeleton placeholder for a single card.
 *
 * Renders a low-fidelity placeholder matching the card layout dimensions
 * (icon + title row, content block) so the page doesn't visibly jump when
 * real content loads in. Uses the shimmer animation to signal loading state.
 */
export function CardSkeleton() {
	return (
		<div className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}>
			<div className="flex p-4">
				<div className="h-5 w-5 rounded-md bg-gray-200" />
				<div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
			</div>
			<div className="flex items-center justify-center rounded-xl bg-white px-4 py-8">
				<div className="h-7 w-20 rounded-md bg-gray-200" />
			</div>
		</div>
	);
}

/**
 * Skeleton grid of four card placeholders.
 *
 * Renders a row of four `CardSkeleton` instances to fill a card-grid layout
 * while the actual card data is being fetched or suspended.
 */
export function CardsSkeleton() {
	return (
		<>
			<CardSkeleton />
			<CardSkeleton />
			<CardSkeleton />
			<CardSkeleton />
		</>
	);
}

/**
 * Skeleton placeholder for a revenue chart panel.
 *
 * Renders placeholder bars (via CSS grid rows) and a legend dot to mirror the
 * shape of the revenue chart component while data loads.
 */
export function RevenueChartSkeleton() {
	return (
		<div className={`${shimmer} relative w-full overflow-hidden md:col-span-4`}>
			<div className="mb-4 h-8 w-36 rounded-md bg-gray-100" />
			<div className="rounded-xl bg-gray-100 p-4">
				<div className="sm:grid-cols-13 mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4" />
				<div className="flex items-center pb-2 pt-6">
					<div className="h-5 w-5 rounded-full bg-gray-200" />
					<div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
				</div>
			</div>
		</div>
	);
}

/**
 * Skeleton placeholder for a single invoice row.
 *
 * Mimics the layout of an invoice list item (avatar circle, title, subtitle,
 * amount) to prevent layout shifts during data fetching.
 */
export function InvoiceSkeleton() {
	return (
		<div className="flex flex-row items-center justify-between border-b border-gray-100 py-4">
			<div className="flex items-center">
				<div className="mr-2 h-8 w-8 rounded-full bg-gray-200" />
				<div className="min-w-0">
					<div className="h-5 w-40 rounded-md bg-gray-200" />
					<div className="mt-2 h-4 w-12 rounded-md bg-gray-200" />
				</div>
			</div>
			<div className="mt-2 h-4 w-12 rounded-md bg-gray-200" />
		</div>
	);
}

/**
 * Skeleton placeholder for the latest invoices panel.
 *
 * Renders a panel header and five `InvoiceSkeleton` rows to fill the
 * "latest invoices" section while invoice data is being resolved.
 */
export function LatestInvoicesSkeleton() {
	return (
		<div className={`${shimmer} relative flex w-full flex-col overflow-hidden md:col-span-4`}>
			<div className="mb-4 h-8 w-36 rounded-md bg-gray-100" />
			<div className="flex grow flex-col justify-between rounded-xl bg-gray-100 p-4">
				<div className="bg-white px-6">
					<InvoiceSkeleton />
					<InvoiceSkeleton />
					<InvoiceSkeleton />
					<InvoiceSkeleton />
					<InvoiceSkeleton />
				</div>
				<div className="flex items-center pb-2 pt-6">
					<div className="h-5 w-5 rounded-full bg-gray-200" />
					<div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
				</div>
			</div>
		</div>
	);
}

/**
 * Skeleton placeholder for the Cloudflare Turnstile widget.
 *
 * Renders a shimmer-animated rectangle mimicking the Turnstile checkbox
 * (checkbox square + label bar + attribution text) so the contact form
 * doesn't collapse while the Turnstile script loads asynchronously.
 */
export function TurnstileSkeleton() {
	return (
		<div
			className={`${shimmer} relative overflow-hidden rounded border border-(--surface-hover) bg-(--surface) p-3 mx-auto w-[300px]`}
			data-testid="turnstile-skeleton">
			<div className="flex items-center gap-3">
				<div className="h-6 w-6 rounded-sm bg-(--surface-hover) flex-shrink-0" />
				<div className="h-4 w-36 rounded-md bg-(--surface-hover)" />
			</div>
			<div className="mt-2 flex justify-center">
				<div className="h-3 w-44 rounded-md bg-(--surface-hover)" />
			</div>
		</div>
	);
}

/**
 * Skeleton placeholder for the entire contact form.
 *
 * Renders placeholder blocks for all form fields (name, email, phone,
 * message, privacy checkbox, Turnstile widget, submit button) to prevent
 * cumulative layout shift while the form hydrates or loads dynamically.
 */
export function ContactFormSkeleton() {
	return (
		<div className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-4 shadow-sm`}>
			<div className="name-div flex flex-col lg:flex-row">
				<section className="flex flex-col lg:mr-4">
					<div className="h-6 w-24 rounded-md bg-gray-200 mb-2" />
					<div className="h-10 w-full rounded-md bg-gray-200" />
				</section>
				<section className="flex flex-col">
					<div className="h-6 w-24 rounded-md bg-gray-200 mb-2" />
					<div className="h-10 w-full rounded-md bg-gray-200" />
				</section>
			</div>
			<div className="contacts-div flex flex-col lg:flex-row mt-4">
				<section className="flex flex-col lg:mr-4">
					<div className="h-6 w-24 rounded-md bg-gray-200 mb-2" />
					<div className="h-10 w-full rounded-md bg-gray-200" />
				</section>
				<section className="flex flex-col">
					<div className="h-6 w-24 rounded-md bg-gray-200 mb-2" />
					<div className="h-10 w-full rounded-md bg-gray-200" />
				</section>
			</div>
			<section className="message-div flex flex-col mt-4">
				<div className="h-6 w-24 rounded-md bg-gray-200 mb-2" />
				<div className="h-24 w-full rounded-md bg-gray-200" />
			</section>
			<div className="mt-4">
				<div className="h-6 w-48 rounded-md bg-gray-200 mb-2" />
			</div>
			<TurnstileSkeleton />
			<section className="flex justify-center mx-auto my-1.5">
				<div className="h-10 w-24 rounded-md bg-gray-200" />
			</section>
		</div>
	);
}

/**
 * Skeleton placeholder for a single portfolio website card.
 *
 * Renders a placeholder image block and text bars matching the dimensions of
 * the `WebsiteCards` card layout to avoid layout shift during image loading.
 */
export function WebsiteCardSkeleton() {
	return (
		<div className="max-w-lg last:mr-0 mb-6 p-3 bg-gray-100">
			<div className="overflow-hidden shadow-md">
				<div className="h-48 w-full rounded-md bg-gray-200" />
			</div>
			<div className="mt-4 box-border">
				<div className="h-6 w-32 rounded-md bg-gray-200 mb-2" />
				<div className="h-4 w-full rounded-md bg-gray-200" />
			</div>
		</div>
	);
}

/**
 * Skeleton placeholder for the portfolio website cards grid.
 *
 * Renders two section headings and six `WebsiteCardSkeleton` instances (three
 * per section) to fill both the "websites" and "projects" card grids while
 * portfolio data is being fetched or suspended.
 */
export function WebsiteCardsSkeleton() {
	return (
		<div className="mx-15 text-center flex flex-wrap flex-col justify-center">
			<div className="h-8 w-48 rounded-md bg-gray-200 mb-4" />
			<section className="flex flex-row flex-wrap justify-center gap-x-7">
				<WebsiteCardSkeleton />
				<WebsiteCardSkeleton />
				<WebsiteCardSkeleton />
			</section>
			<div className="h-8 w-48 rounded-md bg-gray-200 mb-4 mt-8" />
			<section className="flex flex-row flex-wrap justify-center gap-x-7">
				<WebsiteCardSkeleton />
				<WebsiteCardSkeleton />
				<WebsiteCardSkeleton />
			</section>
		</div>
	);
}

/**
 * Skeleton placeholder for the full dashboard page.
 *
 * Renders a composite skeleton comprising a title bar, four `CardSkeleton`
 * cards, a `RevenueChartSkeleton`, and a `LatestInvoicesSkeleton` to fill
 * the entire dashboard layout while all data sources are loading.
 */
export default function DashboardSkeleton() {
	return (
		<>
			<div className={`${shimmer} relative mb-4 h-8 w-36 overflow-hidden rounded-md bg-gray-100`} />
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<CardSkeleton />
				<CardSkeleton />
				<CardSkeleton />
				<CardSkeleton />
			</div>
			<div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
				<RevenueChartSkeleton />
				<LatestInvoicesSkeleton />
			</div>
		</>
	);
}

/**
 * Skeleton placeholder for a mobile invoice list item.
 *
 * Renders a compact placeholder matching the mobile invoice row layout
 * (avatar, title, amount, action buttons) to prevent layout shift on
 * smaller viewports during data fetching.
 */
export function InvoicesMobileSkeleton() {
	return (
		<div className="mb-2 w-full rounded-md bg-white p-4">
			<div className="flex items-center justify-between border-b border-gray-100 pb-8">
				<div className="flex items-center">
					<div className="mr-2 h-8 w-8 rounded-full bg-gray-100" />
					<div className="h-6 w-16 rounded bg-gray-100" />
				</div>
				<div className="h-6 w-16 rounded bg-gray-100" />
			</div>
			<div className="flex w-full items-center justify-between pt-4">
				<div>
					<div className="h-6 w-16 rounded bg-gray-100" />
					<div className="mt-2 h-6 w-24 rounded bg-gray-100" />
				</div>
				<div className="flex justify-end gap-2">
					<div className="h-10 w-10 rounded bg-gray-100" />
					<div className="h-10 w-10 rounded bg-gray-100" />
				</div>
			</div>
		</div>
	);
}
