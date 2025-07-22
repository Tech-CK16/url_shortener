import { eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { shortLink } from '../drizzle/schema.js';

export const getAllShortLinks = async () => {
    const links = await db.select().from(shortLink);
    return links;
};

export const getShortLinkByShortCode = async (shortCode) => {
    const [result] = await db
        .select()
        .from(shortLink)
        .where(eq(shortLink.shortCode, shortCode));
    return result;
};

export const insertShortLinks = async ({ url, shortCode }) => {
    const [result] = await db.insert(shortLink).values({ url, shortCode });
    return result;
};
