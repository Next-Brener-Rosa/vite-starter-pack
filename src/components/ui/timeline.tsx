import * as React from "react";

import { cn } from "@/lib/utils";

type TimelineOrientation = "vertical" | "horizontal";

type TimelineContextValue = {
	orientation: TimelineOrientation;
	lineClassName: string;
	indicatorClassName: string;
	indicatorSize?: string;
	indicatorShape?: string;
};

const TimelineContext = React.createContext<TimelineContextValue | null>(null);

function useTimelineContext() {
	const context = React.useContext(TimelineContext);
	return context ?? null;
}

const LINE_VERTICAL_CLASS = "w-0.5 flex-1 min-h-2 bg-muted";
const LINE_HORIZONTAL_CLASS = "h-1 flex-1 min-w-2 bg-muted rounded-full";
const INDICATOR_DEFAULT_CLASS = "size-4 bg-primary rounded-full shrink-0";

const TimelineConnectorLine = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
	const context = useTimelineContext();
	const orientation = context?.orientation ?? "vertical";
	const baseClass =
		context?.lineClassName ??
		(orientation === "horizontal"
			? LINE_HORIZONTAL_CLASS
			: LINE_VERTICAL_CLASS);
	return (
		<div
			ref={ref}
			className={cn(baseClass, className)}
			aria-hidden
			{...props}
		/>
	);
});
TimelineConnectorLine.displayName = "TimelineConnectorLine";

type TimelineProps = React.ComponentProps<"ul"> & {
	orientation?: TimelineOrientation;
	classNames?: {
		line?: string;
		indicator?: string;
	};
	indicatorSize?: string;
	indicatorShape?: string;
};

const Timeline = React.forwardRef<HTMLUListElement, TimelineProps>(
	(
		{
			className,
			orientation = "vertical",
			classNames,
			indicatorSize,
			indicatorShape = "rounded-full",
			children,
			...props
		},
		ref,
	) => {
		const resolvedLineClass =
			classNames?.line ??
			(orientation === "horizontal"
				? LINE_HORIZONTAL_CLASS
				: LINE_VERTICAL_CLASS);
		const resolvedIndicatorClass =
			classNames?.indicator ?? INDICATOR_DEFAULT_CLASS;

		const contextValue: TimelineContextValue = React.useMemo(
			() => ({
				orientation,
				lineClassName: resolvedLineClass,
				indicatorClassName: resolvedIndicatorClass,
				indicatorSize,
				indicatorShape,
			}),
			[
				orientation,
				resolvedLineClass,
				resolvedIndicatorClass,
				indicatorSize,
				indicatorShape,
			],
		);

		const itemCount = React.useMemo(() => {
			let count = 0;
			React.Children.forEach(children, (child) => {
				if (
					React.isValidElement(child) &&
					(child.type as React.ComponentType & { displayName?: string })
						?.displayName === "TimelineItem"
				) {
					count++;
				}
			});
			return count;
		}, [children]);

		const mappedChildren = React.useMemo(() => {
			let itemIndex = -1;
			return React.Children.map(children, (child) => {
				if (
					React.isValidElement(child) &&
					(child.type as React.ComponentType & { displayName?: string })
						?.displayName === "TimelineItem"
				) {
					itemIndex++;
					const index = itemIndex;
					return React.cloneElement(child, {
						index,
						isFirst: index === 0,
						isLast: index === itemCount - 1,
					} as Partial<TimelineItemProps>);
				}
				return child;
			});
		}, [children, itemCount]);

		return (
			<TimelineContext.Provider value={contextValue}>
				{orientation === "horizontal" ? (
					<div className={cn("relative w-full pt-px", className)}>
						<div
							aria-hidden
							className={cn(
								"absolute left-0 right-0 top-[12px] h-1 w-full -translate-y-1/2 rounded-full",
								resolvedLineClass,
							)}
						/>
						<ul
							ref={ref as React.Ref<HTMLUListElement>}
							className="relative flex w-full list-none flex-row items-stretch justify-start gap-8 overflow-x-auto p-0 m-0"
							aria-label="Timeline"
						>
							{mappedChildren}
						</ul>
					</div>
				) : (
					<ul
						ref={ref as React.Ref<HTMLUListElement>}
						className={cn(
							"relative flex list-none p-0 m-0 flex-col",
							className,
						)}
						aria-label="Timeline"
						{...props}
					>
						{mappedChildren}
					</ul>
				)}
			</TimelineContext.Provider>
		);
	},
);
Timeline.displayName = "Timeline";

