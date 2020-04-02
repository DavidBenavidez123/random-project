const app = require("./server/server");
const port = process.env.PORT || 5000;
const socket = require('socket.io')

const server = app.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
const io = socket(server)

require('./routes/socketMessage.js')(io);


module.exports = { app, io };