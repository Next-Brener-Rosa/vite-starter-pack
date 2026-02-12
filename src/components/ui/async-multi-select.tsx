import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface AsyncSelectItemType {
	id: string;
	label: string;
	value: string;
}

interface AsyncMultiSelectTriggerPropsState {
	onSearchChange?: (search: string) => void;
	isLoading: boolean;
	placeholder: string;
	disabled: boolean;
	debounceMs: number;
}

interface AsyncMultiSelectContextValue
	extends AsyncMultiSelectTriggerPropsState {
	open: boolean;
	setOpen: (open: boolean) => void;
	value: string[];
	onValueChange: ((value: string[]) => void) | undefined;
	search: string;
	setSearch: (search: string) => void;
	items: AsyncSelectItemType[];
	setItemsFromChildren: (next: AsyncSelectItemType[]) => void;
	labelsByValue: Record<string, string>;
	setTriggerProps: (props: Partial<AsyncMultiSelectTriggerPropsState>) => void;
	triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const AsyncMultiSelectContext =
	React.createContext<AsyncMultiSelectContextValue | null>(null);

function useAsyncMultiSelect() {
	const context = React.useContext(AsyncMultiSelectContext);
	if (!context) {
		throw new Error(
			"AsyncMultiSelect components must be used within <AsyncMultiSelect>",
		);
	}
	return context;
}

const DEFAULT_DEBOUNCE_MS = 300;

const DEFAULT_TRIGGER_PROPS: AsyncMultiSelectTriggerPropsState = {
	isLoading: false,
	placeholder: "Selecionar...",
	disabled: false,
	debounceMs: DEFAULT_DEBOUNCE_MS,
};

export interface AsyncMultiSelectProps {
	value?: string[];
	onValueChange?: (value: string[]) => void;
	children: React.ReactNode;
}

function AsyncMultiSelect({
	value = [],
	onValueChange,
	children,
}: AsyncMultiSelectProps) {
	const [open, setOpen] = React.useState(false);
	const [search, setSearch] = React.useState("");
	const [items, setItems] = React.useState<AsyncSelectItemType[]>([]);
	const [labelsByValue, setLabelsByValue] = React.useState<
		Record<string, string>
	>({});
	const [triggerProps, setTriggerProps] =
		React.useState<AsyncMultiSelectTriggerPropsState>(DEFAULT_TRIGGER_PROPS);
	const triggerRef = React.useRef<HTMLButtonElement>(null);

	const setItemsFromChildren = React.useCallback(
		(next: AsyncSelectItemType[]) => {
			setItems(next);
			setLabelsByValue((prev) => {
				const nextMap = { ...prev };
				next.forEach((item) => {
					nextMap[item.value] = item.label;
				});
				return nextMap;
			});
		},
		[],
	);

	const setTriggerPropsStable = React.useCallback(
		(next: Partial<AsyncMultiSelectTriggerPropsState>) => {
			setTriggerProps((prev) => ({ ...prev, ...next }));
		},
		[],
	);

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) {
			setSearch("");
			triggerProps.onSearchChange?.("");
		}
	};

	const contextValue: AsyncMultiSelectContextValue = {
		...triggerProps,
		open,
		setOpen: handleOpenChange,
		value,
		onValueChange,
		search,
		setSearch,
		items,
		setItemsFromChildren,
		labelsByValue,
		setTriggerProps: setTriggerPropsStable,
		triggerRef,
	};

	return (
		<AsyncMultiSelectContext.Provider value={contextValue}>
			<Popover open={open} onOpenChange={handleOpenChange}>
				{children}
			</Popover>
		</AsyncMultiSelectContext.Provider>
	);
}
AsyncMultiSelect.displayName = "AsyncMultiSelect";

export interface AsyncMultiSelectTriggerProps {
	onSearchChange?: (search: string) => void;
	isLoading?: boolean;
	placeholder?: string;
	disabled?: boolean;
	debounceMs?: number;
}

