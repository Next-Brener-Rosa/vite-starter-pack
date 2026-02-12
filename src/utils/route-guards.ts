import { redirect } from "@tanstack/react-router";
import { getStoredToken } from "@/lib/auth";
import type { Permission } from "@/lib/permissions";
import { useAuthStore } from "@/stores/auth-store";
import { usePermissionStore } from "@/stores/permission-store";

export type RoutePermissionsStaticData = {
	requiredPermission?: Permission;
	requiredPermissions?: Permission[];
	requireAll?: boolean;
};

export async function ensureAuthenticated(): Promise<void> {
	await useAuthStore.getState().initialize();

	if (!useAuthStore.getState().isAuthenticated) {
		throw redirect({ to: "/entrar" });
	}
}

export async function redirectIfAuthenticated(
	to = "/dashboard",
): Promise<void> {
	const token = getStoredToken();
	if (!token) return;

	await useAuthStore.getState().initialize();

	if (useAuthStore.getState().isAuthenticated) {
		throw redirect({ to });
	}
}

export function ensureRoutePermissions(
	staticData: RoutePermissionsStaticData | undefined,
): void {
	if (!staticData) return;

	const {
		requiredPermission,
		requiredPermissions,
		requireAll = false,
	} = staticData;
	const permissionStore = usePermissionStore.getState();

	if (requiredPermission) {
		const hasPermission = permissionStore.hasPermission(requiredPermission);
		if (hasPermission) {
			return;
		}
	}

	if (requiredPermissions && requiredPermissions.length > 0) {
		const hasPermissions = requireAll
			? permissionStore.hasAllPermissions(requiredPermissions)
			: permissionStore.hasAnyPermission(requiredPermissions);

		if (hasPermissions) {
			return;
		}
	}

	if (
		requiredPermission ||
		(requiredPermissions && requiredPermissions.length > 0)
	) {
		throw redirect({ to: "/dashboard" });
	}
}
