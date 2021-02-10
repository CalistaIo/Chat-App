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

// Listen to event to occur
io.on('connection', () => {
    console.log('New WebSocket connection');
});

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});