const AsyncMultiSelectTrigger = React.forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof Button> & AsyncMultiSelectTriggerProps
>(
	(
		{
			className,
			children,
			placeholder: placeholderProp,
			onSearchChange,
			isLoading = false,
			placeholder = "Selecionar...",
			disabled = false,
			debounceMs = DEFAULT_DEBOUNCE_MS,
			...props
		},
		ref,
	) => {
		const { value, labelsByValue, open, triggerRef, setTriggerProps } =
			useAsyncMultiSelect();

		React.useEffect(() => {
			setTriggerProps({
				onSearchChange,
				isLoading,
				placeholder,
				disabled,
				debounceMs,
			});
			return () => setTriggerProps(DEFAULT_TRIGGER_PROPS);
		}, [
			onSearchChange,
			isLoading,
			placeholder,
			disabled,
			debounceMs,
			setTriggerProps,
		]);

		const mergedRef = React.useCallback(
			(el: HTMLButtonElement | null) => {
				(
					triggerRef as React.MutableRefObject<HTMLButtonElement | null>
				).current = el;
				if (typeof ref === "function") ref(el);
				else if (ref)
					(ref as React.MutableRefObject<HTMLButtonElement | null>).current =
						el;
			},
			[ref, triggerRef],
		);

		const displayText =
			value.length === 0
				? (placeholderProp ?? placeholder)
				: value.length === 1
					? (labelsByValue[value[0]] ?? value[0])
					: `${value.length} selecionados`;

		return (
			<PopoverTrigger asChild>
				<Button
					ref={mergedRef}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						"h-9 w-full justify-between font-normal shadow-sm",
						value.length === 0 && "text-muted-foreground",
						className,
					)}
					disabled={disabled}
					{...props}
				>
					{children ?? <span className="truncate">{displayText}</span>}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
		);
	},
);
AsyncMultiSelectTrigger.displayName = "AsyncMultiSelectTrigger";

const AsyncMultiSelectContent = React.forwardRef<
	React.ElementRef<typeof PopoverContent>,
	React.ComponentPropsWithoutRef<typeof PopoverContent>
>(({ className, children, ...props }, ref) => {
	const { triggerRef, open } = useAsyncMultiSelect();
	const [triggerWidth, setTriggerWidth] = React.useState<number | undefined>(
		undefined,
	);

	React.useEffect(() => {
		if (open && triggerRef?.current) {
			const updateWidth = () => {
				if (triggerRef.current) {
					setTriggerWidth(triggerRef.current.offsetWidth);
				}
			};
			const timeoutId = setTimeout(updateWidth, 0);
			window.addEventListener("resize", updateWidth);
			return () => {
				clearTimeout(timeoutId);
				window.removeEventListener("resize", updateWidth);
			};
		}
	}, [open, triggerRef]);

	return (
		<PopoverContent
			ref={ref}
			className={cn("p-0", className)}
			align="start"
			style={
				triggerWidth
					? { width: `${triggerWidth}px`, minWidth: `${triggerWidth}px` }
					: undefined
			}
			{...props}
		>
			{children}
		</PopoverContent>
	);
});
AsyncMultiSelectContent.displayName = "AsyncMultiSelectContent";

const AsyncMultiSelectSearchInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentPropsWithoutRef<typeof Input> & { placeholder?: string }
>(
	(
		{ className, placeholder = "Buscar...", onChange: _onChange, ...props },
		ref,
	) => {
		const { search, setSearch, onSearchChange, debounceMs } =
			useAsyncMultiSelect();

		React.useEffect(() => {
			const timer = setTimeout(() => {
				onSearchChange?.(search);
			}, debounceMs);
			return () => clearTimeout(timer);
		}, [search, debounceMs, onSearchChange]);

		return (
			<div className="flex items-center border-b px-3">
				<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
				<Input
					ref={ref}
					placeholder={placeholder}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className={cn(
						"border-0 focus-visible:ring-0 h-9 shadow-none p-0 text-xs placeholder:text-xs",
						className,
					)}
					{...props}
				/>
			</div>
		);
	},
);
AsyncMultiSelectSearchInput.displayName = "AsyncMultiSelectSearchInput";

interface AsyncMultiSelectItemProps {
	value: string;
	label?: string;
	children: React.ReactNode;
	className?: string;
}

function deriveItemsFromChildren(
	children: React.ReactNode,
	itemComponent: React.ComponentType<AsyncMultiSelectItemProps>,
): AsyncSelectItemType[] {
	const derived: AsyncSelectItemType[] = [];
	React.Children.forEach(children, (child) => {
		if (!React.isValidElement(child) || child.type !== itemComponent) return;
		const p = child.props as AsyncMultiSelectItemProps;
		derived.push({
			id: p.value,
			value: p.value,
			label: p.label ?? (typeof p.children === "string" ? p.children : p.value),
		});
	});
	return derived;
}

