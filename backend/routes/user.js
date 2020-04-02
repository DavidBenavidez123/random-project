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
        .orWhere('username', credentials.username)
        .then(user => {
            if (user === undefined || user.length == 0) {
                return db('users')
                    .insert(credentials)
                    .then(user => {
                        res.json({ user: user[0] });
                    })
                    .catch(err => {
                        res.json(err);
                    });
            }
            else if (user[0].email === credentials.email && user[0].username === credentials.username) {
                res.json({ emailErr: 'email taken', usernameErr: 'username taken' });
            }
            else if (user[0].email === credentials.email && user[0].username !== credentials.username && (user[1] === undefined)) {
                res.json({ emailErr: 'email taken' });
            }
            else if (user[0].email === credentials.email && user[0].username !== credentials.username && (user[1] === undefined)) {
                res.json({ usernameErr: 'username taken' });
            }
            else if (user[0].email !== credentials.email && user[0].username === credentials.username && (user[1] === undefined)) {
                res.json({ usernameErr: 'username taken' });
            }
            else if ((user[0].username === credentials.username || user[0].email === credentials.email) && (user[1].username === credentials.username || user[1].email === credentials.email)) {
                res.json({ emailErr: 'email taken', usernameErr: 'username taken' });
            }
        })
        .catch(err => {
            res.json({ err });
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
                res.json({ welcome: user.username, token });
            } else {
                res.json({ message: 'Incorrect Password or email' });
            }
        })
        .catch(err => {
            res.json({ err });
        });
})

router.get('/userData', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                // token verification failed
                res.json({ message: 'invalid token' });
            } else {
                // token is valid
                req.decodedToken = decodedToken; // any sub-sequent middleware of route handler have access to this
                console.log('\n** decoded token information **\n', req.decodedToken);
                const data = { user_id: req.decodedToken.users_id, userName: req.decodedToken.username }
                res.json({ data });
            }
        });
    } else {
        res.json({ message: 'no token provided' });
    }
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