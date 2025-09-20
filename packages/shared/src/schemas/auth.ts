import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  confirmPassword: z.string().min(6, { message: "Confirm your password" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"]
});

export type RegisterInput = z.infer<typeof registerSchema>;
