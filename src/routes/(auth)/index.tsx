import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

import { SignInForm } from "@/components/auth/sign-in-form";
import {
	Heading,
	HeadingDescription,
	HeadingTitle,
} from "@/components/ui/heading";

export const Route = createFileRoute("/(auth)/")({
	component: SignInPage,
});

function SignInPage() {
	return (
		<React.Fragment>
			<Heading>
				<HeadingTitle>Faça login na sua conta</HeadingTitle>
				<HeadingDescription>
					Bem-vindo de volta! Por favor, insira suas credenciais para acessar
					sua conta.
				</HeadingDescription>
			</Heading>

			<SignInForm />
		</React.Fragment>
	)
}
