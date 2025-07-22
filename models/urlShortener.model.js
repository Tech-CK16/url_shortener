// import { readFile, writeFile } from 'fs/promises';
// import path from 'path';

// const DATA_FILE = path.join("data", "links.json")

// export const loadLinks = async () => {
//     try {
//         const data = await readFile(DATA_FILE, 'utf-8');
//         return JSON.parse(data);
//     } catch (error) {
//         if (error.code === "ENOENT") {
//             await writeFile(DATA_FILE, JSON.stringify({}));
//             return {};
//         }
//         throw error
//     }
// }

// export const saveLinks = async (links) => {
//     try {
//         await writeFile(DATA_FILE, JSON.stringify(links), 'utf-8');
//     } catch (error) {
//         throw error
//     }
// }

// import { dbClient } from '../config/db-client.js';
// import { env } from '../config/env.js';

// const db = dbClient.db(env.MONGODB_DB_NAME);
// const shortenerCollection = db.collection("shorteners");

// import {db} from '../config/db.js';

// export const loadLinks = async () => {
//     // return shortenerCollection.find({}).toArray();
//     const [rows] = await db.execute(`select * from short_links`);
//     console.log(rows);
//     return rows;
// }

// export const saveLinks = async ({url, shortCode}) => {
//     // shortenerCollection.insertOne(link);
//     const [result] = await db.execute(`insert into short_links (url, short_code) values (?, ?)`, [url, shortCode]);
//     return result;
// }

// export const getLinkByShortCode = async (shortCode) => {
//     // return await shortenerCollection.findOne({shortCode: shortCode});
//     const [result] = await db.execute(`select * from short_links where short_code = ?`, [shortCode]);
//     console.log("create:",result);
//     if (result.length > 0) {
//         return result[0];
//     } else {
//         return null;
//     }
// }
