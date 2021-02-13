const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const socketio = require('socket.io');
const io = socketio(server);
const Filter = require('bad-words');
const {generateMessage, generateLocationMessage} = require('./utils/messages.js');

const publicDirectoryPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicDirectoryPath));

// let count = 0;

// Listen to event to occur
io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    // socket.emit('message', generateMessage('Welcome!')); // emit to current socket
    // socket.broadcast.emit('message', generateMessage('A new user has joined!')); // emit to all sockets other than current socket

    socket.on('disconnect', () => {
        io.emit('message', generateMessage(`A user has left!`));
    });
    // socket.emit('countUpdated', count);

    // socket.on('increment', () => {
    //     count++;
    //     // socket.emit('countUpdated', count);
    //     // use io.emit() instead of socket.emit() to emit event to all clients in real time
    //     io.emit('countUpdated', count);
    // });

    socket.on('sendMessage', (mesg, callback) => {
        const filter = new Filter();
        if (filter.isProfane(mesg)) {
            return callback('Profanity is not allowed!');
        }
        io.to('101').emit('message', generateMessage(mesg)); // only emit message if it does not contain any profanities
        callback();
    });

    socket.on('sendLocation', (coordinates, callback) => {
        const mesg = 'https://google.com/maps?q=' + coordinates.latitude + ',' + coordinates.longitude;
        io.emit('locationMessage', generateLocationMessage(mesg));
        callback();
    });

    socket.on('join', ({username, room}) => {
        socket.join(room);

        // socket.emit, io.emit, socket.broadcast.emit
        // io.to.emit, socket.broadcast.to.emit
        socket.emit('message', generateMessage('Welcome!'));
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`));
    });
});

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});
