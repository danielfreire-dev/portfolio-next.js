/* eslint-disable react/no-multi-comp */

/** Shimmer animation utility class for skeleton loading states. */
const shimmer =
	"before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

/** Skeleton placeholder for a single card. */
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

/** Skeleton placeholder for the Cloudflare Turnstile widget. */
export function TurnstileSkeleton() {
	return (
		<div
			className={`${shimmer} relative overflow-hidden rounded border border-(--surface-hover) bg-(--surface) p-3 mx-auto w-[300px]`}
			data-testid="turnstile-skeleton">
			<div className="flex items-center gap-3">
				{/* Checkbox placeholder */}
				<div className="h-6 w-6 rounded-sm bg-(--surface-hover) flex-shrink-0" />
				{/* Label text bar */}
				<div className="h-4 w-36 rounded-md bg-(--surface-hover)" />
			</div>
			{/* Privacy/attribution text bar below the widget */}
			<div className="mt-2 flex justify-center">
				<div className="h-3 w-44 rounded-md bg-(--surface-hover)" />
			</div>
		</div>
	);
}

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
