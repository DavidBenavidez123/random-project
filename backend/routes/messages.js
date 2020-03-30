const express = require('express');
const router = express.Router();
const db = require('../database/dbConfig')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()



router.get('/', (req, res) => {
    db('messages')
        .join('users', 'users.users_id', 'messages.users_id')
        .select('message', 'username', 'created_at', 'updated_at')
        .then(messages => {
            res.send({ messages })
        })
        .catch(err => {
            res.send({ err })
        })
})

router.post('/send', authorizationMiddleware, (req, res) => {
    const message = req.body.message
    const users_id = req.decodedToken.users_id
    const text = { users_id, message }
    console.log(text)
    db('messages')
        .insert(text)
        .then(text => {
            res.send({ text: text[0] })
        })
        .catch(err => {
            res.send({ err })
        })
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