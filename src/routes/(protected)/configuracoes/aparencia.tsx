import { createFileRoute } from "@tanstack/react-router";

import * as React from "react";
import { ToggleTheme } from "@/components/settings/toggle-theme";
import {
	Heading,
	HeadingDescription,
	HeadingTitle,
} from "@/components/ui/heading";
import {
	ensureAuthenticated,
	ensureRoutePermissions,
} from "@/utils/route-guards";
import { routes } from "@/utils/routes";

const themeStaticData = {
	requiredPermissions: [],
};

export const Route = createFileRoute("/(protected)/configuracoes/aparencia")({
	beforeLoad: async ({ context }) => {
		await ensureAuthenticated();
		ensureRoutePermissions(themeStaticData);

		return {
			...context,
			breadcrumbs: [
				{ title: "Configurações", href: routes.settings.profile },
				{ title: "Aparência", href: routes.settings.theme },
			],
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<React.Fragment>
			<Heading>
				<HeadingTitle size="sm" className="font-medium">
					Aparência
				</HeadingTitle>
				<HeadingDescription size="sm">
					Personalize o tema do aplicativo
				</HeadingDescription>
			</Heading>
			<ToggleTheme />
		</React.Fragment>
	);
}
