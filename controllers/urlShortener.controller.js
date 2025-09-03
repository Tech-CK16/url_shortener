import crypto from 'crypto';
import {
    getAllShortLinks,
    getShortLinkByShortCode,
    insertShortLinks,
    findShortLinkById,
    updateShortCode,
    deleteShortCodeById
} from '../services/shortener.services.js';
import z from 'zod';

export const getShortenerPage = async (req, res) => {
    try {
        if (!req.user) return res.redirect('/login');
        const links = await getAllShortLinks(req.user.id);
        return res.render('index', {
            links,
            host: req.host,
            errors: req.flash('error'),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

export const postUrlShortener = async (req, res) => {
    try {
        if (!req.user) return res.redirect('/login');
        const { url, shortCode } = req.body;
        const finalShortCode =
            shortCode || crypto.randomBytes(4).toString('hex');

        const link = await getShortLinkByShortCode(finalShortCode);

        console.log('abc:', link);

        if (link) {
            // Render the EJS template instead of sending HTML string
            // return res.status(400).render('error', {
            //     title: 'Short Code Already Exists!!',
            //     message:
            //         'The short code you entered is already in use. Please choose a different one.',
            // });
            req.flash(
                'error',
                'URL with that shortcode already exists, please choose another'
            );
            return res.redirect('/');
        }

        await insertShortLinks({
            url,
            shortCode: finalShortCode,
            userId: req.user.id,
        });

        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

export const getShortCode = async (req, res) => {
    try {
        const { shortCode } = req.params;
        const link = await getShortLinkByShortCode(shortCode);

        if (!link) return res.status(404).render('404');

        return res.redirect(link.url);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
};

export const getShortenerEditPage = async (req, res) => {
    if (!req.user) return res.redirect('/login');

    const parsed = z.coerce.number().int().safeParse(req.params.id);
    if (!parsed.success) {
        return res.status(404).render('404');
    }

    const id = parsed.data;

    try {
        const shortLink = await findShortLinkById(id);
        if (!shortLink) return res.status(404).render('404');

        return res.render('edit-shortlink', {
            id: shortLink.id,
            url: shortLink.url,
            shortCode: shortLink.shortCode,
            errors: req.flash('error'),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
};

export const postShortenerEditPage = async (req, res) => {
    if (!req.user) return res.redirect('/login');

    const parsed = z.coerce.number().int().safeParse(req.params.id);
    if (!parsed.success) {
        return res.status(404).render('404');
    }
    const id = parsed.data;

    try {
        const { url, shortCode } = req.body;

        const newUpdateShortCode = await updateShortCode({
            id,
            url,
            shortCode,
        });

        if (!newUpdateShortCode) {
            return res.redirect('/404');
        }

        res.redirect('/');
    } catch (err) {
        console.error('Update error:', err);

        // Drizzle wraps MySQL errors inside `cause`
        const mysqlError = err.cause || err;

        if (mysqlError.code === 'ER_DUP_ENTRY') {
            console.log('Duplicate entry caught! Redirecting...');
            req.flash(
                'error',
                'Shortcode already exists, please choose another'
            );
            return res.redirect(`/edit/${id}`);
        }

        return res.status(500).send('Internal server error');
    }
};

export const deleteShortCode = async (req, res) => {
    try {
        const parsed = z.coerce.number().int().safeParse(req.params.id);

        if (!parsed.success) {
            return res.redirect('/404');
        }

        const id = parsed.data;

        await deleteShortCodeById(id);

        return res.redirect('/');
    } catch (err) {
        console.error('Delete error:', err);
        return res.status(500).send('Internal server error');
    }
};
