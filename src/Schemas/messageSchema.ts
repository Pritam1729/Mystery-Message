import {z} from 'zod';

export const messageSchema = z.object({
    context: z
    .string()
    .min(10,{message: 'Content must be atleast of 10 character'})
    .max(300,{message : "content must be no longer than 300 character"}),
})