const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));


io.on('connection', (socket) => {
  console.log('new user connected');

  // listen join event
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name & room name are required!');
    }

    const user = users.getUserByName(params.name, params.room);
    if (user) {
      return callback('User already joined this room!');
    }
    // add new user
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);


    // join room
    socket.join(params.room);
    // send message to user who has joined
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
    // send message to every one in this room
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined!`));

    // update user list
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    return callback();
  });

  // listen create message event
  socket.on('createMessage', (message, callback) => {
    console.log('Create message: ', message);
    const user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.message));
    }
    callback();
  });

  // listen create location message event
  socket.on('createLocationMessage', (coords) => {
    const user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  // listen disconnect event
  socket.on('disconnect', () => {
    console.log('User was disconnected');
    // remove user
    const user = users.removeUser(socket.id);
    if (user) {
      // update user list
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      // send message to every one in this room
      socket.broadcast.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left!`));
    }
  });
});

server.listen(port, () => {
  console.log(`server is up on port ${port}!`);
});
