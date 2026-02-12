import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useUserChangePassword } from "@/api/generated/user/user";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { changePasswordSchema, type IChangePassword } from "@/schemas/password";
import { onError } from "@/utils/on-error";

export function ChangePasswordForm() {
	const currentPasswordId = React.useId();
	const newPasswordId = React.useId();
	const confirmPasswordId = React.useId();

	const form = useForm<IChangePassword>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			current_password: "",
			new_password: "",
			new_password_confirmation: "",
		},
	});

	const { mutateAsync: changePassword, isPending } = useUserChangePassword({
		mutation: {
			onSuccess: (response) => {
				toast.success(response.message);
			},
			onError,
		},
	});

	const onSubmit = async (values: IChangePassword) => {
		await changePassword({
			data: values,
		});

		form.reset({
			current_password: "",
			new_password: "",
			new_password_confirmation: "",
		});
	};

	return (
		<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
			<FieldGroup>
				<Controller
					control={form.control}
					name="current_password"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel
								htmlFor={currentPasswordId}
								schema={changePasswordSchema}
								fieldName="current_password"
							>
								Senha atual
							</FieldLabel>
							<FieldContent>
								<PasswordInput
									{...field}
									id={currentPasswordId}
									showStrength={false}
									autoComplete="current-password"
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
					name="new_password"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel
								htmlFor={newPasswordId}
								schema={changePasswordSchema}
								fieldName="new_password"
							>
								Nova senha
							</FieldLabel>
							<FieldContent>
								<PasswordInput
									{...field}
									id={newPasswordId}
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
					name="new_password_confirmation"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel
								htmlFor={confirmPasswordId}
								schema={changePasswordSchema}
								fieldName="new_password_confirmation"
							>
								Confirmar nova senha
							</FieldLabel>
							<FieldContent>
								<PasswordInput
									{...field}
									id={confirmPasswordId}
									showStrength={false}
									autoComplete="new-password"
								/>
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</FieldContent>
						</Field>
					)}
				/>
			</FieldGroup>

			<Button type="submit" disabled={isPending}>
				{isPending ? (
					<React.Fragment>
						<Spinner />
						Salvando...
					</React.Fragment>
				) : (
					"Atualizar senha"
				)}
			</Button>
		</form>
	);
}
