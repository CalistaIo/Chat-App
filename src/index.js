const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const socketio = require('socket.io');
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicDirectoryPath));

// let count = 0;

// Listen to event to occur
io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    socket.emit('message', 'Welcome!'); // emit to current socket
    socket.broadcast.emit('message', 'A new user has joined!'); // emit to all sockets other than current socket

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!');
    });
    // socket.emit('countUpdated', count);

    // socket.on('increment', () => {
    //     count++;
    //     // socket.emit('countUpdated', count);
    //     // use io.emit() instead of socket.emit() to emit event to all clients in real time
    //     io.emit('countUpdated', count);
    // });

    socket.on('sendMessage', (mesg) => {
        io.emit('message', mesg);
    });

    socket.on('sendLocation', (coordinates) => {
        const mesg = 'https://google.com/maps?q=' + coordinates.latitude + ',' + coordinates.longitude;
        io.emit('message', mesg);
    });
});

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});
