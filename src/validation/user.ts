import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(3).max(25),
    email: z.string().email(),
    password: z.string().min(6).max(255)
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(255)
})