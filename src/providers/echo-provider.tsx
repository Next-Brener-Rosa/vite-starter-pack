import * as React from "react";
import {
	createEchoClient,
	disconnectEcho,
	reconnectEcho,
	updateEchoToken,
} from "@/lib/echo-client";
import { useAuthStore } from "@/stores/auth-store";

interface EchoContextValue {
	echo: ReturnType<typeof createEchoClient> | null;
	reconnect: () => void;
}

const EchoContext = React.createContext<EchoContextValue | undefined>(undefined);

interface EchoProviderProps {
	children: React.ReactNode;
}

export function EchoProvider({ children }: EchoProviderProps) {
	const [echo, setEcho] = React.useState<ReturnType<typeof createEchoClient> | null>(
		null,
	);
	const { isAuthenticated, token } = useAuthStore();

	React.useEffect(() => {
		if (isAuthenticated) {
			// Inicializar Echo quando autenticado
			const echoClient = createEchoClient();
			if (echoClient) {
				setEcho(echoClient);
			} else {
				// Se não conseguiu criar (sem token), desconectar
				disconnectEcho();
				setEcho(null);
			}
		} else {
			// Desconectar quando não autenticado
			disconnectEcho();
			setEcho(null);
		}

		return () => {
			// Cleanup ao desmontar
			if (!isAuthenticated) {
				disconnectEcho();
			}
		};
	}, [isAuthenticated]);

	// Atualizar token do Echo quando o token mudar
	React.useEffect(() => {
		if (isAuthenticated && token && echo) {
			updateEchoToken();
		}
	}, [token, isAuthenticated, echo]);

	const reconnect = React.useCallback(() => {
		reconnectEcho();
		const echoClient = createEchoClient();
		setEcho(echoClient);
	}, []);

	const value = React.useMemo(
		() => ({
			echo,
			reconnect,
		}),
		[echo, reconnect],
	);

	return <EchoContext.Provider value={value}>{children}</EchoContext.Provider>;
}

export function useEcho() {
	const context = React.useContext(EchoContext);
	if (context === undefined) {
		throw new Error("useEcho must be used within an EchoProvider");
	}
	return context;
}
