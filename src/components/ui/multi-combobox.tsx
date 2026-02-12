import { Command as CommandPrimitive } from "cmdk";
import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";

export type ComboBoxItemType<TItem, TValue> = {
	id: TItem;
	value: TValue;
	label: string;
	customComponent?: React.ReactNode;
};

type MultiComboboxProps<TItem extends React.Key = React.Key, TValue = TItem> = {
	value?: TValue[];
	onValueChange?: (values: TValue[]) => void;
	items: ComboBoxItemType<TItem, TValue>[];
	initialSelectedItems?: ComboBoxItemType<TItem, TValue>[];
	searchPlaceholder?: string;
	noResultsMsg?: string;
	selectItemMsg?: string;
	className?: string;
	onSearchChange?: (e: string) => void;
	isLoading?: boolean;
	onAction?: (inputValue: string) => void;
	disabled?: boolean;
};

const MultiCombobox = <TItem extends React.Key, TValue = TItem>({
	value = [],
	onValueChange,
	items = [],
	initialSelectedItems = [],
	searchPlaceholder = "Pesquisar item...",
	noResultsMsg = "Nenhum item encontrado",
	selectItemMsg = "Selecione itens...",
	className,
	onSearchChange,
	isLoading = false,
	onAction,
	disabled = false,
}: MultiComboboxProps<TItem, TValue>) => {
	const [open, setOpen] = React.useState(false);
	const [localSearchValue, setLocalSearchValue] = React.useState("");
	const [selectedItemsMap, setSelectedItemsMap] = React.useState<
		Map<TValue, ComboBoxItemType<TItem, TValue>>
	>(new Map());
	const initializedRef = React.useRef(false);
	const triggerRef = React.useRef<HTMLButtonElement>(null);
	const [triggerWidth, setTriggerWidth] = React.useState<number | undefined>(
		undefined,
	);

	React.useEffect(() => {
		if (!initializedRef.current && initialSelectedItems.length > 0) {
			const newMap = new Map<TValue, ComboBoxItemType<TItem, TValue>>();
			initialSelectedItems.forEach((item) => {
				if (value.includes(item.value)) {
					newMap.set(item.value, item);
				}
			});

			setSelectedItemsMap((prevMap) => {
				const combinedMap = new Map(prevMap);
				newMap.forEach((itemValue, key) => {
					combinedMap.set(key, itemValue);
				});
				return combinedMap;
			});

			initializedRef.current = true;
		}
	}, [initialSelectedItems, value]);

	React.useEffect(() => {
		const itemsMap = new Map();
		items.forEach((item) => {
			itemsMap.set(item.value, item);
		});

		setSelectedItemsMap((prevMap) => {
			const newSelectedItemsMap = new Map(prevMap);

			value.forEach((val) => {
				if (itemsMap.has(val) && !newSelectedItemsMap.has(val)) {
					newSelectedItemsMap.set(val, itemsMap.get(val));
				}
			});

			for (const key of newSelectedItemsMap.keys()) {
				if (!value.includes(key)) {
					newSelectedItemsMap.delete(key);
				}
			}

			return newSelectedItemsMap;
		});
	}, [value, items]);

	const selectedItems = React.useMemo(() => {
		return Array.from(selectedItemsMap.values());
	}, [selectedItemsMap]);

	const handleOnSearchChange = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const searchValue = event.target.value;
			setLocalSearchValue(searchValue);
			if (onSearchChange) {
				onSearchChange(searchValue);
			}
		},
		[onSearchChange],
	);

	const handleCreate = React.useCallback(() => {
		if (onAction) {
			onAction(localSearchValue);
			setOpen(false);
		}
	}, [onAction, localSearchValue]);

	const toggleOption = React.useCallback(
		(item: ComboBoxItemType<TItem, TValue>) => {
			if (disabled) return;

			const isSelected = value.includes(item.value);
			let newValues: TValue[];

			if (isSelected) {
				newValues = value.filter((v) => v !== item.value);
			} else {
				newValues = [...value, item.value];
			}

			onValueChange?.(newValues);
		},
		[value, onValueChange, disabled],
	);

	const filteredItems = React.useMemo(() => {
		const searchLower = localSearchValue.toLowerCase();
		return items.filter((item) =>
			item.label.toLowerCase().includes(searchLower),
		);
	}, [items, localSearchValue]);

	// Medir a largura do trigger quando o popover abrir
	React.useEffect(() => {
		if (open) {
			const updateWidth = () => {
				if (triggerRef.current) {
					const width = triggerRef.current.offsetWidth;
					setTriggerWidth(width);
				}
			};
			// Tentar medir imediatamente, depois com delay para garantir
			if (triggerRef.current) {
				updateWidth();
			}
			const timeoutId = setTimeout(updateWidth, 0);
			// Atualizar quando a janela redimensionar
			window.addEventListener("resize", updateWidth);
			return () => {
				clearTimeout(timeoutId);
				window.removeEventListener("resize", updateWidth);
			};
		}
	}, [open]);

	return (
		<div className={cn("w-full", className)}>
			<Popover open={open} onOpenChange={setOpen} modal={true}>
				<PopoverTrigger asChild>
					<Button
						ref={triggerRef}
						type="button"
						variant="outline"
						role="combobox"
						aria-expanded={open}
						disabled={disabled}
						className={cn(
							"flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
							disabled && "opacity-50 cursor-not-allowed",
						)}
					>
						{selectedItems.length > 0 ? (
							<span className="flex-1 truncate text-left">
								{selectedItems.length} item
								{selectedItems.length !== 1 ? "s" : ""} selecionado
								{selectedItems.length !== 1 ? "s" : ""}
							</span>
						) : (
							<span className="flex-1 truncate text-muted-foreground">
								{selectItemMsg}
							</span>
						)}
						<ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="p-0 w-auto!"
					align="start"
					style={(() => {
						// Calcular largura: usar triggerWidth se disponível, senão medir diretamente do ref
						const width = triggerWidth || triggerRef.current?.offsetWidth;
						return width
							? {
									width: `${width}px`,
									minWidth: `${width}px`,
									maxWidth: `${width}px`,
								}
							: undefined;
					})()}
				>
					<CommandPrimitive>
						<div className="space-y-1 pt-1">
							<div className="flex items-center justify-between space-x-2 px-3 py-2">
								<div className="flex items-center space-x-1 flex-1">
									<SearchIcon className="size-4" />
									<Input
										className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
										placeholder={searchPlaceholder}
										value={localSearchValue}
										onChange={handleOnSearchChange}
									/>
								</div>
								<button
									type="button"
									className="pr-2"
									onClick={() =>
										handleOnSearchChange({
											target: { value: "" },
										} as React.ChangeEvent<HTMLInputElement>)
									}
								>
									<XIcon className="size-4" />
								</button>
							</div>
							<CommandList asChild>
								<ScrollArea className="max-h-[300px]">
									{isLoading ? (
										<CommandPrimitive.Loading>
											<div className="py-6 flex justify-center">
												<Spinner />
											</div>
										</CommandPrimitive.Loading>
									) : null}
									<CommandGroup>
										{filteredItems.map((item) => (
											<CommandItem
												value={String(item.value)}
												key={item.id}
												onSelect={() => toggleOption(item)}
											>
												<CheckIcon
													className={cn(
														"mr-2 h-4 w-4",
														value.includes(item.value)
															? "opacity-100"
															: "opacity-0",
													)}
												/>
												{item.customComponent || item.label}
											</CommandItem>
										))}
									</CommandGroup>
									{!isLoading && filteredItems.length === 0 && (
										<CommandEmpty className="rounded-sm px-2 py-3 text-center text-xs">
											{noResultsMsg}
											{!!onAction && !!localSearchValue && (
												<>
													,&nbsp;
													<Button
														type="button"
														variant="link"
														onMouseDown={(e) => {
															e.preventDefault();
															handleCreate();
														}}
														className="p-0 text-xs"
													>
														criar &quot;{localSearchValue}&quot;
													</Button>
												</>
											)}
										</CommandEmpty>
									)}
								</ScrollArea>
							</CommandList>
						</div>
					</CommandPrimitive>
				</PopoverContent>
			</Popover>
			{selectedItems.length > 0 && (
				<div className="flex flex-wrap gap-1 mt-2">
					{selectedItems.map((item) => (
						<Badge
							key={String(item.id)}
							variant="secondary"
							className="transition ease-in-out"
						>
							<span className="max-w-32 truncate">{item.label}</span>
							<button
								type="button"
								className="ml-1"
								onClick={(event) => {
									event.stopPropagation();
									toggleOption(item);
								}}
							>
								<XIcon className="size-3" />
							</button>
						</Badge>
					))}
				</div>
			)}
		</div>
	);
};

MultiCombobox.displayName = "MultiCombobox";
export { MultiCombobox };
