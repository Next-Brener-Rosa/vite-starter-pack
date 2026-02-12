import { z } from "zod";

export const changePasswordSchema = z
	.object({
		current_password: z
			.string()
			.min(1, "Senha atual é obrigatória")
			.min(8, "A senha atual deve ter no mínimo 8 caracteres"),
		new_password: z
			.string()
			.min(1, "Nova senha é obrigatória")
			.min(8, "A nova senha deve ter no mínimo 8 caracteres"),
		new_password_confirmation: z
			.string()
			.min(1, "Confirmação de senha é obrigatória")
			.min(8, "A confirmação deve ter no mínimo 8 caracteres"),
	})
	.refine((data) => data.new_password === data.new_password_confirmation, {
		message: "As senhas não coincidem",
		path: ["new_password_confirmation"],
	});

export type IChangePassword = z.infer<typeof changePasswordSchema>;
