import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { type ISignIn, signInFormSchema } from "@/schemas/auth";

export function SignInForm() {
	const emailId = React.useId();
	const passwordId = React.useId();
	const rememberId = React.useId();

	const [showPassword, setShowPassword] = React.useState(false);

	const [email] = useQueryState("email", parseAsString.withDefault(""));
	const [password] = useQueryState("password", parseAsString.withDefault(""));

	const form = useForm<ISignIn>({
		resolver: zodResolver(signInFormSchema),
		defaultValues: {
			email: email ?? "",
			password: password ?? "",
			rememberMe: false,
		},
	});

	const navigate = useNavigate();
	const { signIn, isLoading } = useAuth();

	const onSubmit = async ({ email, password, rememberMe }: ISignIn) => {
		try {
			await signIn(email, password, rememberMe);
			navigate({ to: "/dashboard" });
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
			<Controller
				control={form.control}
				name="email"
				render={({ field, fieldState }) => (
					<Field>
						<FieldLabel
							htmlFor={emailId}
							schema={signInFormSchema}
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

			<Controller
				control={form.control}
				name="password"
				render={({ field, fieldState }) => (
					<Field>
						<FieldLabel
							htmlFor={passwordId}
							schema={signInFormSchema}
							fieldName="password"
						>
							Senha
						</FieldLabel>
						<FieldContent>
							<div className="relative">
								<Input
									{...field}
									id={passwordId}
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
								/>

								<Button
									className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
									onClick={() => setShowPassword(!showPassword)}
									size="icon"
									type="button"
									variant="ghost"
								>
									{showPassword ? (
										<EyeOffIcon className="size-4 text-muted-foreground" />
									) : (
										<EyeIcon className="size-4 text-muted-foreground" />
									)}
								</Button>
							</div>

							{fieldState.error && (
								<FieldError>{fieldState.error.message}</FieldError>
							)}
						</FieldContent>
					</Field>
				)}
			/>

			<div className="flex items-center justify-between">
				<label
					htmlFor={rememberId}
					className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer"
				>
					<Checkbox
						id={rememberId}
						checked={form.watch("rememberMe")}
						onCheckedChange={(checked) =>
							form.setValue("rememberMe", checked === true)
						}
					/>
					<span>Mantenha conectado</span>
				</label>

				<Link
					to="/recuperar-senha"
					search={{ email: form.watch("email") || undefined }}
					className="text-xs font-medium text-primary hover:underline"
				>
					Esqueceu a senha?
				</Link>
			</div>

			<Button type="submit" disabled={isLoading} className="w-full">
				{isLoading ? (
					<React.Fragment>
						<Spinner />
						Entrando...
					</React.Fragment>
				) : (
					"Entrar"
				)}
			</Button>
		</form>
	);
}
