import { createFileRoute } from "@tanstack/react-router";

import * as React from "react";
import { UpdateProfileForm } from "@/components/settings/update-profile-form";
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

export const Route = createFileRoute("/(protected)/configuracoes/perfil")({
	staticData,
	beforeLoad: async ({ context }) => {
		await ensureAuthenticated();
		ensureRoutePermissions(staticData);

		return {
			...context,
			breadcrumbs: [
				{ title: "Configurações", href: routes.settings.profile },
				{ title: "Perfil", href: routes.settings.profile },
			],
		};
	},
	component: PerfilPage,
});

function PerfilPage() {
	return (
		<React.Fragment>
			<Heading>
				<HeadingTitle size="sm" className="font-medium">
					Perfil
				</HeadingTitle>
				<HeadingDescription size="sm">
					Atualize suas informações pessoais
				</HeadingDescription>
			</Heading>

			<UpdateProfileForm />
		</React.Fragment>
	);
}
