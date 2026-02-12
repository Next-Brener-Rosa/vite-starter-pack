import * as React from "react";
import { useIndexPermissions } from "@/api/generated/permissions/permissions";

interface RolesContextValue {
	permissions: string[];
	groupedPermissions: Map<string, string[]>;
	isLoading: boolean;
}

const RolesContext = React.createContext<RolesContextValue | undefined>(
	undefined,
);

interface RolesProviderProps {
	children: React.ReactNode;
}

function groupPermissionsByModule(
	permissions: string[],
): Map<string, string[]> {
	const grouped = new Map<string, string[]>();

	for (const permission of permissions) {
		const [module] = permission.split(".");
		if (!grouped.has(module)) {
			grouped.set(module, []);
		}
		grouped.get(module)?.push(permission);
	}

	return grouped;
}

export function RolesProvider({ children }: RolesProviderProps) {
	const { data: permissionsData, isLoading: isLoadingPermissions } =
		useIndexPermissions();

	const permissions = React.useMemo(
		() => permissionsData?.data?.data?.map((p) => p.name) || [],
		[permissionsData],
	);

	const groupedPermissions = React.useMemo(
		() => groupPermissionsByModule(permissions),
		[permissions],
	);

	const value = React.useMemo(
		() => ({
			permissions,
			groupedPermissions,
			isLoading: isLoadingPermissions,
		}),
		[permissions, groupedPermissions, isLoadingPermissions],
	);

	return (
		<RolesContext.Provider value={value}>{children}</RolesContext.Provider>
	);
}

export function useRolesContext() {
	const context = React.useContext(RolesContext);
	if (context === undefined) {
		throw new Error("useRolesContext must be used within a RolesProvider");
	}
	return context;
}
