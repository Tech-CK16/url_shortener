import {
    comparePassword,
    createUser,
    generateToken,
    getUserByEmail,
    hashPassword,
} from '../services/auth.services.js';

export const getRegisterPage = (req, res) => {
    if (req.user)
        return res.redirect('/');
    return res.render('auth/register');
};

export const getLoginPage = (req, res) => {
    if (req.user)
        return res.redirect('/');
    return res.render('auth/login');
};

export const postLogin = async (req, res) => {
    if (req.user)
        return res.redirect('/');

    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    if (!user) {
        return res.status(400).render('error', {
            title: 'Invalid Credentials',
            message:
                'The email and password combination you entered is incorrect. Please try again.',
        });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).render('error', {
            title: 'Invalid Credentials',
            message:
                'The email and password combination you entered is incorrect. Please try again.',
        });
    }

    // res.cookie('isLoggedIn', 'true', { path: '/' });
    const token = generateToken({
        id: user.id,
        name: user.name,
        email: user.email,
    });
    res.cookie('access_token', token);

    res.redirect('/');
};

export const postRegister = async (req, res) => {
    if (req.user)
        return res.redirect('/');

    const { name, email, password } = req.body;
    const userExists = await getUserByEmail(email);

    if (userExists) {
        return res.status(400).render('error', {
            title: 'User Already Exists!!',
            message:
                'The user you entered already exists. Please register with a different email.',
        });
    }

    const hashedPassword = await hashPassword(password);

    const [user] = await createUser({ name, email, password: hashedPassword });
    console.log(user);

    res.redirect('/login');
};

export const getMe = async (req, res) => {
    if (!req.user)
        return res.status(401).send('Unauthorized.. you are not logged in');
    return res.send(`<h1>Hey ${req.user.name} - ${req.user.email}</h1>`);
};

export const logoutUser = async (req, res) => {
    res.clearCookie('access_token');
    res.redirect('/login');
};