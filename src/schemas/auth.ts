import { z } from "zod";

export const signInFormSchema = z.object({
	email: z.string().email("E-mail inválido"),
	password: z.string().min(1, "Senha é obrigatória"),
	rememberMe: z.boolean().optional().default(false),
});

export const refreshTokenFormSchema = z.object({
	refreshToken: z.string().min(1, "Refresh token é obrigatório"),
});

export const forgotPasswordFormSchema = z.object({
	email: z.string().email("E-mail inválido"),
});

export const resetPasswordFormSchema = z
	.object({
		password: z.string().min(1, "Senha é obrigatória"),
		password_confirmation: z
			.string()
			.min(1, "Confirmação de senha é obrigatória"),
	})
	.refine((data) => data.password === data.password_confirmation, {
		message: "As senhas não coincidem",
		path: ["password_confirmation"],
	});

export type ISignIn = z.infer<typeof signInFormSchema>;
export type IRefreshToken = z.infer<typeof refreshTokenFormSchema>;
export type IForgotPassword = z.infer<typeof forgotPasswordFormSchema>;
export type IResetPassword = z.infer<typeof resetPasswordFormSchema>;
