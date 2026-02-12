import type { LucideIcon } from "lucide-react";

import type { Permission } from "@/lib/permissions";

type NavBase = {
	title: string;
	description?: string;
	icon?: LucideIcon;
	permissions?: Permission[];
};

export type NavItem = NavBase &
	(
		| {
				href: string;
				children?: never;
		  }
		| {
				href?: string;
				children: NavItem[];
		  }
	);
