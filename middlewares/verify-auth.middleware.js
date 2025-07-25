import { verifyJwtToken } from '../services/auth.services.js';

export const verifyAuthentication = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        req.user = null;
        return next();
    }
    try {
        const decodedToken = verifyJwtToken(token);
        if (!decodedToken) {
            req.user = null;
        } else {
            req.user = decodedToken;
            console.log(`verifyAuthentication triggered on path: ${req.path}`);
            console.log('Request User:', req.user);
        }
    } catch (error) {
        console.error('JWT verification failed:', error.message);
        req.user = null;
    }

    return next();
};
