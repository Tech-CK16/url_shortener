import z from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email({ message: 'Please enter a valid email address' })
        .max(100, { message: 'Email must be at most 100 characters' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' })
        .max(100, { message: 'Password must be at most 100 characters' }),
});

export const registerSchema = loginSchema.extend({
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' })
        .max(100, { message: 'Password must be at most 100 characters' }),
});

