import type { LinkProps } from "@tanstack/react-router";

export type BreadcrumbItem = {
	title: string;
	href: LinkProps["to"];
};

export type RouterContext = {
	breadcrumbs?: BreadcrumbItem[];
};

declare module "@tanstack/react-router" {
	interface Register {
		routerContext: RouterContext;
	}
}
