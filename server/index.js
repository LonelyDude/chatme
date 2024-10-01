//
const http = require('http');
const express = require('express')
const cors = require('cors')
const PORT = 8080 || 8000
const hostname = `http://www.localhost:${PORT}`
// import http from 'http'
//

//Connect app with express
const app = express()
//Cors
app.use(cors({
  origin: hostname,
  methods: ["GET", "POST"],
  allowedHeaders: ["my-custom-header"],
  credentials: true
}))
//Make a server
const server = http.createServer(app)
//Import sockect.io server
const { Server } = require('socket.io');

const io = new Server(server,)

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Handle chat messages
  socket.on('chat message', (msg) => {
    //
    io.emit('chat message', msg); // Broadcast the message to all connected clients
  });
//Disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

io.engine.on("connection_error", (err) => {
  // console.log(err.req);      // the request object
  // console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  // console.log(err.context);  // some additional error context
});

server.listen(PORT, () => {
  console.log(`WebSocket server listening on ${hostname}`);
});