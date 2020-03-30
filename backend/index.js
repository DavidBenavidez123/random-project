const app = require("./server/server");
const port = process.env.PORT || 5000;
const socket = require('socket.io')

const server = app.listen(port, () => console.log(`\n** Running on port ${port} **\n`));

const io = socket(server)

io.on('connection', (socket) => {
    console.log('made socket connection')

    socket.on('disconnect', () => {
        console.log('user had left')
    })
})
module.exports = { app, io };