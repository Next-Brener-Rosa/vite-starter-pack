import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./report-web-vitals.ts";
import { routeTree } from "./route-tree.gen.ts";
import type { RouterContext } from "./types/router-context";

import "./styles.css";

const router = createRouter({
	routeTree,
	context: {
		breadcrumbs: [],
	} satisfies RouterContext,
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<RouterProvider router={router} />
		</StrictMode>,
	);
}

reportWebVitals();
