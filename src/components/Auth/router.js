const jwt = require('jsonwebtoken');
const { Router } = require('express');
const auth = require('../Auth');

/**
 * Express router to mount user related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

router.get('/login', auth.loginPage);

router.get('/refresh', auth.refreshPage);

router.post('/login', auth.signIn);

router.post('/refresh', auth.refreshTokens);

module.exports = router;
