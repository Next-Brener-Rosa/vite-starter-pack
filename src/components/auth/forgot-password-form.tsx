import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUserForgotPassword } from "@/api/generated/user/user";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { forgotPasswordFormSchema, type IForgotPassword } from "@/schemas/auth";
import { onError } from "@/utils/on-error";

export function ForgotPasswordForm({ email }: { email?: string }) {
	const emailId = React.useId();
	const navigate = useNavigate();

	const form = useForm<IForgotPassword>({
		resolver: zodResolver(forgotPasswordFormSchema),
		defaultValues: {
			email: email ?? "",
		},
	});

	const { mutateAsync: forgotPassword, isPending: isPendingForgotPassword } =
		useUserForgotPassword({
			mutation: {
				onSuccess: (response) => {
					toast.success(response.message);
				},
				onError,
			},
		});

	const onSubmit = async ({ email }: IForgotPassword) => {
		await forgotPassword({
			data: {
				email,
			},
		});
	};

	return (
		<div className="space-y-6">
			<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
				<Controller
					control={form.control}
					name="email"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel
								htmlFor={emailId}
								schema={forgotPasswordFormSchema}
								fieldName="email"
							>
								E-mail
							</FieldLabel>
							<FieldContent>
								<Input
									{...field}
									id={emailId}
									type="email"
									autoComplete="email"
								/>
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</FieldContent>
						</Field>
					)}
				/>

				<Button
					type="submit"
					disabled={isPendingForgotPassword}
					className="w-full"
				>
					{isPendingForgotPassword ? (
						<React.Fragment>
							<Spinner />
							Enviando...
						</React.Fragment>
					) : (
						"Enviar"
					)}
				</Button>
			</form>

			<Separator />

			<Button
				variant="ghost"
				className="w-full"
				onClick={() => navigate({ to: "/entrar" })}
			>
				Voltar para o login
			</Button>
		</div>
	);
}
