import * as React from "react";
import { usePermissions } from "@/hooks/use-permissions";
import type { Permission } from "@/lib/permissions";

interface PermissionsContextValue {
	hasPermission: (permission: Permission) => boolean;
	hasAnyPermission: (permissions: Permission[]) => boolean;
	hasAllPermissions: (permissions: Permission[]) => boolean;
}

const PermissionsContext = React.createContext<
	PermissionsContextValue | undefined
>(undefined);

interface PermissionsProviderProps {
	children: React.ReactNode;
}

export function PermissionsProvider({ children }: PermissionsProviderProps) {
	const { hasPermission, hasAnyPermission, hasAllPermissions } =
		usePermissions();

	const value = React.useMemo(
		() => ({
			hasPermission,
			hasAnyPermission,
			hasAllPermissions,
		}),
		[hasPermission, hasAnyPermission, hasAllPermissions],
	);

	return (
		<PermissionsContext.Provider value={value}>
			{children}
		</PermissionsContext.Provider>
	);
}

export function usePermissionsContext() {
	const context = React.useContext(PermissionsContext);
	if (context === undefined) {
		throw new Error(
			"usePermissionsContext must be used within a PermissionsProvider",
		);
	}
	return context;
}

interface PermissionGuardProps {
	permission?: Permission;
	permissions?: Permission[];
	requireAll?: boolean;
	fallback?: React.ReactNode;
	children: React.ReactNode;
}

export function PermissionGuard({
	permission,
	permissions,
	requireAll = false,
	fallback = null,
	children,
}: PermissionGuardProps) {
	const { hasPermission, hasAnyPermission, hasAllPermissions } =
		usePermissionsContext();

	if (permission) {
		return hasPermission(permission) ? children : fallback;
	}

	if (permissions && permissions.length > 0) {
		const hasAccess = requireAll
			? hasAllPermissions(permissions)
			: hasAnyPermission(permissions);
		return hasAccess ? children : fallback;
	}

	return <React.Fragment>{children}</React.Fragment>;
}
