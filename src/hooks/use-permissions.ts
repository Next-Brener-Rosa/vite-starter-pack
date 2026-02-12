import { usePermissionStore } from "@/stores/permission-store";

export function usePermissions() {
	const {
		roles,
		permissions,
		permissionMap,
		hasPermission,
		hasAnyPermission,
		hasAllPermissions,
		getModulePermissions,
	} = usePermissionStore();

	return {
		roles,
		permissions,
		permissionMap,
		hasPermission,
		hasAnyPermission,
		hasAllPermissions,
		getModulePermissions,
	};
}

