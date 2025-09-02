import crypto from 'crypto';
import {
    getAllShortLinks,
    getShortLinkByShortCode,
    insertShortLinks,
} from '../services/shortener.services.js';

export const getShortenerPage = async (req, res) => {
    try {
        if (!req.user) return res.redirect('/login');
        const links = await getAllShortLinks(req.user.id);
        return res.render('index', { links, host: req.host });
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
            return res.status(400).render('error', {
                title: 'Short Code Already Exists!!',
                message:
                    'The short code you entered is already in use. Please choose a different one.',
            });
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
