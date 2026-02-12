import { defineConfig } from "orval";

const API_SWAGGER_URL =
	process.env.VITE_API_SWAGGER_URL ||
	"http://127.0.0.1:3658/export/openapi/1146445/1735?moduleId=998748";

export default defineConfig({
	api: {
		input: {
			target: API_SWAGGER_URL,
		},
		output: {
			mode: "tags-split",
			target: "./src/api/generated",
			schemas: "./src/api/generated/models",
			client: "react-query",
			mock: false,
			override: {
				mutator: {
					path: "./src/lib/api-client.ts",
					name: "apiClient",
					default: true,
				},
				query: {
					useQuery: true,
					useInfinite: false,
					useInfiniteQueryParam: "page",
				},
			},
		},
	},
});

