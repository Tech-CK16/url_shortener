import express from 'express';
import {
    getShortenerPage,
    postUrlShortener,
    getShortCode,
    getShortenerEditPage,
    postShortenerEditPage,
    deleteShortCode
} from '../controllers/urlShortener.controller.js';

const router = express.Router();

router.get('/', getShortenerPage);
router.post('/', postUrlShortener);
router.get('/:shortCode', getShortCode);
router.route('/edit/:id').get(getShortenerEditPage).post(postShortenerEditPage);
router.route('/delete/:id').post(deleteShortCode);
// router.get('/404', (req, res) => {
//     res.status(404).render('404'); // or send your 404 page
// });

export const shortenerRoutes = router;
