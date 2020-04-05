const TokenModel = require('./model');

function findByToken(tokenId) {
    return TokenModel.findOne(tokenId).exec();
}

function findUserUpdate(profile, update) {
    return TokenModel.findOneAndUpdate(profile, update);
}

function replaceToken(userId, tokenId) {
    return TokenModel.findOneAndRemove({ userId }).exec()
        .then(() => TokenModel.create({ tokenId, userId }));
}


module.exports = {
    findByToken,
    replaceToken,
    findUserUpdate,
};
