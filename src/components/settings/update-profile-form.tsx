import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { UserResource } from "@/api/generated/models/userResource";
import {
	useUserUpdateProfile,
	useUserUploadAvatar,
} from "@/api/generated/user/user";
import { AvatarUploader } from "@/components/ui/avatar-uploader";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { type IUpdateProfile, updateProfileSchema } from "@/schemas/profile";
import { onError } from "@/utils/on-error";

export function UpdateProfileForm() {
	const nameId = React.useId();
	const emailId = React.useId();

	const { user, setUser } = useAuth();
	const [avatarBlob, setAvatarBlob] = React.useState<Blob | null>(null);
	const [avatarPreviewUrl, setAvatarPreviewUrl] = React.useState<string | null>(
		null,
	);

	React.useEffect(() => {
		return () => {
			if (avatarPreviewUrl?.startsWith("blob:")) {
				URL.revokeObjectURL(avatarPreviewUrl);
			}
		};
	}, [avatarPreviewUrl]);

	const form = useForm<IUpdateProfile>({
		resolver: zodResolver(updateProfileSchema),
		defaultValues: {
			name: user?.name ?? "",
			email: user?.email ?? "",
		},
	});

	React.useEffect(() => {
		form.reset({
			name: user?.name ?? "",
			email: user?.email ?? "",
		});
	}, [user?.name, user?.email, form]);

	const { mutateAsync: updateProfile, isPending } = useUserUpdateProfile({
		mutation: {
			onSuccess: (response) => {
				toast.success(response.message);
			},
			onError,
		},
	});

	const { mutateAsync: uploadAvatar, isPending: isPendingUploadAvatar } =
		useUserUploadAvatar({
			mutation: {
				onError,
			},
		});

	const isSubmitting = isPending || isPendingUploadAvatar;

	const onSubmit = async ({ name, email }: IUpdateProfile) => {
		if (avatarBlob) {
			await uploadAvatar({
				data: {
					avatar: avatarBlob,
				},
			});

			if (user && avatarPreviewUrl) {
				setUser({
					...user,
					full_path_profile_picture: avatarPreviewUrl,
				});
			}
		}

		const response = await updateProfile({
			data: {
				name,
				email,
			},
		});

		if (user) {
			const updatedUser: UserResource = {
				...user,
				...response.data,
				full_path_profile_picture:
					avatarPreviewUrl ??
					response.data.full_path_profile_picture ??
					undefined,
			};
			setUser(updatedUser);
		}

		setAvatarBlob(null);
	};

	return (
		<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
			<div className="flex items-center gap-6">
				<AvatarUploader
					value={avatarPreviewUrl ?? user?.full_path_profile_picture ?? null}
					onChange={(blob) => {
						setAvatarBlob(blob);
						setAvatarPreviewUrl((prev) => {
							if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
							return blob ? URL.createObjectURL(blob) : null;
						});
					}}
					isLoading={isSubmitting}
					size="lg"
				/>

				<div className="min-w-0 flex flex-col gap-1.5">
					<Label>Foto do perfil</Label>
					<p className="text-xs text-muted-foreground">
						Clique para enviar e recortar uma imagem
					</p>
				</div>
			</div>

			<FieldGroup>
				<Controller
					control={form.control}
					name="name"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel
								htmlFor={nameId}
								schema={updateProfileSchema}
								fieldName="name"
							>
								Nome
							</FieldLabel>
							<FieldContent>
								<Input {...field} id={nameId} autoComplete="name" />
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</FieldContent>
						</Field>
					)}
				/>

				<Controller
					control={form.control}
					name="email"
					render={({ field, fieldState }) => (
						<Field>
							<FieldLabel
								htmlFor={emailId}
								schema={updateProfileSchema}
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
			</FieldGroup>

			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? (
					<React.Fragment>
						<Spinner />
						Salvando...
					</React.Fragment>
				) : (
					"Salvar alterações"
				)}
			</Button>
		</form>
	);
}
