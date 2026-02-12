import { format, isBefore, isValid, parseISO, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, ClockIcon } from "lucide-react";
import * as React from "react";
import { withMask } from "use-mask-input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

function normalizeMinMaxTime(time: string, fallback: string): string {
	try {
		const [hours, minutes] = time.split(":").map(Number);
		if (
			Number.isNaN(hours) ||
			Number.isNaN(minutes) ||
			hours < 0 ||
			hours > 23 ||
			minutes < 0 ||
			minutes > 59
		) {
			return fallback;
		}
		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
	} catch {
		return fallback;
	}
}

function parseTimeToMinutes(time: string): number {
	const [hours, minutes] = time.split(":").map(Number);
	if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;
	return hours * 60 + minutes;
}

function buildTimeSlots(minTime: string, maxTime: string): string[] {
	const slots: string[] = [];
	const minTotalMinutes = parseTimeToMinutes(minTime);
	const maxTotalMinutes = parseTimeToMinutes(maxTime);

	for (let i = 0; i < 96; i++) {
		const hour = Math.floor(i / 4);
		const minute = (i % 4) * 15;
		const totalMinutes = hour * 60 + minute;

		if (totalMinutes >= minTotalMinutes && totalMinutes <= maxTotalMinutes) {
			slots.push(
				`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
			);
		}
	}
	return slots;
}

function parseDateInput(value: string): Date | undefined {
	if (!value || value.length < 10) return undefined;
	const trimmed = value.replace(/\D/g, "");
	if (trimmed.length < 8) return undefined;
	const day = parseInt(trimmed.slice(0, 2), 10);
	const month = parseInt(trimmed.slice(2, 4), 10) - 1;
	const year = parseInt(trimmed.slice(4, 8), 10);
	const d = new Date(year, month, day);
	return isValid(d) ? d : undefined;
}

function formatDateForInput(date: Date): string {
	return format(date, "dd/MM/yyyy", { locale: ptBR });
}

interface DateTimePickerContextValue {
	value: string | undefined;
	onChange: ((value: string) => void) | undefined;
	disabled: boolean;
	id: string | undefined;
	className: string | undefined;
	min: string | undefined;
	minTime: string;
	maxTime: string;
	placeholder: string;
	open: boolean;
	setOpen: (open: boolean) => void;
	dateOpen: boolean;
	setDateOpen: (open: boolean) => void;
	timeOpen: boolean;
	setTimeOpen: (open: boolean) => void;
	date: Date | undefined;
	time: string;
	displayMonth: Date;
	setDisplayMonth: (date: Date) => void;
	minDate: Date;
	normalizedMinTime: string;
	normalizedMaxTime: string;
	timeSlots: string[];
	handleDateSelect: (selectedDate: Date | undefined) => void;
	handleTimeSelect: (timeValue: string) => void;
	updateFromDateAndTime: (date: Date | undefined, time: string) => void;
}

const DateTimePickerContext =
	React.createContext<DateTimePickerContextValue | null>(null);

function useDateTimePicker() {
	const ctx = React.useContext(DateTimePickerContext);
	if (!ctx) {
		throw new Error(
			"DateTimePicker components must be used within <DateTimePicker>",
		);
	}
	return ctx;
}

export interface DateTimePickerProps {
	value?: string;
	onChange?: (value: string) => void;
	disabled?: boolean;
	id?: string;
	className?: string;
	min?: string;
	minTime?: string;
	maxTime?: string;
	placeholder?: string;
	children?: React.ReactNode;
}

function DateTimePicker({
	value,
	onChange,
	disabled = false,
	id,
	className,
	min,
	minTime = "00:00",
	maxTime = "23:59",
	placeholder = "Selecione data e hora",
	children,
}: DateTimePickerProps) {
	const [open, setOpen] = React.useState(false);
	const [dateOpen, setDateOpen] = React.useState(false);
	const [timeOpen, setTimeOpen] = React.useState(false);

	const selectedDate = React.useMemo(() => {
		if (!value) return undefined;
		try {
			const d = parseISO(value);
			return isValid(d) ? d : undefined;
		} catch {
			return undefined;
		}
	}, [value]);

	const selectedTime = React.useMemo(() => {
		if (!value) return "00:00";
		try {
			const d = parseISO(value);
			return isValid(d) ? format(d, "HH:mm") : "00:00";
		} catch {
			return "00:00";
		}
	}, [value]);

	const minDate = React.useMemo(() => {
		if (!min) return new Date();
		try {
			const d = parseISO(min);
			return isValid(d) ? d : new Date();
		} catch {
			return new Date();
		}
	}, [min]);

	const [date, setDate] = React.useState<Date | undefined>(selectedDate);
	const [time, setTime] = React.useState<string>(selectedTime);
	const [displayMonth, setDisplayMonth] = React.useState<Date>(
		() => date ?? new Date(),
	);

	React.useEffect(() => {
		if (open || dateOpen) {
			setDisplayMonth(date ?? new Date());
		}
	}, [open, dateOpen, date]);

	React.useEffect(() => {
		if (value) {
			try {
				const d = parseISO(value);
				if (isValid(d)) {
					setDate(d);
					setTime(format(d, "HH:mm"));
				}
			} catch {
				// ignore
			}
		} else {
			setDate(undefined);
			setTime("00:00");
		}
	}, [value]);

	const normalizedMinTime = React.useMemo(
		() => normalizeMinMaxTime(minTime, "00:00"),
		[minTime],
	);
	const normalizedMaxTime = React.useMemo(
		() => normalizeMinMaxTime(maxTime, "23:59"),
		[maxTime],
	);
	const timeSlots = React.useMemo(
		() => buildTimeSlots(normalizedMinTime, normalizedMaxTime),
		[normalizedMinTime, normalizedMaxTime],
	);

	const updateFromDateAndTime = React.useCallback(
		(newDate: Date | undefined, newTime: string) => {
			setDate(newDate);
			setTime(newTime);
			if (newDate) {
				const [hours, minutes] = newTime.split(":").map(Number);
				const combined = new Date(newDate);
				combined.setHours(hours, minutes, 0, 0);
				if (minDate && isBefore(combined, minDate)) {
					const minDateTime = new Date(minDate);
					setDate(minDateTime);
					setTime(format(minDateTime, "HH:mm"));
					onChange?.(minDateTime.toISOString());
				} else {
					onChange?.(combined.toISOString());
				}
			} else {
				onChange?.("");
			}
		},
		[minDate, onChange],
	);

	const handleDateSelect = React.useCallback(
		(selectedDate: Date | undefined) => {
			if (!selectedDate || disabled) return;

			const [hours, minutes] = time.split(":").map(Number);
			const newDate = new Date(selectedDate);
			newDate.setHours(hours, minutes, 0, 0);

			if (minDate && isBefore(newDate, minDate)) {
				const minDateTime = new Date(minDate);
				minDateTime.setHours(hours, minutes, 0, 0);
				if (isBefore(minDateTime, minDate)) {
					setDate(minDate);
					setTime(format(minDate, "HH:mm"));
					onChange?.(minDate.toISOString());
					setDateOpen(false);
					return;
				}
				newDate.setTime(minDateTime.getTime());
			}

			setDate(newDate);
			onChange?.(newDate.toISOString());
			setDateOpen(false);
		},
		[disabled, minDate, onChange, time],
	);

	const handleTimeSelect = React.useCallback(
		(timeValue: string) => {
			if (disabled) return;

			setTime(timeValue);

			if (date) {
				const [hours, minutes] = timeValue.split(":").map(Number);
				const newDate = new Date(date);
				newDate.setHours(hours, minutes, 0, 0);

				if (minDate && isBefore(newDate, minDate)) {
					const minDateTime = new Date(minDate);
					setDate(minDateTime);
					setTime(format(minDateTime, "HH:mm"));
					onChange?.(minDateTime.toISOString());
					setOpen(false);
					setTimeOpen(false);
					return;
				}

				setDate(newDate);
				onChange?.(newDate.toISOString());
			}
			setOpen(false);
			setTimeOpen(false);
		},
		[date, disabled, minDate, onChange],
	);

	const contextValue: DateTimePickerContextValue = {
		value,
		onChange,
		disabled,
		id,
		className,
		min,
		minTime,
		maxTime,
		placeholder,
		open,
		setOpen,
		dateOpen,
		setDateOpen,
		timeOpen,
		setTimeOpen,
		date,
		time,
		displayMonth,
		setDisplayMonth,
		minDate,
		normalizedMinTime,
		normalizedMaxTime,
		timeSlots,
		handleDateSelect,
		handleTimeSelect,
		updateFromDateAndTime,
	};

	const defaultChildren = (
		<>
			<DateTimePickerDefaultTrigger />
			<DateTimePickerContent />
		</>
	);

	const hasInputGroup = React.Children.toArray(
		children ?? defaultChildren,
	).some((c) => React.isValidElement(c) && c.type === DateTimePickerInputGroup);

	return (
		<DateTimePickerContext.Provider value={contextValue}>
			{hasInputGroup ? (
				children
			) : (
				<Popover open={open} onOpenChange={setOpen}>
					{children ?? defaultChildren}
				</Popover>
			)}
		</DateTimePickerContext.Provider>
	);
}
DateTimePicker.displayName = "DateTimePicker";

const DateTimePickerDefaultTrigger = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<typeof Button>
>(({ className: classNameProp, id: idProp, ...props }, ref) => {
	const {
		value,
		date,
		placeholder,
		disabled,
		id: idFromContext,
		className: classNameFromContext,
	} = useDateTimePicker();
	const resolvedId = idProp ?? idFromContext;
	const resolvedClassName = cn(classNameProp, classNameFromContext);

	return (
		<PopoverTrigger asChild>
			<Button
				ref={ref}
				variant="outline"
				className={cn(
					"w-full justify-start text-left font-normal",
					!value && "text-muted-foreground",
					resolvedClassName,
				)}
				disabled={disabled}
				id={resolvedId}
				type="button"
				{...props}
			>
				{value && date ? (
					format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
				) : (
					<span className="text-muted-foreground">{placeholder}</span>
				)}
				<CalendarIcon className="ml-auto" />
			</Button>
		</PopoverTrigger>
	);
});
DateTimePickerDefaultTrigger.displayName = "DateTimePickerDefaultTrigger";

const DateTimePickerInputGroup = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
	return (
		<div
			ref={ref}
			className={cn("flex flex-row items-center gap-2", className)}
			{...props}
		>
			{children}
		</div>
	);
});
DateTimePickerInputGroup.displayName = "DateTimePickerInputGroup";

const DateTimePickerDateInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentProps<"input"> & { placeholder?: string }
>(
	(
		{ className, placeholder = "dd/mm/aaaa", onChange, onBlur, ...props },
		ref,
	) => {
		const {
			date,
			time,
			disabled,
			dateOpen,
			setDateOpen,
			updateFromDateAndTime,
			minDate,
			displayMonth,
			setDisplayMonth,
			handleDateSelect,
		} = useDateTimePicker();
		const [inputValue, setInputValue] = React.useState(() =>
			date ? formatDateForInput(date) : "",
		);

		React.useEffect(() => {
			setInputValue(date ? formatDateForInput(date) : "");
		}, [date]);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const v = e.target.value;
			setInputValue(v);
			onChange?.(e);
		};

		const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
			onBlur?.(e);
			const parsed = parseDateInput(inputValue);
			if (parsed) {
				if (minDate && isBefore(startOfDay(parsed), startOfDay(minDate))) {
					updateFromDateAndTime(minDate, time);
				} else {
					updateFromDateAndTime(parsed, time);
				}
			} else if (inputValue.trim() === "") {
				updateFromDateAndTime(undefined, "00:00");
			}
		};

		const maskRef = React.useCallback(
			(el: HTMLInputElement | null) => {
				if (typeof ref === "function") ref(el);
				else if (ref) ref.current = el;
				if (el) withMask("99/99/9999", { showMaskOnHover: true })(el);
			},
			[ref],
		);

		return (
			<Popover open={dateOpen} onOpenChange={setDateOpen} modal={false}>
				<div className="relative flex flex-1 min-w-0">
					<Input
						ref={maskRef}
						type="text"
						inputMode="numeric"
						placeholder={placeholder}
						value={inputValue}
						onChange={handleChange}
						onBlur={handleBlur}
						disabled={disabled}
						className={cn("flex-1 min-w-0", className)}
						{...props}
					/>
					<PopoverTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="absolute right-0 top-0 h-full px-2 shrink-0 hover:bg-transparent"
							disabled={disabled}
							onClick={() => setDateOpen(true)}
							aria-label="Abrir calendário"
						>
							<CalendarIcon className="size-4" />
						</Button>
					</PopoverTrigger>
				</div>
				<PopoverContent className="w-auto p-0" align="end">
					<Calendar
						mode="single"
						month={displayMonth}
						onMonthChange={setDisplayMonth}
						selected={date}
						onSelect={handleDateSelect}
						disabled={(d: Date) => {
							if (!d) return false;
							const dateOnly = startOfDay(d);
							const minDateOnly = startOfDay(minDate);
							return isBefore(dateOnly, minDateOnly);
						}}
						locale={ptBR}
						autoFocus
					/>
				</PopoverContent>
			</Popover>
		);
	},
);
DateTimePickerDateInput.displayName = "DateTimePickerDateInput";

const DateTimePickerTimeInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentProps<"input"> & { placeholder?: string }
>(({ className, placeholder = "HH:mm", onChange, onBlur, ...props }, ref) => {
	const {
		date,
		time,
		disabled,
		timeOpen,
		setTimeOpen,
		updateFromDateAndTime,
		minDate,
		normalizedMinTime,
		normalizedMaxTime,
		timeSlots,
		handleTimeSelect,
	} = useDateTimePicker();
	const [inputValue, setInputValue] = React.useState(time);

	React.useEffect(() => {
		setInputValue(time);
	}, [time]);

	const parseTimeInput = (v: string): string | undefined => {
		const match = v.match(/^(\d{1,2}):?(\d{2})$/);
		if (!match) return undefined;
		const h = Math.min(23, Math.max(0, parseInt(match[1], 10)));
		const m = Math.min(59, Math.max(0, parseInt(match[2], 10)));
		return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const v = e.target.value;
		setInputValue(v);
		onChange?.(e);
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		onBlur?.(e);
		const parsed = parseTimeInput(inputValue);
		if (parsed && date) {
			const [hours, minutes] = parsed.split(":").map(Number);
			const combined = new Date(date);
			combined.setHours(hours, minutes, 0, 0);

			if (minDate && isBefore(combined, minDate)) {
				updateFromDateAndTime(minDate, format(minDate, "HH:mm"));
			} else {
				const slotMins = hours * 60 + minutes;
				const minMins = parseTimeToMinutes(normalizedMinTime);
				const maxMins = parseTimeToMinutes(normalizedMaxTime);
				if (slotMins < minMins) {
					updateFromDateAndTime(date, normalizedMinTime);
				} else if (slotMins > maxMins) {
					updateFromDateAndTime(date, normalizedMaxTime);
				} else {
					updateFromDateAndTime(date, parsed);
				}
			}
		}
	};

	const maskRef = React.useCallback(
		(el: HTMLInputElement | null) => {
			if (typeof ref === "function") ref(el);
			else if (ref) ref.current = el;
			if (el) withMask("99:99", { showMaskOnHover: true })(el);
		},
		[ref],
	);

	return (
		<Popover open={timeOpen} onOpenChange={setTimeOpen} modal={false}>
			<div className="relative flex w-fit gap-2">
				<Input
					ref={maskRef}
					type="text"
					inputMode="numeric"
					placeholder={placeholder}
					value={inputValue}
					onChange={handleChange}
					onBlur={handleBlur}
					disabled={disabled}
					className={cn("w-full max-w-24", className)}
					{...props}
				/>
				<PopoverTrigger asChild>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="absolute right-0 top-0 h-full px-2 shrink-0 hover:bg-transparent"
						disabled={disabled}
						onClick={() => setTimeOpen(true)}
						aria-label="Abrir seletor de hora"
					>
						<ClockIcon className="size-4" />
					</Button>
				</PopoverTrigger>
			</div>
			<PopoverContent
				className="w-44 max-w-44 p-0 overflow-hidden"
				align="end"
				sideOffset={4}
				onInteractOutside={(e) => {
					const target = e.target as HTMLElement;
					if (target.closest("[data-radix-scroll-area-viewport]")) {
						e.preventDefault();
					}
				}}
			>
				<div className="flex flex-col max-h-[240px] min-h-0 overflow-hidden py-2">
					<DateTimePickerTimeList
						timeSlots={timeSlots}
						selectedTime={time}
						date={date}
						minDate={minDate}
						normalizedMinTime={normalizedMinTime}
						normalizedMaxTime={normalizedMaxTime}
						disabled={disabled}
						onTimeSelect={handleTimeSelect}
						standalone
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
});
DateTimePickerTimeInput.displayName = "DateTimePickerTimeInput";

const DateTimePickerContent = React.forwardRef<
	React.ElementRef<typeof PopoverContent>,
	React.ComponentPropsWithoutRef<typeof PopoverContent>
>(({ className, ...props }, ref) => {
	const {
		date,
		time,
		displayMonth,
		setDisplayMonth,
		minDate,
		normalizedMinTime,
		normalizedMaxTime,
		timeSlots,
		handleDateSelect,
		handleTimeSelect,
		disabled,
	} = useDateTimePicker();

	return (
		<PopoverContent
			ref={ref}
			className={cn("w-auto p-0", className)}
			align="start"
			onInteractOutside={(e) => {
				const target = e.target as HTMLElement;
				if (target.closest("[data-radix-scroll-area-viewport]")) {
					e.preventDefault();
				}
			}}
			{...props}
		>
			<div className="flex items-stretch">
				<div>
					<Calendar
						mode="single"
						month={displayMonth}
						onMonthChange={setDisplayMonth}
						selected={date}
						onSelect={handleDateSelect}
						disabled={(d: Date) => {
							if (!d) return false;
							const dateOnly = startOfDay(d);
							const minDateOnly = startOfDay(minDate);
							return isBefore(dateOnly, minDateOnly);
						}}
						locale={ptBR}
						autoFocus
					/>
				</div>
				<DateTimePickerTimeList
					timeSlots={timeSlots}
					selectedTime={time}
					date={date}
					minDate={minDate}
					normalizedMinTime={normalizedMinTime}
					normalizedMaxTime={normalizedMaxTime}
					disabled={disabled}
					onTimeSelect={handleTimeSelect}
				/>
			</div>
		</PopoverContent>
	);
});
DateTimePickerContent.displayName = "DateTimePickerContent";

interface DateTimePickerTimeListProps {
	timeSlots: string[];
	selectedTime: string;
	date: Date | undefined;
	minDate: Date;
	normalizedMinTime: string;
	normalizedMaxTime: string;
	disabled: boolean;
	onTimeSelect: (timeValue: string) => void;
	standalone?: boolean;
}

function DateTimePickerTimeList({
	timeSlots,
	selectedTime,
	date,
	minDate,
	normalizedMinTime,
	normalizedMaxTime,
	disabled,
	onTimeSelect,
	standalone = false,
}: DateTimePickerTimeListProps) {
	return (
		<div
			className={cn(
				"flex flex-col min-h-0",
				standalone ? "flex-1 min-h-0 px-2" : "my-4 mr-2 border-s border-input",
			)}
		>
			<ScrollArea
				className={cn(
					"scrollbar-hide",
					standalone
						? "h-[200px] w-full min-w-0 overflow-auto"
						: "flex-1 min-h-0",
				)}
				viewportClassName="scrollbar-hide"
				onWheel={(e) => e.stopPropagation()}
			>
				<div className="flex flex-wrap gap-1.5 px-2 py-2">
					{timeSlots.map((timeValue) => {
						const isSelected = selectedTime === timeValue;
						const [hours, minutes] = timeValue.split(":").map(Number);
						let isDisabled = false;

						if (date && minDate) {
							const slotDate = new Date(date);
							slotDate.setHours(hours, minutes, 0, 0);
							if (isBefore(slotDate, minDate)) {
								isDisabled = true;
							}
						}

						const slotTotalMinutes = hours * 60 + minutes;
						const [minHour, minMinute] = normalizedMinTime
							.split(":")
							.map(Number);
						const [maxHour, maxMinute] = normalizedMaxTime
							.split(":")
							.map(Number);
						const minTotalMinutes = minHour * 60 + minMinute;
						const maxTotalMinutes = maxHour * 60 + maxMinute;

						if (
							slotTotalMinutes < minTotalMinutes ||
							slotTotalMinutes > maxTotalMinutes
						) {
							isDisabled = true;
						}

						return (
							<Button
								key={timeValue}
								className={cn(
									"min-w-16 text-center px-2 py-1 font-mono text-xs",
									standalone && "shrink-0",
									!standalone && "w-full text-left justify-start",
									isSelected && "bg-primary text-primary-foreground",
								)}
								disabled={isDisabled || disabled}
								variant={isSelected ? "default" : "outline"}
								onClick={() => onTimeSelect(timeValue)}
								type="button"
							>
								{timeValue}
							</Button>
						);
					})}
				</div>
			</ScrollArea>
		</div>
	);
}

export {
	DateTimePicker,
	DateTimePickerDefaultTrigger,
	DateTimePickerInputGroup,
	DateTimePickerDateInput,
	DateTimePickerTimeInput,
	DateTimePickerContent,
	DateTimePickerTimeList,
};
