import { z } from "zod";

export const updateProfileSchema = z.object({
	name: z.string().min(1, "Nome é obrigatório"),
	email: z.string().email("E-mail inválido"),
});

export type IUpdateProfile = z.infer<typeof updateProfileSchema>;
