import { format, isValid, parseISO, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
	startDate?: string;
	endDate?: string;
	onStartDateChange?: (value: string | undefined) => void;
	onEndDateChange?: (value: string | undefined) => void;
	disabled?: boolean;
	id?: string;
	className?: string;
	min?: string;
}

export function DateRangePicker({
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
	disabled,
	id,
	className,
	min,
}: DateRangePickerProps) {
	const [open, setOpen] = React.useState(false);

	// Converter valores para Date
	const selectedStartDate = React.useMemo(() => {
		if (!startDate) return undefined;
		try {
			// Lidar com diferentes formatos: Y-m-d H:i:s, Y-m-dTH:i:s, ou Y-m-d
			let dateStr = startDate;
			if (dateStr.includes(" ")) {
				// Formato Y-m-d H:i:s -> converter para ISO
				dateStr = dateStr.replace(" ", "T");
			} else if (!dateStr.includes("T") && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
				// Formato Y-m-d apenas -> adicionar hora
				dateStr = `${dateStr}T00:00:00`;
			}
			const d = parseISO(dateStr);
			return isValid(d) ? d : undefined;
		} catch {
			return undefined;
		}
	}, [startDate]);

	const selectedEndDate = React.useMemo(() => {
		if (!endDate) return undefined;
		try {
			// Lidar com diferentes formatos: Y-m-d H:i:s, Y-m-dTH:i:s, ou Y-m-d
			let dateStr = endDate;
			if (dateStr.includes(" ")) {
				// Formato Y-m-d H:i:s -> converter para ISO
				dateStr = dateStr.replace(" ", "T");
			} else if (!dateStr.includes("T") && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
				// Formato Y-m-d apenas -> adicionar hora
				dateStr = `${dateStr}T00:00:00`;
			}
			const d = parseISO(dateStr);
			return isValid(d) ? d : undefined;
		} catch {
			return undefined;
		}
	}, [endDate]);

	const minDate = React.useMemo(() => {
		if (!min) return new Date();
		try {
			const d = parseISO(min);
			return isValid(d) ? d : new Date();
		} catch {
			return new Date();
		}
	}, [min]);

	const [range, setRange] = React.useState<DateRange | undefined>(() => {
		if (selectedStartDate && selectedEndDate) {
			return {
				from: selectedStartDate,
				to: selectedEndDate,
			};
		}
		if (selectedStartDate) {
			return {
				from: selectedStartDate,
				to: undefined,
			};
		}
		return undefined;
	});

	React.useEffect(() => {
		if (selectedStartDate && selectedEndDate) {
			setRange({
				from: selectedStartDate,
				to: selectedEndDate,
			});
		} else if (selectedStartDate) {
			setRange({
				from: selectedStartDate,
				to: undefined,
			});
		} else {
			setRange(undefined);
		}
	}, [selectedStartDate, selectedEndDate]);

	const handleRangeSelect = (selectedRange: DateRange | undefined) => {
		if (disabled) return;

		setRange(selectedRange);

		if (selectedRange?.from) {
			const fromDate = startOfDay(selectedRange.from);
			// Verificar se a data é válida (não passou do minDate)
			if (minDate && isBefore(fromDate, startOfDay(minDate))) {
				const validDate = startOfDay(minDate);
				// Formatar como Y-m-d H:i:s (00:00:00 para início do dia)
				onStartDateChange?.(
					format(validDate, "yyyy-MM-dd") + " 00:00:00",
				);
			} else {
				// Formatar como Y-m-d H:i:s (00:00:00 para início do dia)
				onStartDateChange?.(
					format(fromDate, "yyyy-MM-dd") + " 00:00:00",
				);
			}
		} else {
			onStartDateChange?.(undefined);
		}

		if (selectedRange?.to) {
			const toDate = startOfDay(selectedRange.to);
			// Verificar se a data é válida (não passou do minDate)
			if (minDate && isBefore(toDate, startOfDay(minDate))) {
				const validDate = startOfDay(minDate);
				// Formatar como Y-m-d H:i:s (23:59:59 para fim do dia)
				onEndDateChange?.(
					format(validDate, "yyyy-MM-dd") + " 23:59:59",
				);
			} else {
				// Formatar como Y-m-d H:i:s (23:59:59 para fim do dia)
				onEndDateChange?.(
					format(toDate, "yyyy-MM-dd") + " 23:59:59",
				);
			}
		} else {
			onEndDateChange?.(undefined);
		}
	};

	const displayText = React.useMemo(() => {
		if (selectedStartDate && selectedEndDate) {
			return `${format(selectedStartDate, "dd/MM/yyyy", { locale: ptBR })} - ${format(selectedEndDate, "dd/MM/yyyy", { locale: ptBR })}`;
		}
		if (selectedStartDate) {
			return `A partir de ${format(selectedStartDate, "dd/MM/yyyy", { locale: ptBR })}`;
		}
		return "Selecione o período";
	}, [selectedStartDate, selectedEndDate]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"w-full justify-start text-left font-normal",
						!startDate && !endDate && "text-muted-foreground",
						className,
					)}
					disabled={disabled}
					id={id}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{displayText}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="range"
					selected={range}
					onSelect={handleRangeSelect}
					disabled={(date: Date) => {
						if (!date) return false;
						const dateOnly = startOfDay(date);
						const minDateOnly = startOfDay(minDate);
						return isBefore(dateOnly, minDateOnly);
					}}
					locale={ptBR}
					autoFocus
					numberOfMonths={2}
				/>
			</PopoverContent>
		</Popover>
	);
}
