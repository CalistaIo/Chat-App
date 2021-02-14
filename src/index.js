const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const socketio = require('socket.io');
const io = socketio(server);
const Filter = require('bad-words');
const {generateMessage, generateLocationMessage, formatName} = require('./utils/messages.js');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users.js');

const publicDirectoryPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicDirectoryPath));

// let count = 0;

// Listen to event to occur
io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    // socket.emit('message', generateMessage('Welcome!')); // emit to current socket
    // socket.broadcast.emit('message', generateMessage('A new user has joined!')); // emit to all sockets other than current socket

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`));
        } // message is only sent if user leaving is valid
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
        };
        const user = getUser(socket.id);
        io.to(user.room).emit('message', generateMessage(user.username, mesg)); // only emit message if it does not contain any profanities
        callback();
    });

    socket.on('sendLocation', (coordinates, callback) => {
        const user = getUser(socket.id);
        const mesg = 'https://google.com/maps?q=' + coordinates.latitude + ',' + coordinates.longitude;
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, mesg));
        callback();
    });

    socket.on('join', ({username, room}, callback) => {
        // socket.id is unique identifier for connection
        const {error, user} = addUser({
            id: socket.id,
            username,
            room
        });
        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        // socket.emit, io.emit, socket.broadcast.emit
        // io.to.emit, socket.broadcast.to.emit
        socket.emit('message', generateMessage('Admin', 'Welcome!'));
        socket.broadcast.to(room).emit('message', generateMessage('Admin', `${user.username} has joined!`));
        callback();
    });
});

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});
