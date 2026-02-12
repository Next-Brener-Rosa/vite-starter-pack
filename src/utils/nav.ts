import type { NavItem } from "@/types";
import type { Permission } from "@/lib/permissions";
import { hasAnyPermission } from "@/lib/permissions";

export function isActiveHref(pathname: string, href: string): boolean {
	return pathname === href || pathname.startsWith(`${href}/`);
}

export function hasRequiredPermissions(
	userPermissions: Set<Permission>,
	required: Permission[] | undefined,
): boolean {
	if (!required || required.length === 0) return true;
	if (userPermissions.size === 0) return false;
	return hasAnyPermission(required, userPermissions);
}

export function filterNavByPermissions(
	items: NavItem[],
	userPermissions: Set<Permission>,
): NavItem[] {
	return items
		.filter((item) => hasRequiredPermissions(userPermissions, item.permissions))
		.map((item) => {
			if (!("children" in item) || !item.children) return item;
			const children = filterNavByPermissions(item.children, userPermissions);
			return { ...item, children };
		})
		.filter((item) => {
			if ("children" in item && item.children) {
				return item.children.length > 0 || Boolean(item.href);
			}
			return true;
		});
}

export function isNavItemActive(pathname: string, item: NavItem): boolean {
	if ("href" in item && item.href) {
		if (isActiveHref(pathname, item.href)) return true;
	}

	if ("children" in item && item.children) {
		return item.children.some((child) => isNavItemActive(pathname, child));
	}

	return false;
}
