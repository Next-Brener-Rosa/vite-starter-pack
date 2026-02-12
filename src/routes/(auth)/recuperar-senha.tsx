import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import {
	Heading,
	HeadingDescription,
	HeadingTitle,
} from "@/components/ui/heading";

type Search = {
	email?: string;
};

export const Route = createFileRoute("/(auth)/recuperar-senha")({
	validateSearch: (search: Record<string, unknown>): Search => ({
		email: typeof search.email === "string" ? search.email : undefined,
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const { email } = Route.useSearch();

	return (
		<React.Fragment>
			<Heading>
				<HeadingTitle>Recuperar senha</HeadingTitle>
				<HeadingDescription>
					Digite seu e-mail para receber um link de recuperação de senha.
				</HeadingDescription>
			</Heading>

			<ForgotPasswordForm email={email} />
		</React.Fragment>
	);
}
