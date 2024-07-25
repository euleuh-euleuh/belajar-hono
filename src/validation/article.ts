import { z } from "zod";

export const articleSchema = z.object({
    title: z.string().min(3).max(25),
    content: z.string().min(10).max(255),
    userId: z.coerce.number().positive()
})