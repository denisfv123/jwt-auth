module.exports = {
    jwt: {
        secret: 'jwtsecret',
        tokens: {
            access: {
                type: 'access',
                expiresIn: '2m',
            },
            refresh: {
                type: 'refresh',
                expiresIn: '5m',
            },
        },
    },
};
