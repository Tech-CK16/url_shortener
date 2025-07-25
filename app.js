import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { shortenerRoutes } from './routes/shortener.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use(authRoutes);
app.use(shortenerRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
