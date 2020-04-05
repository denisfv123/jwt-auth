const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const TokenService = require('./service');
const { secret, tokens } = require('../../config/secret').jwt;

const generateAccessToken = (userId) => {
    const payload = {
        userId,
        type: tokens.access.type,
    };
    const options = { expiresIn: tokens.access.expiresIn };

    return jwt.sign(payload, secret, options);
};

const generateRefreshToken = () => {
    const payload = {
        id: uuid(),
        type: tokens.refresh.type,
    };
    const options = { expiresIn: tokens.refresh.expiresIn };

    return {
        id: payload.id,
        token: jwt.sign(payload, secret, options),
    };
};

const replaceDbRefreshToken = (tokenId, userId) => TokenService.replaceToken(userId, tokenId);

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    replaceDbRefreshToken,
};
