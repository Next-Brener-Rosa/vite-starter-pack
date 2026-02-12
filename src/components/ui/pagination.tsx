import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PaginationData {
	total: number;
	count: number;
	per_page: number;
	current_page: number;
	total_pages: number;
}

interface PaginationProps {
	pagination: PaginationData;
	currentPage: number;
	perPage: number;
	onPageChange: (page: number) => void;
	isLoading?: boolean;
	itemLabel?: string;
}

export function Pagination({
	pagination,
	currentPage,
	perPage,
	onPageChange,
	isLoading = false,
	itemLabel = "resultado(s)",
}: PaginationProps) {
	const handleFirstPage = () => {
		onPageChange(1);
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < pagination.total_pages) {
			onPageChange(currentPage + 1);
		}
	};

	const handleLastPage = () => {
		onPageChange(pagination.total_pages);
	};

	const getPageNumbers = (): (number | string)[] => {
		const { current_page, total_pages } = pagination;
		const pages: (number | string)[] = [];
		const maxVisible = 5;

		if (total_pages <= maxVisible) {
			for (let i = 1; i <= total_pages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			let start = Math.max(2, current_page - 1);
			let end = Math.min(total_pages - 1, current_page + 1);

			if (current_page <= 3) {
				start = 2;
				end = Math.min(4, total_pages - 1);
			}

			if (current_page >= total_pages - 2) {
				start = Math.max(2, total_pages - 3);
				end = total_pages - 1;
			}

			if (start > 2) {
				pages.push("...");
			}

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (end < total_pages - 1) {
				pages.push("...");
			}

			if (total_pages > 1) {
				pages.push(total_pages);
			}
		}

		return pages;
	};

	const getItemRange = () => {
		const start = (currentPage - 1) * perPage + 1;
		const end = Math.min(start + pagination.count - 1, pagination.total);
		return { start, end };
	};

	const pageNumbers = getPageNumbers();
	const itemRange = getItemRange();

	return (
		<div className="flex items-center justify-between px-2 py-2">
			<div className="flex-1 text-xs text-muted-foreground">
				Mostrando&nbsp;
				<span className="font-semibold text-foreground">
					{itemRange.start}-{itemRange.end}
				</span>
				&nbsp; de&nbsp;
				<span className="font-semibold text-foreground">
					{pagination.total}
				</span>
				&nbsp; {itemLabel}
			</div>
			<div className="flex items-center gap-2">
				<Button
					variant="ghost"
					size="icon"
					onClick={handleFirstPage}
					disabled={currentPage === 1 || isLoading}
					className="size-7 text-xs shadow-none"
				>
					<ChevronsLeftIcon />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={handlePreviousPage}
					disabled={currentPage === 1 || isLoading}
					className="size-7 text-xs shadow-none"
				>
					<ChevronLeftIcon />
				</Button>
				{pageNumbers.map((pageNum, idx) => {
					if (pageNum === "...") {
						const ellipsisKey = `ellipsis-${pagination.current_page}-${idx}`;
						return (
							<Button
								key={ellipsisKey}
								variant="ghost"
								size="icon"
								disabled
								className="size-7 text-xs shadow-none"
							>
								...
							</Button>
						);
					}
					const pageNumber = pageNum as number;
					const isActive = pageNumber === pagination.current_page;
					return (
						<Button
							key={pageNumber}
							variant={isActive ? "default" : "ghost"}
							size="icon"
							onClick={() => onPageChange(pageNumber)}
							disabled={isLoading}
							className={cn(
								"size-7 text-xs shadow-none",
								isActive &&
									"bg-primary text-primary-foreground hover:bg-primary/90",
							)}
						>
							{pageNumber}
						</Button>
					);
				})}
				<Button
					variant="ghost"
					size="icon"
					onClick={handleNextPage}
					disabled={currentPage >= pagination.total_pages || isLoading}
					className="size-7 text-xs shadow-none"
				>
					<ChevronRightIcon />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={handleLastPage}
					disabled={currentPage >= pagination.total_pages || isLoading}
					className="size-7 text-xs shadow-none"
				>
					<ChevronsRightIcon />
				</Button>
			</div>
		</div>
	);
}
