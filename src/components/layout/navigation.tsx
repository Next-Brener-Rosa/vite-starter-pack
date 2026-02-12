import { Link, useRouterState } from "@tanstack/react-router";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { mainNavItems } from "@/config/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePermissions } from "@/hooks/use-permissions";
import type { NavItem } from "@/types";
import { filterNavByPermissions, isActiveHref, isNavItemActive } from "@/utils/nav";

function DropdownLink({
	item,
	pathname,
}: {
	item: Extract<NavItem, { href: string }>;
	pathname: string;
}) {
	const active = isActiveHref(pathname, item.href);

	return (
		<NavigationMenuLink asChild active={active}>
			<Link to={item.href as never}>
				<div className="font-medium">{item.title}</div>
				{item.description ? (
					<div className="text-muted-foreground text-xs">
						{item.description}
					</div>
				) : null}
			</Link>
		</NavigationMenuLink>
	);
}

function TopLevelLink({
	item,
	pathname,
}: {
	item: Extract<NavItem, { href: string }>;
	pathname: string;
}) {
	const active = isActiveHref(pathname, item.href);
	const Icon = item.icon;

	return (
		<NavigationMenuItem>
			<NavigationMenuLink asChild active={active}>
				<Link
					to={item.href as never}
					className="flex-row items-center gap-2"
					activeProps={{ className: "text-accent-foreground" }}
				>
					{Icon ? <Icon /> : null}
					{item.title}
				</Link>
			</NavigationMenuLink>
		</NavigationMenuItem>
	);
}

export function Navigation() {
	const isMobile = useIsMobile();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { permissions } = usePermissions();

	const items = filterNavByPermissions(mainNavItems, permissions);

	return (
		<NavigationMenu viewport={isMobile}>
			<NavigationMenuList className="flex-wrap">
				{items.map((item) => {
					if ("href" in item && item.href && !("children" in item)) {
						return (
							<TopLevelLink key={item.href} item={item} pathname={pathname} />
						);
					}

					const Icon = item.icon;
					const active = isNavItemActive(pathname, item);
					const children = "children" in item ? item.children : undefined;

					return (
						<NavigationMenuItem key={item.title}>
							<NavigationMenuTrigger
								data-active={active ? "" : undefined}
								className="data-[active]:focus:bg-accent data-[active]:hover:bg-accent data-[active]:bg-accent/50 data-[active]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4"
							>
								<div className="flex flex-row items-center gap-2">
									{Icon ? <Icon /> : null}
									<span>{item.title}</span>
								</div>
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className="grid w-[360px] gap-4">
									<li>
										{children && children.length > 0
											? children
													.filter(
														(c): c is Extract<NavItem, { href: string }> =>
															"href" in c && Boolean(c.href),
													)
													.map((child) => (
														<DropdownLink
															key={child.href}
															item={child}
															pathname={pathname}
														/>
													))
											: null}
									</li>
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
					);
				})}
			</NavigationMenuList>
		</NavigationMenu>
	);
}
