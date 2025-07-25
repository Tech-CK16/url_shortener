import { createUser, getUserByEmail } from "../services/auth.services.js";

export const getRegisterPage = (req, res) => {
    return res.render('auth/register');
};

export const getLoginPage = (req, res) => {
    return res.render('auth/login');
};

export const postLogin = async (req, res) => {

    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    if (!user) {
        return res.status(400).render('error', {
            title: 'Invalid Credentials',
            message:
                'The email and password combination you entered is incorrect. Please try again.',
        });
    }

    if (user.password !== password) {
        return res.status(400).render('error', {
            title: 'Invalid Credentials',
            message:
                'The email and password combination you entered is incorrect. Please try again.',
        });
    }

    res.cookie('isLoggedIn', 'true', { path: '/' });
    res.redirect('/');
};

export const postRegister = async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;
    const userExists = await getUserByEmail(email);
    console.log(userExists);

    if (userExists) {
        return res.status(400).render('error', {
            title: 'User Already Exists!!',
            message:
                'The user you entered already exists. Please register with a different email.',
        });
    }

    const [user] = await createUser({ name, email, password });
    console.log(user);

    res.redirect('/login');
};