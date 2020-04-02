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
                    return db('messages')
                        .where('messages_id', text[0])
                        .then(text => {
                            console.log(text[0])
                            io.emit('sending message', text[0]);
                        })
                        .catch(err => {
                            io.emit(err);
                        })
                })
                .catch(err => {
                    io.emit(err);
                })
        })
    })
};

