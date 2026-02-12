import type { Locale } from "date-fns";
import { format as formatFn, isDate, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

type KnownDateFormat =
	| "dd/MM/yyyy"
	| "yyyy-MM-dd"
	| "dd/MM/yyyy HH:mm"
	| "yyyy-MM-dd HH:mm:ss"
	| "dd MMMM yyyy"
	| "dd MMM yyyy"
	| "HH:mm"
	| "HH:mm:ss";

interface FormatDateOptions<T extends string = KnownDateFormat> {
	formatStr?: T;
	locale?: Locale;
}

export function formatDate<T extends string>(
	date: Date | string | number,
	{ formatStr = "dd MMM yyyy" as T, locale = ptBR }: FormatDateOptions<T> = {},
): string {
	try {
		const validDate = isDate(date) ? date : parseISO(String(date));
		return formatFn(validDate, formatStr, { locale });
	} catch (error) {
		console.error("Invalid date or format:", error);
		return "";
	}
}
