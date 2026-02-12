import { createFileRoute, Outlet } from "@tanstack/react-router";
import * as React from "react";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { SidebarStateProvider } from "@/components/layout/sidebar-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PermissionsProvider } from "@/providers/permissions-provider";
import { useThemeStore } from "@/stores/theme-store";
import { ensureAuthenticated } from "@/utils/route-guards";

export const Route = createFileRoute("/(protected)")({
	beforeLoad: async () => {
		await ensureAuthenticated();
	},
	component: RouteComponent,
});

function RouteComponent() {
	React.useEffect(() => {
		useThemeStore.getState().hydrate();
	}, []);

	return (
		<PermissionsProvider>
		<div className="h-screen w-screen overflow-hidden">
			<SidebarStateProvider>
				<div className="flex h-full w-full gap-2 bg-sidebar">
					<Sidebar />

					<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
						<Header />

						<main className="flex min-w-0 flex-1 flex-col h-full min-h-0 overflow-hidden bg-background lg:rounded-tl-4xl">
							<ScrollArea className="h-full w-full min-w-0">
								<div className="min-w-0 w-full max-w-full overflow-x-hidden p-4 md:p-8">
									<Outlet />
								</div>
							</ScrollArea>
						</main>
					</div>
				</div>
			</SidebarStateProvider>
		</div>
		</PermissionsProvider>
	);
}
