const jwt = require('jsonwebtoken');
const TokenService = require('./service');
const authHelper = require('./authHelper');
const UserService = require('../User/service');
const { secret, tokens } = require('../../config/secret').jwt;

const updateTokens = (userId) => {
    const accessToken = authHelper.generateAccessToken(userId);
    const refreshToken = authHelper.generateRefreshToken();

    // Проверить возможно перепутал значения
    return authHelper.replaceDbRefreshToken(refreshToken.id, userId)
        .then(() => ({
            accessToken,
            refreshToken: refreshToken.token,
        }));
};

const signIn = (req, res) => {
    const { email, password } = req.body;

    UserService.findByEmailAndPass({ email, password })
        .then((user) => {

            if(!user) {
                res.status(400).json({ message: 'User is not defined' });
            }   

            updateTokens(user._id).then((tokens) => {
                console.log(Object.entries(tokens));
                res.cookie('token', tokens.accessToken, { httpOnly: true });
                res.redirect(301, '/v1/users/');
            });
        });
};

const refreshTokens = (req, res) => {
    const { refreshToken } = req.body;

    let payload;
    try {
        payload = jwt.verify(refreshToken, secret);
        if (payload.type !== 'refresh') {
            res.status(400).json({ message: 'Invalid token!' });
            return;
        }
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            res.status(400).json({ message: 'Token expired!' });
            return;
        } if (e instanceof jwt.JsonWebTokenError) {
            res.status(400).json({ message: 'Involid token!' });
            return;
        }
    }

    TokenService.findByToken({ tokenId: payload.id })
        .then((token) => {
            if (token === null) {
                throw new Error('invalid Token');
            }

            return updateTokens(token.userId);
        })
        .then((tokens) => {
            res.cookie('token', tokens.accessToken, { httpOnly: true });
            res.redirect(301, '/v1/users/');
        })
        .catch((err) => res.status(400).json({ message: err.message }));
};

function loginPage(req, res) {
    res.status(200).render('login.ejs');
}

function refreshPage(req, res) {
    res.status(200).render('refresh.ejs');
}

module.exports = {
    signIn,
    refreshTokens,
    loginPage,
    refreshPage,
};
