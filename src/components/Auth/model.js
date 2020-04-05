const { Schema } = require('mongoose');
const connections = require('../../config/connection');

const UserSchema = new Schema(
    {
        tokenId: String,
        userId: String,
    },
    {
        collection: 'usertoken',
        versionKey: false,
    },
);

module.exports = connections.model('UserToken', UserSchema);
