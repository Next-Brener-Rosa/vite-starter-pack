import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDownIcon, PanelLeftIcon } from "lucide-react";
import * as React from "react";
import { Logo } from "@/components/layout/logo";
import { useSidebarState } from "@/components/layout/sidebar-state";
import { Button } from "@/components/ui/button";
import { mainNavItems } from "@/config/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePermissions } from "@/hooks/use-permissions";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { filterNavByPermissions, isActiveHref, isNavItemActive } from "@/utils/nav";

function NavLeaf({
	item,
	pathname,
	collapsed,
	onNavigate,
}: {
	item: Extract<NavItem, { href: string }>;
	pathname: string;
	collapsed: boolean;
	onNavigate?: () => void;
}) {
	const active = isActiveHref(pathname, item.href);
	const Icon = item.icon;

	return (
		<Button
			asChild
			variant={active ? "secondary" : "ghost"}
			className={cn(
				"w-full justify-start gap-2",
				collapsed ? "px-2" : "px-4 py-6",
			)}
		>
			<Link to={item.href as never} onClick={onNavigate}>
				{Icon ? <Icon /> : <PanelLeftIcon className="opacity-0" />}
				{collapsed ? (
					<span className="sr-only">{item.title}</span>
				) : (
					<span className="truncate transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none">
						{item.title}
					</span>
				)}
			</Link>
		</Button>
	);
}

function NavGroup({
	item,
	pathname,
	collapsed,
	onNavigate,
}: {
	item: Extract<NavItem, { children: NavItem[] }>;
	pathname: string;
	collapsed: boolean;
	onNavigate?: () => void;
}) {
	const Icon = item.icon;
	const selfActive = item.href ? isActiveHref(pathname, item.href) : false;
	const childActive = !selfActive && isNavItemActive(pathname, item);
	// Por padrão, todos os itens do accordion começam abertos
	const [open, setOpen] = React.useState<boolean>(true);

	React.useEffect(() => {
		if (childActive) setOpen(true);
	}, [childActive]);

	const children = item.children.filter(
		(c): c is Extract<NavItem, { href: string }> =>
			"href" in c && Boolean(c.href),
	);

	return (
		<div className="flex flex-col gap-2">
			<Button
				type="button"
				variant={selfActive ? "secondary" : "ghost"}
				className={cn(
					"w-full justify-start gap-2",
					collapsed ? "px-2" : "px-4 py-6",
				)}
				onClick={() => setOpen((v) => !v)}
			>
				{Icon ? <Icon /> : <PanelLeftIcon className="opacity-0" />}
				{collapsed ? (
					<span className="sr-only">{item.title}</span>
				) : (
					<span className="flex-1 truncate text-left transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none">
						{item.title}
					</span>
				)}
				{collapsed ? null : (
					<ChevronDownIcon
						className={cn(
							"ml-auto transition-transform duration-200 ease-out motion-reduce:transition-none",
							open ? "rotate-180" : "rotate-0",
						)}
					/>
				)}
			</Button>

			{collapsed ? null : open ? (
				<div className="ml-3 flex flex-col gap-2 border-l pl-3 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none">
					{children.map((child) => (
						<Button
							key={child.href}
							asChild
							variant={
								isActiveHref(pathname, child.href) ? "secondary" : "ghost"
							}
							className="w-full justify-start text-sm"
						>
							<Link to={child.href as never} onClick={onNavigate}>
								<span className="truncate">{child.title}</span>
							</Link>
						</Button>
					))}
				</div>
			) : null}
		</div>
	);
}

export function Sidebar({
	variant = "desktop",
	onNavigate,
}: {
	variant?: "desktop" | "mobile";
	onNavigate?: () => void;
}) {
	const isMobile = useIsMobile();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { permissions } = usePermissions();
	const { collapsed } = useSidebarState();

	const items = filterNavByPermissions(mainNavItems, permissions);

	const effectiveCollapsed = variant === "mobile" ? false : collapsed;
	const showDesktop = !isMobile && variant === "desktop";

	if (!showDesktop && variant === "desktop") return null;

	return (
		<aside
			className={cn(
				"bg-sidebar text-sidebar-foreground",
				"flex h-full shrink-0 flex-col",
				"transition-[width] duration-300 ease-in-out motion-reduce:transition-none",
				effectiveCollapsed ? "w-16" : "w-72",
			)}
		>
			<div
				className={cn(
					"flex items-center justify-between gap-2 px-3 py-3",
					effectiveCollapsed ? "px-2" : "px-4 py-6 pt-8",
				)}
			>
				<div className="flex items-center gap-3.5 px-3">
					<Logo className="h-8 w-8" />
					{!effectiveCollapsed && (
						<div className="text-xl uppercase font-semibold transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none">
							App
						</div>
					)}
				</div>
			</div>

			<nav className="flex-1 overflow-auto p-4 scrollbar-hide">
				<div className="flex flex-col gap-2">
					{items.map((item) => {
						if ("href" in item && item.href && !("children" in item)) {
							return (
								<NavLeaf
									key={item.href}
									item={item}
									pathname={pathname}
									collapsed={effectiveCollapsed}
									onNavigate={onNavigate}
								/>
							);
						}

						if ("children" in item && item.children) {
							return (
								<NavGroup
									key={item.title}
									item={item}
									pathname={pathname}
									collapsed={effectiveCollapsed}
									onNavigate={onNavigate}
								/>
							);
						}

						return null;
					})}
				</div>
			</nav>
		</aside>
	);
}
