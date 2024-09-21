//
const express = require('express');
const cors = require('cors');
const http = require('http');
const PORT = 6000 || 6010;

const hostname = `http://www.localhost:${PORT}`;

const app = express();

// app.use(
//   cors({
//     origin: hostname,
//     methods: ['GET, POST'],
//     allowedHeaders: ['my-custom-header'],
//     credentials: true,
//   })
// );

//Sending messages to cliente side
app.get('/', (req, res) => {
  res.send('HELLO BACKEND');
  console.log('HI THERE');
});

// const { Server } = require('socket.io');

// const server = http.createServer(app);

//
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server);
//
io.on('connection', (socket) => {
  console.log('A user connected');
  //Handle messages
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  //Disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  //
  io.engine('connection_error', (err) => {
    console.log(err.message);
  });
});

//listening
app.listen(PORT, () => {
  console.log(`Listening to ${hostname}`);
});