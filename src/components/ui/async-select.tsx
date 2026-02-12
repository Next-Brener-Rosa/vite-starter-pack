import { Check, ChevronsUpDown, Search } from "lucide-react";
import * as React from "react";
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

interface AsyncSelectTriggerPropsState {
	onSearchChange?: (search: string) => void;
	isLoading: boolean;
	placeholder: string;
	disabled: boolean;
	debounceMs: number;
}

interface AsyncSelectContextValue extends AsyncSelectTriggerPropsState {
	open: boolean;
	setOpen: (open: boolean) => void;
	value: string | undefined;
	onValueChange: ((value: string) => void) | undefined;
	search: string;
	setSearch: (search: string) => void;
	items: AsyncSelectItemType[];
	setItemsFromChildren: (next: AsyncSelectItemType[]) => void;
	setTriggerProps: (props: Partial<AsyncSelectTriggerPropsState>) => void;
	triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const AsyncSelectContext = React.createContext<AsyncSelectContextValue | null>(
	null,
);

function useAsyncSelect() {
	const context = React.useContext(AsyncSelectContext);
	if (!context) {
		throw new Error("AsyncSelect components must be used within <AsyncSelect>");
	}
	return context;
}

const DEFAULT_DEBOUNCE_MS = 300;

const DEFAULT_TRIGGER_PROPS: AsyncSelectTriggerPropsState = {
	isLoading: false,
	placeholder: "Selecionar...",
	disabled: false,
	debounceMs: DEFAULT_DEBOUNCE_MS,
};

interface AsyncSelectProps {
	value?: string;
	onValueChange?: (value: string) => void;
	children: React.ReactNode;
}

function AsyncSelect({ value, onValueChange, children }: AsyncSelectProps) {
	const [open, setOpen] = React.useState(false);
	const [search, setSearch] = React.useState("");
	const [items, setItems] = React.useState<AsyncSelectItemType[]>([]);
	const [triggerProps, setTriggerProps] =
		React.useState<AsyncSelectTriggerPropsState>(DEFAULT_TRIGGER_PROPS);
	const triggerRef = React.useRef<HTMLButtonElement>(null);

	const setItemsFromChildren = React.useCallback(
		(next: AsyncSelectItemType[]) => {
			setItems(next);
		},
		[],
	);

	const setTriggerPropsStable = React.useCallback(
		(next: Partial<AsyncSelectTriggerPropsState>) => {
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

	const contextValue: AsyncSelectContextValue = {
		...triggerProps,
		open,
		setOpen: handleOpenChange,
		value,
		onValueChange,
		search,
		setSearch,
		items,
		setItemsFromChildren,
		setTriggerProps: setTriggerPropsStable,
		triggerRef,
	};

	return (
		<AsyncSelectContext.Provider value={contextValue}>
			<Popover open={open} onOpenChange={handleOpenChange}>
				{children}
			</Popover>
		</AsyncSelectContext.Provider>
	);
}
AsyncSelect.displayName = "AsyncSelect";

export interface AsyncSelectTriggerProps {
	onSearchChange?: (search: string) => void;
	isLoading?: boolean;
	placeholder?: string;
	disabled?: boolean;
	debounceMs?: number;
}

const AsyncSelectTrigger = React.forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof Button> & AsyncSelectTriggerProps
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
		const { value, items, open, triggerRef, setTriggerProps } =
			useAsyncSelect();

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

		const selectedItem = React.useMemo(
			() => items.find((item) => item.value === value),
			[items, value],
		);

		return (
			<PopoverTrigger asChild>
				<Button
					ref={mergedRef}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						"h-9 w-full justify-between font-normal shadow-sm",
						!selectedItem && "text-muted-foreground",
						className,
					)}
					disabled={disabled}
					{...props}
				>
					{children ??
						(selectedItem ? (
							<span className="truncate">{selectedItem.label}</span>
						) : (
							<span className="truncate">{placeholderProp ?? placeholder}</span>
						))}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
		);
	},
);
AsyncSelectTrigger.displayName = "AsyncSelectTrigger";

const AsyncSelectContent = React.forwardRef<
	React.ElementRef<typeof PopoverContent>,
	React.ComponentPropsWithoutRef<typeof PopoverContent>
>(({ className, children, ...props }, ref) => {
	const { triggerRef, open } = useAsyncSelect();
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
AsyncSelectContent.displayName = "AsyncSelectContent";

const AsyncSelectSearchInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentPropsWithoutRef<typeof Input> & { placeholder?: string }
>(
	(
		{ className, placeholder = "Buscar...", onChange: _onChange, ...props },
		ref,
	) => {
		const { search, setSearch, onSearchChange, debounceMs } = useAsyncSelect();

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
AsyncSelectSearchInput.displayName = "AsyncSelectSearchInput";

interface AsyncSelectItemProps {
	value: string;
	label?: string;
	children: React.ReactNode;
	className?: string;
}

function deriveItemsFromChildren(
	children: React.ReactNode,
	asyncSelectItemType: React.ComponentType<AsyncSelectItemProps>,
): AsyncSelectItemType[] {
	const derived: AsyncSelectItemType[] = [];
	React.Children.forEach(children, (child) => {
		if (!React.isValidElement(child) || child.type !== asyncSelectItemType)
			return;
		const p = child.props as AsyncSelectItemProps;
		derived.push({
			id: p.value,
			value: p.value,
			label: p.label ?? (typeof p.children === "string" ? p.children : p.value),
		});
	});
	return derived;
}

const AsyncSelectList = React.forwardRef<
	React.ElementRef<typeof ScrollArea>,
	React.ComponentPropsWithoutRef<typeof ScrollArea>
>(({ className, children, ...props }, ref) => {
	const { setItemsFromChildren } = useAsyncSelect();
	const derived = React.useMemo(
		() => deriveItemsFromChildren(children, AsyncSelectItem),
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
AsyncSelectList.displayName = "AsyncSelectList";

function AsyncSelectItem({
	value,
	label: _label,
	children,
	className,
}: AsyncSelectItemProps) {
	const { value: selectedValue, onValueChange, setOpen } = useAsyncSelect();
	const isSelected = selectedValue === value;

	const handleClick = () => {
		onValueChange?.(value);
		setOpen(false);
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
AsyncSelectItem.displayName = "AsyncSelectItem";

interface AsyncSelectEmptyProps {
	children?: React.ReactNode;
	className?: string;
}

function AsyncSelectEmpty({ children, className }: AsyncSelectEmptyProps) {
	const { items, isLoading } = useAsyncSelect();

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
AsyncSelectEmpty.displayName = "AsyncSelectEmpty";

export {
	AsyncSelect,
	AsyncSelectTrigger,
	AsyncSelectContent,
	AsyncSelectSearchInput,
	AsyncSelectList,
	AsyncSelectItem,
	AsyncSelectEmpty,
};
