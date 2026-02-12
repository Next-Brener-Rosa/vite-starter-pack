import type {
	DataTag,
	DefinedInitialDataOptions,
	DefinedUseQueryResult,
	QueryClient,
	QueryFunction,
	QueryKey,
	UndefinedInitialDataOptions,
	UseQueryOptions,
	UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { removeCEPMask } from "@/lib/masks";
import brasilApiClientRequest from "./brasil-api-client";
import type { CepResponse } from "./types";

export const getCep = (cep: string, signal?: AbortSignal) => {
	const cleanedCep = removeCEPMask(cep);

	if (cleanedCep.length !== 8) {
		throw new Error("CEP deve ter 8 dígitos");
	}

	return brasilApiClientRequest<CepResponse>({
		url: `/cep/v2/${cleanedCep}`,
		method: "GET",
		signal,
	});
};

export const getCepQueryKey = (cep?: string) => {
	const cleanedCep = cep ? removeCEPMask(cep) : "";
	return ["getCep", cleanedCep] as const;
};

export const getCepQueryOptions = <
	TData = Awaited<ReturnType<typeof getCep>>,
	TError = unknown,
>(
	cep?: string,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getCep>>, TError, TData>
		>;
	},
) => {
	const { query: queryOptions } = options ?? {};

	const cleanedCep = cep ? removeCEPMask(cep) : "";
	const isEnabled = !!cleanedCep && cleanedCep.length === 8;

	const queryKey = queryOptions?.queryKey ?? getCepQueryKey(cep);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getCep>>> = ({
		signal,
	}) => {
		if (!cep) {
			throw new Error("CEP é obrigatório");
		}
		return getCep(cep, signal);
	};

	return {
		queryKey,
		queryFn,
		enabled: isEnabled && (queryOptions?.enabled ?? true),
		staleTime: 1000 * 60 * 60, // 1 hora
		gcTime: 1000 * 60 * 60 * 24, // 24 horas
		...queryOptions,
	} as UseQueryOptions<Awaited<ReturnType<typeof getCep>>, TError, TData> & {
		queryKey: DataTag<QueryKey, TData, TError>;
	};
};

export type CepQueryResult = NonNullable<Awaited<ReturnType<typeof getCep>>>;
export type CepQueryError = unknown;

export function useCep<
	TData = Awaited<ReturnType<typeof getCep>>,
	TError = unknown,
>(
	cep: string,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getCep>>, TError, TData>
		> &
			Pick<
				DefinedInitialDataOptions<
					Awaited<ReturnType<typeof getCep>>,
					TError,
					Awaited<ReturnType<typeof getCep>>
				>,
				"initialData"
			>;
	},
	queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};
export function useCep<
	TData = Awaited<ReturnType<typeof getCep>>,
	TError = unknown,
>(
	cep: string,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getCep>>, TError, TData>
		> &
			Pick<
				UndefinedInitialDataOptions<
					Awaited<ReturnType<typeof getCep>>,
					TError,
					Awaited<ReturnType<typeof getCep>>
				>,
				"initialData"
			>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};
export function useCep<
	TData = Awaited<ReturnType<typeof getCep>>,
	TError = unknown,
>(
	cep: string,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getCep>>, TError, TData>
		>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};
/**
 * @summary Get CEP data
 */
export function useCep<
	TData = Awaited<ReturnType<typeof getCep>>,
	TError = unknown,
>(
	cep: string,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getCep>>, TError, TData>
		>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
} {
	const queryOptions = getCepQueryOptions(cep, options);

	const query = useQuery(queryOptions, queryClient) as UseQueryResult<
		TData,
		TError
	> & { queryKey: DataTag<QueryKey, TData, TError> };

	query.queryKey = queryOptions.queryKey;

	return query;
}