type TimelineItemProps = React.ComponentProps<"li"> & {
	index?: number;
	isFirst?: boolean;
	isLast?: boolean;
};

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
	(
		{ className, children, index = 0, isFirst = true, isLast = true, ...props },
		ref,
	) => {
		const timelineContext = useTimelineContext();
		const orientation = timelineContext?.orientation ?? "vertical";

		const { indicatorChild, contentChildren } = React.useMemo(() => {
			const childArray = React.Children.toArray(children);
			let indicator: React.ReactNode = null;
			const content: React.ReactNode[] = [];
			for (const c of childArray) {
				const displayName =
					React.isValidElement(c) &&
					(c.type as React.ComponentType & { displayName?: string })
						?.displayName;
				if (displayName === "TimelineItemIndicator") {
					indicator = c;
				} else if (displayName === "TimelineConnectorLine") {
				} else {
					content.push(c);
				}
			}
			return { indicatorChild: indicator, contentChildren: content };
		}, [children]);

		const defaultIndicator = timelineContext ? (
			<TimelineItemIndicator />
		) : (
			<div className={cn(INDICATOR_DEFAULT_CLASS)} />
		);

		const isHorizontal = orientation === "horizontal";

		return (
			<li
				ref={ref as React.Ref<HTMLLIElement>}
				className={cn(
					"relative flex",
					isHorizontal
						? "min-w-0 max-w-96 shrink-0 flex-col gap-2"
						: "min-w-0 flex-row gap-4",
					className,
				)}
				{...props}
			>
				{isHorizontal ? (
					<>
						<div className="flex h-6 shrink-0 items-center justify-start">
							{indicatorChild ?? defaultIndicator}
						</div>
						<div className="min-w-0 text-left">{contentChildren}</div>
					</>
				) : (
					<React.Fragment>
						<div className="flex flex-col items-center gap-3 min-w-0">
							<TimelineConnectorLine
								className={isFirst ? "flex-none min-h-6" : undefined}
							/>
							{indicatorChild ?? defaultIndicator}
							<TimelineConnectorLine
								className={isLast ? "flex-none min-h-6" : undefined}
							/>
						</div>
						<div className={cn("flex-1 min-w-0 pt-0.5", !isLast && "pb-8")}>
							{contentChildren}
						</div>
					</React.Fragment>
				)}
			</li>
		);
	},
);
TimelineItem.displayName = "TimelineItem";

function TimelineItemContent({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("flex flex-col items-start gap-2", className)}
			{...props}
		/>
	);
}

function TimelineItemTitle({
	className,
	...props
}: React.ComponentProps<"h3">) {
	return <h3 className={cn("text-sm font-medium", className)} {...props} />;
}

function TimelineItemDescription({
	className,
	...props
}: React.ComponentProps<"p">) {
	return (
		<p className={cn("text-sm text-muted-foreground", className)} {...props} />
	);
}

function TimelineItemTime({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p className={cn("text-sm text-muted-foreground", className)} {...props} />
	);
}

const TimelineItemIndicator = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
	const context = useTimelineContext();
	const baseClass = context?.indicatorClassName ?? INDICATOR_DEFAULT_CLASS;
	return (
		<div
			ref={ref}
			className={cn(baseClass, className)}
			aria-hidden
			{...props}
		/>
	);
});
TimelineItemIndicator.displayName = "TimelineItemIndicator";

const TimelineIndicator = TimelineItemIndicator;

function TimelineLine({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("h-1 flex-1 min-w-2 bg-muted rounded-full", className)}
			aria-hidden
			{...props}
		/>
	);
}

export {
	Timeline,
	TimelineLine,
	TimelineConnectorLine,
	TimelineItem,
	TimelineItemContent,
	TimelineItemIndicator,
	TimelineIndicator,
	TimelineItemTitle,
	TimelineItemDescription,
	TimelineItemTime,
};
