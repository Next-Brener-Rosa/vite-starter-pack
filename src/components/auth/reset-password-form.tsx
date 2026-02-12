import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUserResetPassword } from "@/api/generated/user/user";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { type IResetPassword, resetPasswordFormSchema } from "@/schemas/auth";
import { changePasswordSchema } from "@/schemas/password";
import { onError } from "@/utils/on-error";

export function ResetPasswordForm({
	token,
	email,
}: {
	token?: string;
	email?: string;
}) {
	const passwordId = React.useId();
	const passwordConfirmationId = React.useId();
	const navigate = useNavigate();
	const { signIn } = useAuth();

	const form = useForm<IResetPassword>({
		resolver: zodResolver(resetPasswordFormSchema),
		defaultValues: {
			password: "",
			password_confirmation: "",
		},
	});

	const { mutateAsync: resetPassword, isPending: isPendingResetPassword } =
		useUserResetPassword({
			mutation: {
				onSuccess: (response) => {
					toast.success(response.message);
				},
				onError,
			},
		});

	const onSubmit = async ({
		password,
		password_confirmation,
	}: IResetPassword) => {
		if (!token) {
			toast.error("Token inválido ou ausente.");
			return;
		}

		await resetPassword({
			data: {
				password,
				password_confirmation,
				token,
			},
		});

		if (!email) {
			navigate({ to: "/entrar" });
			return;
		}

		await signIn(email, password, true);
		navigate({ to: "/dashboard" });
	};

	return (
		<div className="space-y-6">
			<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
				<FieldGroup>
					<Controller
						control={form.control}
						name="password"
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel
									htmlFor={passwordId}
									schema={changePasswordSchema}
									fieldName="password"
								>
									Nova senha
								</FieldLabel>
								<FieldContent>
									<PasswordInput
										{...field}
										id={passwordId}
										showStrength={true}
										autoComplete="new-password"
									/>
									{fieldState.error && (
										<FieldError>{fieldState.error.message}</FieldError>
									)}
								</FieldContent>
							</Field>
						)}
					/>

					<Controller
						control={form.control}
						name="password_confirmation"
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel
									htmlFor={passwordConfirmationId}
									schema={changePasswordSchema}
									fieldName="password_confirmation"
								>
									Confirmar nova senha
								</FieldLabel>
								<FieldContent>
									<PasswordInput
										{...field}
										id={passwordConfirmationId}
										showStrength={false}
										autoComplete="password_confirmation"
									/>
									{fieldState.error && (
										<FieldError>{fieldState.error.message}</FieldError>
									)}
								</FieldContent>
							</Field>
						)}
					/>
				</FieldGroup>

				<Button
					type="submit"
					disabled={isPendingResetPassword}
					className="w-full"
				>
					{isPendingResetPassword ? (
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
