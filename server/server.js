const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));


io.on('connection', (socket) => {
  console.log('new user connected');
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined!'));

  socket.on('createMessage', (message, callback) => {
    console.log('Create message: ', message);
    io.emit('newMessage', generateMessage(message.from, message.message));
    callback();
  });
  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });
  socket.on('disconnect', () => {
    console.log('User was disconnected');
  })
});

server.listen(port, () => {
  console.log(`server is up on port ${port}!`);
});
