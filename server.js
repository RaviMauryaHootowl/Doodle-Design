const express = require('express');
const socket = require('socket.io');
const path = require('path');
require('dotenv/config');

const app = express();
const {addUser, removeUser, getUser, getUsersInRoom ,getUserInRoomCount} = require('./users.js');


if(process.env.NODE_ENV=== 'production'){
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log('App started at port');
})

const canvasData = {};
const io = socket(server);
io.sockets.on('connection', (socket) => {
  console.log("New connection made => " + socket.id);
  let userObj;
  
  
  //console.log(canvasData);

  socket.on('newConnection', (data) => {
    console.log(data.roomName + "  ->  " + data.userName);
    const {error, user} = addUser(socket.id,data.roomName, data.userName);
    
    if(error){
        console.log('--------------------------------------');
        console.log(error);
        socket.emit('errorConnection', error);
    }else{

      if(canvasData[user.room] == null){
        canvasData[user.room] = [];
      }
      userObj = user;
      socket.join(user.room);
      io.sockets.in(user.room).emit('canvasData', canvasData[user.room]);

      io.sockets.in(user.room).emit('userChange', getUserInRoomCount(user.room));
    }
  })

  

  socket.on('clearBoard', (data) => {
    if(userObj){
      console.log(userObj);
      canvasData[userObj.room].length = 0;
      io.sockets.in(userObj.room).emit('clearBoard');
    }
  })


  socket.on('draw', (data) => {
    if(userObj){
      canvasData[userObj.room].push(data);
      socket.broadcast.to(userObj.room).emit('draw', data);
    }
  });
  
  socket.on('disconnect', () => {
    removeUser(socket.id);
    if(userObj){
      io.sockets.in(userObj.room).emit('userChange', getUserInRoomCount(userObj.room));
    }
    console.log("User Disconnected");
  })
})