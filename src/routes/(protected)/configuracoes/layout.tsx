import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
	Heading,
	HeadingDescription,
	HeadingTitle,
} from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { usePermissions } from "@/hooks/use-permissions";
import type { NavItem } from "@/types";
import { filterNavByPermissions } from "@/utils/nav";
import {
	ensureAuthenticated,
	ensureRoutePermissions,
} from "@/utils/route-guards";
import { routes } from "@/utils/routes";

const settingsStaticData = {
	requiredPermissions: [],
};

export const Route = createFileRoute("/(protected)/configuracoes")({
	staticData: settingsStaticData,
	beforeLoad: async ({ context, location }) => {
		await ensureAuthenticated();
		ensureRoutePermissions(settingsStaticData);

		if (location.pathname === "/configuracoes") {
			throw redirect({ to: "/configuracoes/perfil" });
		}

		return {
			...context,
			breadcrumbs: [{ title: "Configurações", href: routes.settings.profile }],
		};
	},
	component: RouteComponent,
});

const sidebarNavItems: Extract<NavItem, { href: string }>[] = [
	{
		title: "Perfil",
		href: "/configuracoes/perfil",
	},
	{
		title: "Senha",
		href: "/configuracoes/senha",
	},
	{
		title: "Aparência",
		href: "/configuracoes/aparencia",
	},
];

function RouteComponent() {
	const { permissions } = usePermissions();
	const items = filterNavByPermissions(sidebarNavItems, permissions) as Extract<
		NavItem,
		{ href: string }
	>[];

	return (
		<div className="space-y-8">
			<Heading>
				<HeadingTitle>Configurações</HeadingTitle>
				<HeadingDescription>
					Gerencie seu perfil e configurações da conta
				</HeadingDescription>
			</Heading>

			<div className="flex flex-col lg:flex-row lg:space-x-12">
				<aside className="w-full max-w-xl lg:w-48">
					<nav className="flex flex-col space-y-1 space-x-0">
						{items.map((item) => (
							<Button
								key={item.href}
								size="sm"
								variant="ghost"
								asChild
								className="w-full justify-start"
							>
								<Link
									to={item.href as never}
									activeProps={{
										className: "bg-muted hover:bg-muted",
									}}
									activeOptions={{ exact: true }}
								>
									{item.icon && <item.icon className="size-4" />}
									{item.title}
								</Link>
							</Button>
						))}
					</nav>
				</aside>

				<Separator className="my-6 lg:hidden" />

				<div className="flex-1 md:max-w-2xl">
					<section className="max-w-xl space-y-12 min-h-[420px]">
						<Outlet />
					</section>
				</div>
			</div>
		</div>
	);
}
