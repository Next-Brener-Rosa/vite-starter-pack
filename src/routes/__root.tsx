import {
	createRootRoute,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import * as React from "react";
import type { LoadingBarRef } from "react-top-loading-bar";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopLoadingBar } from "@/components/ui/top-loading-bar";
import { EchoProvider } from "@/providers/echo-provider";
import { QueryProvider } from "@/providers/query-provider";
import { useAuthStore } from "@/stores/auth-store";
import type { RouterContext } from "@/types/router-context";

export const Route = createRootRoute({
	context: (): RouterContext => ({
		breadcrumbs: [],
	}),
	component: RootComponent,
});

function RootComponent() {
	const loadingBarRef = React.useRef<LoadingBarRef>(null);
	const status = useRouterState({ select: (s) => s.status });

	React.useEffect(() => {
		void useAuthStore.getState().initialize();
	}, []);

	React.useEffect(() => {
		if (status === "pending") {
			loadingBarRef.current?.continuousStart(20, 1000);
			return;
		}

		loadingBarRef.current?.complete();
	}, [status]);

	return (
		<QueryProvider>
			<EchoProvider>
				<NuqsAdapter>
					<TopLoadingBar ref={loadingBarRef} />
					<TooltipProvider>
						<Outlet />
					</TooltipProvider>
				</NuqsAdapter>
				<Toaster
					position="top-center"
					toastOptions={{
						classNames: {
							description: "!text-muted-foreground",
						},
					}}
				/>
			</EchoProvider>
		</QueryProvider>
	);
}
