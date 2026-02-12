import * as React from "react";

const COLLAPSED_KEY = "app.sidebar.collapsed";

type SidebarState = {
	collapsed: boolean;
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
	toggleCollapsed: () => void;
};

const SidebarStateContext = React.createContext<SidebarState | null>(null);

export function SidebarStateProvider({
	children,
	defaultCollapsed = false,
}: {
	children: React.ReactNode;
	defaultCollapsed?: boolean;
}) {
	const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

	React.useEffect(() => {
		try {
			const raw = window.localStorage.getItem(COLLAPSED_KEY);
			if (raw === null) return;
			setCollapsed(raw === "1");
		} catch {}
	}, []);

	React.useEffect(() => {
		try {
			window.localStorage.setItem(COLLAPSED_KEY, collapsed ? "1" : "0");
		} catch {}
	}, [collapsed]);

	const value = React.useMemo<SidebarState>(() => {
		return {
			collapsed,
			setCollapsed,
			toggleCollapsed: () => setCollapsed((v) => !v),
		};
	}, [collapsed]);

	return (
		<SidebarStateContext.Provider value={value}>
			{children}
		</SidebarStateContext.Provider>
	);
}

export function useSidebarState() {
	const ctx = React.useContext(SidebarStateContext);
	if (!ctx) {
		throw new Error("useSidebarState must be used within SidebarStateProvider");
	}
	return ctx;
}
