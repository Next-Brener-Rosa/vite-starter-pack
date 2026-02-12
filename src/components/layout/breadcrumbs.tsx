import { Link, useRouterState } from "@tanstack/react-router";
import {
	Breadcrumb,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	BreadcrumbItem as UiBreadcrumbItem,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

type BreadcrumbsProps = {
	className?: string;
};

export function Breadcrumbs({ className }: BreadcrumbsProps) {
	const context = useRouterState({
		select: (s) => s.matches[s.matches.length - 1]?.context,
	});
	const breadcrumbs = context?.breadcrumbs ?? [];

	if (breadcrumbs.length === 0) {
		return null;
	}

	return (
		<Breadcrumb className={cn("min-w-0", className)}>
			<BreadcrumbList>
			{breadcrumbs.map((item, idx) => {
				const isLast = idx === breadcrumbs.length - 1;
				const hrefKey =
					item.href == null
						? `crumb-${item.title}-${idx}`
						: typeof item.href === "string"
							? item.href
							: `crumb-${item.title}-${idx}-${JSON.stringify(item.href)}`;
				return (
					<UiBreadcrumbItem key={`${hrefKey}-${item.title}-${idx}`}>
							{isLast ? (
								<BreadcrumbPage className="font-medium">
									{item.title}
								</BreadcrumbPage>
							) : item.href ? (
								<BreadcrumbLink asChild className="truncate">
									<Link to={item.href as never}>{item.title}</Link>
								</BreadcrumbLink>
							) : (
								<span className="truncate">{item.title}</span>
							)}
							{isLast ? null : <BreadcrumbSeparator />}
						</UiBreadcrumbItem>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
