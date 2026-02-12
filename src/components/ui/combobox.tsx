import { CheckIcon, ChevronsUpDownIcon, SearchIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface ComboboxContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
	value?: string;
	onSelect?: (value: string) => void;
	search: string;
	setSearch: (search: string) => void;
	items: Array<{
		id: string;
		label: string;
		value: string;
		customComponent?: React.ReactNode;
	}>;
	isLoading?: boolean;
	triggerRef?: React.RefObject<HTMLButtonElement | null>;
	disabled?: boolean;
}

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

const useCombobox = () => {
	const context = React.useContext(ComboboxContext);
	if (!context) {
		throw new Error("Combobox components must be used within <Combobox>");
	}
	return context;
};

interface ComboboxProps {
	items: Array<{
		id: string;
		label: string;
		value: string;
		customComponent?: React.ReactNode;
	}>;
	value?: string;
	onSelect?: (value: string) => void;
	onSearchChange?: (search: string) => void;
	isLoading?: boolean;
	disabled?: boolean;
	children: React.ReactNode;
}

export function Combobox({
	items,
	value,
	onSelect,
	onSearchChange,
	isLoading = false,
	disabled = false,
	children,
}: ComboboxProps) {
	const [open, setOpen] = React.useState(false);
	const [search, setSearch] = React.useState("");
	const triggerRef = React.useRef<HTMLButtonElement>(null);

	const handleSearchChange = (newSearch: string) => {
		setSearch(newSearch);
		onSearchChange?.(newSearch);
	};

	const handleSelect = (itemValue: string) => {
		onSelect?.(itemValue);
		setOpen(false);
		setSearch("");
		onSearchChange?.("");
	};

	const contextValue: ComboboxContextValue = {
		open,
		setOpen: (isOpen) => {
			setOpen(isOpen);
			if (!isOpen) {
				setSearch("");
				onSearchChange?.("");
			}
		},
		value,
		onSelect: handleSelect,
		search,
		setSearch: handleSearchChange,
		items,
		isLoading,
		triggerRef,
		disabled,
	};

	return (
		<ComboboxContext.Provider value={contextValue}>
			<Popover open={open} onOpenChange={setOpen}>
				{children}
			</Popover>
		</ComboboxContext.Provider>
	);
}

interface ComboboxInputProps extends React.ComponentProps<typeof Input> {
	placeholder?: string;
}

export function ComboboxInput({
	placeholder,
	className,
	...props
}: ComboboxInputProps) {
	const { search, setSearch } = useCombobox();

	return (
		<div className="flex items-center border-b px-3">
			<SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
			<Input
				placeholder={placeholder || "Buscar..."}
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className={cn("border-0 focus-visible:ring-0", className)}
				{...props}
			/>
		</div>
	);
}

interface ComboboxContentProps
	extends React.ComponentProps<typeof PopoverContent> {
	children: React.ReactNode;
}

export function ComboboxContent({
	children,
	className,
	...props
}: ComboboxContentProps) {
	const { triggerRef, open } = useCombobox();
	const [triggerWidth, setTriggerWidth] = React.useState<number | undefined>(
		undefined,
	);

	React.useEffect(() => {
		if (open && triggerRef?.current) {
			// Medir a largura quando o popover abrir
			const updateWidth = () => {
				if (triggerRef.current) {
					setTriggerWidth(triggerRef.current.offsetWidth);
				}
			};
			// Pequeno delay para garantir que o elemento está renderizado
			const timeoutId = setTimeout(updateWidth, 0);
			// Atualizar quando a janela redimensionar
			window.addEventListener("resize", updateWidth);
			return () => {
				clearTimeout(timeoutId);
				window.removeEventListener("resize", updateWidth);
			};
		}
	}, [open, triggerRef]);

	return (
		<PopoverContent
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
}

interface ComboboxListProps {
	children: (item: {
		id: string;
		label: string;
		value: string;
		customComponent?: React.ReactNode;
	}) => React.ReactNode;
	className?: string;
}

export function ComboboxList({ children, className }: ComboboxListProps) {
	const { items, isLoading } = useCombobox();

	if (isLoading) {
		return (
			<div className="p-4 flex items-center justify-center">
				<Spinner />
			</div>
		);
	}

	if (items.length === 0) {
		return null; // ComboboxEmpty will handle this
	}

	return (
		<ScrollArea className={cn("max-h-[300px]", className)}>
			<div className="p-1">
				{items.map((item) => (
					<React.Fragment key={item.id}>{children(item)}</React.Fragment>
				))}
			</div>
		</ScrollArea>
	);
}

interface ComboboxItemProps {
	value: string;
	children: React.ReactNode;
	className?: string;
}

export function ComboboxItem({
	value,
	children,
	className,
}: ComboboxItemProps) {
	const { value: selectedValue, onSelect } = useCombobox();

	const handleClick = () => {
		onSelect?.(value);
	};

	return (
		<Button
			variant="ghost"
			className={cn(
				"w-full justify-start font-normal",
				selectedValue === value && "bg-accent",
				className,
			)}
			onClick={handleClick}
		>
			<CheckIcon
				className={cn(
					"mr-2 h-4 w-4",
					selectedValue === value ? "opacity-100" : "opacity-0",
				)}
			/>
			{children}
		</Button>
	);
}

interface ComboboxEmptyProps {
	children?: React.ReactNode;
	className?: string;
}

export function ComboboxEmpty({ children, className }: ComboboxEmptyProps) {
	const { items, isLoading } = useCombobox();

	if (isLoading || items.length > 0) {
		return null;
	}

	return (
		<div
			className={cn("p-4 text-center text-sm text-muted-foreground", className)}
		>
			{children || "Nenhum item encontrado"}
		</div>
	);
}

// Trigger component (button that opens the combobox)
interface ComboboxTriggerProps extends React.ComponentProps<typeof Button> {
	selectItemMsg?: string;
	children?: React.ReactNode;
	disabled?: boolean;
}

export function ComboboxTrigger({
	selectItemMsg = "Selecionar item",
	children,
	className,
	...props
}: ComboboxTriggerProps) {
	const { value, items, open, triggerRef, disabled } = useCombobox();

	const selectedItem = React.useMemo(
		() => items.find((item) => item.value === value),
		[items, value],
	);

	return (
		<PopoverTrigger asChild>
			<Button
				ref={triggerRef}
				variant="outline"
				role="combobox"
				aria-expanded={open}
				className={cn("w-full justify-between", className)}
				disabled={disabled}
				{...props}
			>
				{children ||
					(selectedItem ? (
						selectedItem.label
					) : (
						<span className="text-muted-foreground">{selectItemMsg}</span>
					))}
				<ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</PopoverTrigger>
	);
}
