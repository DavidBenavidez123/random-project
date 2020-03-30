const express = require('express');
const router = express.Router();
const db = require('../database/dbConfig')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

function generateToken(user) {
    const jwtPayload = {
        ...user
    };
    const jwtOptions = {
        expiresIn: '1h'
    };
    return jwt.sign(jwtPayload, process.env.JWT_SECRET, jwtOptions);
}
router.get('/', (req, res) => {
    res.send('hello')
})

router.post('/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 10);
    credentials.password = hash;
    db('users')
        .where('email', credentials.email)
        .then(user => {
            if (user === undefined || user.length == 0) {
                return db('users')
                    .insert(credentials)
                    .then(user => {
                        res.status(201).json({ user: user[0] });
                    })
                    .catch(err => {
                        res.status(500).json(err);
                    });
            }
            else {
                res.status(201).json({ err: 'email in use' });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
})

router.post('/login', (req, res) => {
    const creds = req.body;
    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                const token = generateToken(user); // new line
                res.status(200).json({ welcome: user.username, token });
            } else {
                res.status(401).json({ message: 'you shall not pass!' });
            }
        })
        .catch(err => {
            res.status(500).json({ err });
        });
})


function authorizationMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1]
    if (token) {
        console.log(token)
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                // token verification failed
                res.status(401).json({ message: 'invalid token' });
            } else {
                // token is valid
                req.decodedToken = decodedToken; // any sub-sequent middleware of route handler have access to this
                console.log('\n** decoded token information **\n', req.decodedToken);
                next()
            }
        });
    } else {
        res.status(401).json({ message: 'no token provided' });
    }
}


module.exports = router;