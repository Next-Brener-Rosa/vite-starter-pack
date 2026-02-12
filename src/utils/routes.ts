import type { LinkProps } from "@tanstack/react-router";

type RouteValue = LinkProps["to"];

type RouteStructure = {
	[key: string]: RouteValue | RouteStructure;
};

const routesBase = {
	dashboard: "/dashboard",
	settings: {
		profile: "/configuracoes/perfil",
		password: "/configuracoes/senha",
		theme: "/configuracoes/aparencia",
	},
} satisfies RouteStructure;

export const routes = routesBase;

export type RoutePath =
	| typeof routes.dashboard
	| (typeof routes.settings)[keyof typeof routes.settings];
