import axios, { type AxiosInstance } from "axios";

const brasilApiClient: AxiosInstance = axios.create({
	baseURL: "https://brasilapi.com.br/api",
	timeout: 10000,
	withCredentials: false,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

export default async function brasilApiClientRequest<TData = unknown>(
	config: Parameters<AxiosInstance["request"]>[0],
): Promise<TData> {
	const response = await brasilApiClient.request<TData>(config);
	return response.data;
}

export { brasilApiClient };
