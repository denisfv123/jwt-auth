const { Schema } = require('mongoose');
const connections = require('../../config/connection');

const UserSchema = new Schema(
    {
        password: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: true,
        },
    },
    {
        collection: 'usermodel',
        versionKey: false,
    },
);

module.exports = connections.model('UserModel', UserSchema);