const AsyncMultiSelectList = React.forwardRef<
	React.ElementRef<typeof ScrollArea>,
	React.ComponentPropsWithoutRef<typeof ScrollArea>
>(({ className, children, ...props }, ref) => {
	const { setItemsFromChildren } = useAsyncMultiSelect();
	const derived = React.useMemo(
		() => deriveItemsFromChildren(children, AsyncMultiSelectItem),
		[children],
	);

	React.useEffect(() => {
		setItemsFromChildren(derived);
		return () => setItemsFromChildren([]);
	}, [derived, setItemsFromChildren]);

	return (
		<ScrollArea
			ref={ref}
			className={cn("max-h-[300px]", className)}
			role="listbox"
			{...props}
		>
			<div className="p-1">{children}</div>
		</ScrollArea>
	);
});
AsyncMultiSelectList.displayName = "AsyncMultiSelectList";

function AsyncMultiSelectItem({
	value,
	label: _label,
	children,
	className,
}: AsyncMultiSelectItemProps) {
	const { value: selectedValues, onValueChange } = useAsyncMultiSelect();
	const isSelected = selectedValues.includes(value);

	const handleClick = () => {
		if (!onValueChange) return;
		if (isSelected) {
			onValueChange(selectedValues.filter((v) => v !== value));
		} else {
			onValueChange([...selectedValues, value]);
		}
	};

	return (
		<button
			type="button"
			role="option"
			aria-selected={isSelected}
			className={cn(
				"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
				className,
			)}
			onClick={handleClick}
			onMouseDown={(e) => e.preventDefault()}
		>
			<span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
				{isSelected ? (
					<Check className="size-4" />
				) : (
					<span className="size-4" />
				)}
			</span>
			{children}
		</button>
	);
}
AsyncMultiSelectItem.displayName = "AsyncMultiSelectItem";

interface AsyncMultiSelectEmptyProps {
	children?: React.ReactNode;
	className?: string;
}

function AsyncMultiSelectEmpty({
	children,
	className,
}: AsyncMultiSelectEmptyProps) {
	const { items, isLoading } = useAsyncMultiSelect();

	if (isLoading || items.length > 0) {
		return null;
	}

	return (
		<div
			className={cn(
				"py-6 text-center text-sm text-muted-foreground",
				className,
			)}
		>
			{children ?? "Nenhum resultado encontrado."}
		</div>
	);
}
AsyncMultiSelectEmpty.displayName = "AsyncMultiSelectEmpty";

interface AsyncMultiSelectBadgesProps {
	className?: string;
	children?: React.ReactNode;
}

function AsyncMultiSelectBadges({
	className,
	children,
}: AsyncMultiSelectBadgesProps) {
	return (
		<div className={cn("flex flex-wrap gap-1.5 mt-1.5", className)}>
			{children}
		</div>
	);
}
AsyncMultiSelectBadges.displayName = "AsyncMultiSelectBadges";

interface AsyncMultiSelectBadgesItemProps {
	value: string;
	children?: React.ReactNode;
	className?: string;
}

function AsyncMultiSelectBadgesItem({
	value,
	children,
	className,
}: AsyncMultiSelectBadgesItemProps) {
	const { value: selectedValues, onValueChange } = useAsyncMultiSelect();

	const handleRemove = () => {
		onValueChange?.(selectedValues.filter((id) => id !== value));
	};

	return (
		<Badge
			variant="secondary"
			className={cn(
				"pl-1.5 pr-1 gap-0.5 font-normal text-[0.625rem]",
				className,
			)}
		>
			<span className="truncate max-w-[200px]">{children ?? value}</span>
			<button
				type="button"
				className="rounded-sm opacity-70 ring-offset-background hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					handleRemove();
				}}
				onMouseDown={(e) => e.preventDefault()}
			>
				<X className="size-2.5" />
			</button>
		</Badge>
	);
}
AsyncMultiSelectBadgesItem.displayName = "AsyncMultiSelectBadgesItem";

export {
	AsyncMultiSelect,
	AsyncMultiSelectTrigger,
	AsyncMultiSelectBadges,
	AsyncMultiSelectBadgesItem,
	AsyncMultiSelectContent,
	AsyncMultiSelectSearchInput,
	AsyncMultiSelectList,
	AsyncMultiSelectItem,
	AsyncMultiSelectEmpty,
};
