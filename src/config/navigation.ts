import {
	LayoutDashboardIcon,
	SettingsIcon,
} from "lucide-react";

import type { NavItem } from "@/types";
import { routes } from "@/utils/routes";

export const mainNavItems: NavItem[] = [
	{
		title: "Dashboard",
		href: routes.dashboard,
		icon: LayoutDashboardIcon,
	},
	{
		title: "Configurações",
		icon: SettingsIcon,
		children: [
			{
				title: "Perfil",
				href: routes.settings.profile,
				description: "Gerencie suas informações pessoais.",
			},
			{
				title: "Senha",
				href: routes.settings.password,
				description: "Altere sua senha de acesso.",
			},
			{
				title: "Aparência",
				href: routes.settings.theme,
				description: "Personalize a aparência do sistema.",
			},
		],
	},
];
