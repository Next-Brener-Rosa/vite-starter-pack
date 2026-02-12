import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import * as React from "react";

import { Logo } from "@/components/layout/logo";
import { useAuth } from "@/hooks/use-auth";
import { redirectIfAuthenticated } from "@/utils/route-guards";

export const Route = createFileRoute("/(auth)")({
	beforeLoad: async () => {
		await redirectIfAuthenticated("/dashboard");
	},
	component: RouteComponent,
});

function RouteComponent() {
	React.useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove("dark");
		root.classList.add("light");
	}, []);

	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		return <Navigate to="/dashboard" />;
	}

	return (
		<div className="relative h-screen w-screen grid md:grid-cols-12">
			<div className="col-span-6 bg-hero bg-muted-foreground bg-center m-3 rounded-2xl relative overflow-hidden hidden md:flex"></div>

			<div className="col-span-6 px-8 md:px-20 lg:px-32 flex flex-col justify-center">
				<div className="space-y-6">
					<div className="w-full flex justify-center">
						<div className="size-16">
							<Logo className="size-full" />
						</div>
					</div>

					<div className="mt-10 space-y-6">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
}
