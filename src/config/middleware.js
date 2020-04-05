const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const methodOverride = require('method-override');
const jwt = require('jsonwebtoken');
const { secret } = require('./secret').jwt;

module.exports = {
    /**
     * @function
     * @description express middleware
     * @param {express.Application} app
     * @returns void
     */
    init(app) {
        app.use(
            bodyParser.urlencoded({
                extended: true,
            }),
        );
        app.use(bodyParser.json());
        // put, delete from client
        app.use(methodOverride('_method'));
        // set template engine ejs
        app.set('view engine', 'ejs');
        // path to views directory
        app.set('views', path.join(`${__dirname}/../views`));
        // parse Cookie header and populate req.cookies with an object keyed by the cookie names.
        app.use(cookieParser());
        // returns the compression middleware
        app.use(compression());
        // helps you secure your Express apps by setting various HTTP headers
        app.use(helmet());
        // providing a Connect/Express middleware that
        // can be used to enable CORS with various options
        app.use(cors());
        // cors
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS ');
            res.header('Access-Control-Allow-Credentials', '*');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With,'
                + ' Content-Type, Accept,'
                + ' Authorization,'
                + ' Access-Control-Allow-Credentials',
            );
            next();
        });
    },

    authMiddleware(req, res, next) {
        const { token } = req.cookies;

        if (!token) {
            res.status(401).json({ message: 'Token not prrovided!' });
        }

        try {
            const payload = jwt.verify(token, secret);
            if (payload.type !== 'access') {
                res.status(401).json({ message: 'invalid token!' });
                return;
            }
        } catch (e) {
            if (e instanceof jwt.TokenExpiredError) {
                res.status(401).json({ message: 'Token expired!' });
                return;
            }
            if (e instanceof jwt.JsonWebTokenError) {
                res.status(401).json({ message: 'Invalid token!' });
                return;
            }
        }

        next();
    },
};
