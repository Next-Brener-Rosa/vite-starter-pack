import { useAuthStore } from "@/stores/auth-store";

export function useAuth() {
	const {
		user,
		token,
		refreshToken,
		isAuthenticated,
		isLoading,
		error,
		signIn,
		signOut,
		refreshAccessToken,
		hydrateUser,
		setUser,
		clearError,
	} = useAuthStore();

	return {
		user,
		token,
		refreshToken,
		isAuthenticated,
		isLoading,
		error,
		signIn,
		signOut,
		refreshAccessToken,
		hydrateUser,
		setUser,
		clearError,
	};
}
