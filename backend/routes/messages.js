
const express = require('express');
const router = express.Router();
const db = require('../database/dbConfig')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()


router.get('/', (req, res) => {
    db('messages')
        .orderBy('created_at', 'desc')
        .limit(10)
        .then(messages => {
            messages.reverse()
            res.send({ messages })
        })
        .catch(err => {
            res.send({ err })
        })
})

router.post('/scroll', (req, res) => {
    const { data } = req.body
    console.log(data)
    db('messages')
        .orderBy('created_at', 'desc')
        .limit(10)
        .offset(data)
        .then(messages => {
            messages.reverse()
            res.send({ messages })
        })
        .catch(err => {
            res.send({ err })
        })
})



function authorizationMiddleware(req, res, next) {
    const authHeader = req.body.headers.Authorization;
    const token = authHeader
    console.log(token)
    if (token) {
        console.log(token)
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                // token verification failed
                res.json({ message: 'invalid token' });
            } else {
                // token is valid
                req.decodedToken = decodedToken; // any sub-sequent middleware of route handler have access to this
                console.log('\n** decoded token information **\n', req.decodedToken);
                next()
            }
        });
    } else {
        res.json({ message: 'no token provided' });
    }
}

module.exports = router


