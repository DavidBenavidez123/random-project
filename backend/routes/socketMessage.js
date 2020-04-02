module.exports = function (io) {
    const db = require('../database/dbConfig')
    io.on('connection', function (socket) {
        console.log('socket connection established!');
        socket.on('sending message', function (msg) {
            const message = msg.message
            const username = msg.username
            const users_id = msg.users_id
            const text = { users_id, message, username }
            db('messages')
                .insert(text)
                .then(text => {
                    io.emit('sending message', msg);
                })
                .catch(err => {
                    io.emit(err);
                })
        })
    })
};

