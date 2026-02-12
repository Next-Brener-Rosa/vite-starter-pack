import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
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

const staticData = {
	requiredPermissions: [],
};

export const Route = createFileRoute("/(protected)/configuracoes/senha")({
	staticData,
	beforeLoad: async ({ context }) => {
		await ensureAuthenticated();
		ensureRoutePermissions(staticData);

		return {
			...context,
			breadcrumbs: [
				{ title: "Configurações", href: routes.settings.profile },
				{ title: "Senha", href: routes.settings.password },
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
					Senha
				</HeadingTitle>
				<HeadingDescription size="sm">
					Atualize sua senha de acesso
				</HeadingDescription>
			</Heading>

			<ChangePasswordForm />
		</React.Fragment>
	);
}
