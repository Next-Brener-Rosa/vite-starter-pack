import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import {
	Heading,
	HeadingDescription,
	HeadingTitle,
} from "@/components/ui/heading";

type Search = {
	token?: string;
	email?: string;
};

export const Route = createFileRoute("/(auth)/redefinir-senha")({
	validateSearch: (search: Record<string, unknown>): Search => ({
		token: typeof search.token === "string" ? search.token : undefined,
		email: typeof search.email === "string" ? search.email : undefined,
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const { token, email } = Route.useSearch();

	return (
		<React.Fragment>
			<Heading>
				<HeadingTitle>Recuperar senha</HeadingTitle>
				<HeadingDescription>
					Digite seu e-mail para receber um link de recuperação de senha.
				</HeadingDescription>
			</Heading>

			<ResetPasswordForm token={token} email={email} />
		</React.Fragment>
	);
}
