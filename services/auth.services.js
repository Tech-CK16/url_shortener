import { eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { usersTable } from '../drizzle/schema.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export const getUserByEmail = async (email) => {
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));
    return user;
};

export const createUser = async ({ name, email, password }) => {
    return await db
        .insert(usersTable)
        .values({ name, email, password })
        .$returningId();
};

export const hashPassword = async (password) => {
    // return await bcrypt.hash(password, 10);
    return await argon2.hash(password);
};

export const comparePassword = async (password, hash) => {
    // return await bcrypt.compare(password, hash);
    return await argon2.verify(hash, password);
};

export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

export const verifyJwtToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};