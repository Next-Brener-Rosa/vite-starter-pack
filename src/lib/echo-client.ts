import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { getStoredToken } from "@/lib/auth";
import { env } from "@/utils/env";

// Type alias para simplificar o uso do tipo genérico Echo
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EchoInstance = Echo<any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let echoInstance: EchoInstance | null = null;

export function createEchoClient(): EchoInstance | null {
	const token = getStoredToken();

	if (!token) {
		console.warn("[Echo] Token não encontrado para autenticação do WebSocket");
		return null;
	}

	if (echoInstance) {
		// Atualizar token se já existe instância
		updateEchoToken();
		return echoInstance;
	}

	// Configurar Pusher globalmente (requerido pelo Laravel Echo)
	if (typeof window !== "undefined" && !window.Pusher) {
		window.Pusher = Pusher;
	}

	const wsHost = env.WS_HOST || "localhost";
	const wsPort = env.WS_PORT || "6001";
	const wsKey = env.WS_KEY || "app-key";
	const wsCluster = env.WS_CLUSTER || "";
	const forceTLS = env.WS_FORCE_TLS ?? true;

	// Garantir que o authEndpoint use a URL completa da API
	// Isso é importante para evitar problemas de CORS
	const authEndpoint =
		env.WS_AUTH_ENDPOINT || `${env.API_BASE_URL}/broadcasting/auth`;

	// Verificar se o authEndpoint é uma URL absoluta
	if (
		!authEndpoint.startsWith("http://") &&
		!authEndpoint.startsWith("https://")
	) {
		console.warn(
			"[Echo] authEndpoint deve ser uma URL absoluta. Usando API_BASE_URL como base.",
		);
	}

	echoInstance = new Echo({
		broadcaster: "pusher",
		key: wsKey,
		cluster: wsCluster,
		wsHost: wsHost,
		wsPort: forceTLS ? undefined : Number.parseInt(wsPort, 10),
		wssPort: forceTLS ? Number.parseInt(env.WSS_PORT || "443", 10) : undefined,
		forceTLS: forceTLS,
		encrypted: forceTLS,
		disableStats: true,
		enabledTransports: ["ws", "wss"],
		authEndpoint: authEndpoint,
		auth: {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	});

	return echoInstance;
}

export function getEchoClient(): EchoInstance | null {
	return echoInstance;
}

declare global {
	interface Window {
		Pusher: typeof Pusher;
		Echo?: EchoInstance;
	}
}

export function disconnectEcho(): void {
	if (echoInstance) {
		echoInstance.disconnect();
		echoInstance = null;
	}
}

export function reconnectEcho(): void {
	disconnectEcho();
	createEchoClient();
}

export function updateEchoToken(): void {
	if (echoInstance?.connector?.options?.auth) {
		const token = getStoredToken();
		echoInstance.connector.options.auth.headers = {
			...echoInstance.connector.options.auth.headers,
			Authorization: `Bearer ${token || ""}`,
		};
	}
}
