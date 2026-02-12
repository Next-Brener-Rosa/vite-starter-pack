import type { AxiosError } from "axios";
import { toast } from "sonner";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import {
	loginEmailAndPassword,
	me,
	userRefreshToken,
} from "@/api/generated/auth/auth";
import type { UserResource } from "@/api/generated/models";
import { usePermissionStore } from "@/stores/permission-store";
import { onError } from "@/utils/on-error";
import {
	getStoredToken,
	isTokenExpired,
	removeStoredRefreshToken,
	removeStoredToken,
	setStoredToken,
	updateStoredToken,
} from "../lib/auth";

interface AuthState {
	user: UserResource | null;
	token: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	_isInitializing: boolean;
}

interface AuthActions {
	signIn: (
		email: string,
		password: string,
		rememberMe?: boolean,
	) => Promise<void>;
	signOut: () => void;
	refreshAccessToken: () => Promise<void>;
	hydrateUser: () => Promise<UserResource>;
	setUser: (user: UserResource | null) => void;
	setToken: (token: string) => void;
	setRefreshToken: (token: string) => void;
	clearError: () => void;
	initialize: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

const authStoreCreator: StateCreator<AuthStore> = (set, get) => ({
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	...(() => {
		const initialToken = getStoredToken();
		return {
			token: initialToken,
			isAuthenticated: Boolean(initialToken),
			isLoading: Boolean(initialToken),
		};
	})(),
	user: null,
	refreshToken: null,
	error: null,
	_isInitializing: false,

	hydrateUser: async () => {
		const response = await me();

		if (response.error || !response.data) {
			throw new Error(response.message || "Erro ao buscar usuário logado");
		}

		const apiUser = response.data;

		const user: UserResource = {
			...apiUser,
			full_path_profile_picture: apiUser.full_path_profile_picture ?? undefined,
		};

		const userWithPermissions = apiUser as UserResource & {
			permissions?: string[];
			roles?: string[];
		};

		const permissions = userWithPermissions.permissions || [];
		const roles = userWithPermissions.roles || [];

		usePermissionStore.getState().setPermissions(permissions, roles);

		set({ user });
		return user;
	},

	initialize: async () => {
		// Evitar múltiplas chamadas simultâneas
		if (get()._isInitializing) {
			return;
		}

		const token = getStoredToken();
		if (!token) {
			set({
				token: null,
				isAuthenticated: false,
				isLoading: false,
				refreshToken: null,
				user: null,
				_isInitializing: false,
			});
			return;
		}

		// Se já tem usuário e token válido, não precisa inicializar novamente
		if (get().user && get().isAuthenticated && !isTokenExpired(token)) {
			return;
		}

		set({ isAuthenticated: true, token, refreshToken: null, isLoading: true, _isInitializing: true });

		if (!isTokenExpired(token)) {
			try {
				await get().hydrateUser();
			} finally {
				set({ isLoading: false, _isInitializing: false });
			}
			return;
		}

		try {
			await get().refreshAccessToken();
			await get().hydrateUser();
			set({ isAuthenticated: true, isLoading: false, _isInitializing: false });
		} catch {
			set({ isAuthenticated: false, isLoading: false, _isInitializing: false });
		}
	},

	signIn: async (email: string, password: string, rememberMe = true) => {
		set({ isLoading: true, error: null });
		try {
			const response = await loginEmailAndPassword({ email, password });

			if (response.error || !response.data) {
				throw new Error(response.message || "Erro ao fazer login");
			}

			toast.success(response.message);

			const { token, user: loginUser } = response.data;
			setStoredToken(token, { remember: rememberMe });

			if (loginUser) {
				const userWithPermissions = loginUser as typeof loginUser & {
					permissions?: string[];
					roles?: string[];
				};

				if (userWithPermissions.permissions || userWithPermissions.roles) {
					const permissions = userWithPermissions.permissions || [];
					const roles = userWithPermissions.roles || [];
					usePermissionStore.getState().setPermissions(permissions, roles);
				}
			}

			set({
				token,
				refreshToken: null,
				isAuthenticated: true,
			});

			const user = await get().hydrateUser();

			set({
				user,
				token,
				refreshToken: null,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			});
		} catch (error) {
			onError(error as AxiosError<{ message: string }>);
			const errorMessage =
				error instanceof Error ? error.message : "Erro ao fazer login";
			set({
				isLoading: false,
				error: errorMessage,
				isAuthenticated: false,
			});
			throw error;
		}
	},

	signOut: async () => {
		removeStoredToken();
		removeStoredRefreshToken();
		usePermissionStore.getState().clearPermissions();
		set({
			user: null,
			token: null,
			refreshToken: null,
			isAuthenticated: false,
			error: null,
		});
	},

	refreshAccessToken: async () => {
		try {
			const response = await userRefreshToken();

			if (response.error || !response.data) {
				throw new Error(response.message || "Erro ao atualizar token");
			}

			const { token } = response.data;

			updateStoredToken(token);

			set({
				token,
				refreshToken: null,
			});
		} catch (error) {
			get().signOut();
			throw error;
		}
	},

	setUser: (user: UserResource | null) => {
		set({ user });
	},

	setToken: (token: string) => {
		updateStoredToken(token);
		set({ token });
	},

	setRefreshToken: (token: string) => {
		set({ refreshToken: token });
	},

	clearError: () => {
		set({ error: null });
	},
});

export const useAuthStore = create<AuthStore>(authStoreCreator);
