import { format, isValid } from "date-fns";
import { parsePhoneNumber } from "react-phone-number-input";

export function formatCPF(value: string): string {
	const cleaned = value.replace(/\D/g, "");
	if (cleaned.length <= 11) {
		return cleaned
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
	}
	return cleaned
		.slice(0, 11)
		.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function removeCPFMask(value: string): string {
	return value.replace(/\D/g, "");
}

const BR_DDI = "55";

export function formatPhone(value: string): string {
	const cleaned = value.replace(/\D/g, "");
	const len = cleaned.length;

	// Padrão internacional: DDI Brasil (55) + DDD + número
	if (len >= 12 && cleaned.startsWith(BR_DDI)) {
		const afterDdi = cleaned.slice(BR_DDI.length);
		const national = afterDdi.length > 11 ? afterDdi.slice(0, 11) : afterDdi;
		if (national.length <= 10) {
			return `+${BR_DDI} ${national.replace(/(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3")}`;
		}
		return `+${BR_DDI} ${national.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")}`;
	}

	// Padrão nacional: só DDD + número
	if (len <= 10) {
		return cleaned.replace(/(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
	}
	if (len <= 11) {
		return cleaned.replace(/(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
	}
	return cleaned.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

export function removePhoneMask(value: string): string {
	return value.replace(/\D/g, "");
}

/**
 * Converte número de telefone do formato E.164 (+5512999999999) para formato da API (5512999999999)
 * Remove o sinal de + e mantém apenas código do país + número nacional
 */
export function formatPhoneForAPI(phoneNumber: string | undefined): string {
	if (!phoneNumber) return "";
	const parsed = parsePhoneNumber(phoneNumber);
	if (parsed) {
		return `${parsed.countryCallingCode}${parsed.nationalNumber}`;
	}
	// Fallback: remover caracteres não numéricos (incluindo + e espaços)
	return phoneNumber.replace(/\D/g, "");
}

/**
 * Converte número de telefone do formato da API (5512999999999) para formato E.164 (+5512999999999)
 * Adiciona o sinal de + para compatibilidade com PhoneInput
 */
export function formatPhoneFromAPI(phoneNumber: string | undefined): string {
	if (!phoneNumber) return "";
	// Se já está no formato E.164, retornar como está
	if (phoneNumber.startsWith("+")) {
		return phoneNumber;
	}
	// Remover caracteres não numéricos para análise
	const cleaned = phoneNumber.replace(/\D/g, "");
	
	// Se começa com código do país (ex: 55), adicionar +
	if (cleaned.length >= 10 && cleaned.startsWith("55")) {
		return `+${cleaned}`;
	}
	// Se é apenas número nacional brasileiro (10 ou 11 dígitos), adicionar código do país
	if ((cleaned.length === 10 || cleaned.length === 11) && /^\d+$/.test(cleaned)) {
		return `+55${cleaned}`;
	}
	// Fallback: tentar parsear com país padrão BR
	try {
		const parsed = parsePhoneNumber(cleaned, "BR");
		if (parsed) {
			return parsed.number || phoneNumber;
		}
	} catch {
		// Se falhar, retornar o número original
	}
	return phoneNumber;
}

export function formatCEP(value: string): string {
	const cleaned = value.replace(/\D/g, "");
	if (cleaned.length <= 8) {
		return cleaned.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
	}
	return cleaned.slice(0, 8).replace(/(\d{5})(\d{3})/, "$1-$2");
}

export function removeCEPMask(value: string): string {
	return value.replace(/\D/g, "");
}

export function formatDate(value: string): string {
	const cleaned = value.replace(/\D/g, "");
	if (cleaned.length <= 8) {
		return cleaned
			.replace(/(\d{2})(\d)/, "$1/$2")
			.replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
	}
	return cleaned.slice(0, 8).replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
}

export function removeDateMask(value: string): string {
	return value.replace(/\D/g, "");
}

export function dateToISO(dateString: string): string {
	if (!dateString) return "";
	const cleaned = removeDateMask(dateString);
	if (cleaned.length === 8) {
		const day = parseInt(cleaned.slice(0, 2), 10);
		const month = parseInt(cleaned.slice(2, 4), 10) - 1;
		const year = parseInt(cleaned.slice(4, 8), 10);
		const date = new Date(year, month, day);
		if (isValid(date)) {
			return date.toISOString();
		}
	}
	return "";
}

export function isoToDate(isoString: string): string {
	if (!isoString) return "";
	try {
		const parts = isoString.split("-");
		if (parts.length === 3) {
			const year = parseInt(parts[0], 10);
			const month = parseInt(parts[1], 10) - 1;
			const day = parseInt(parts[2], 10);
			const date = new Date(year, month, day);
			if (isValid(date)) {
				return format(date, "dd/MM/yyyy");
			}
		}
	} catch {
		return "";
	}
	return "";
}
