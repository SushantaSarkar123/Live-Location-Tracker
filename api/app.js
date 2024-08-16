const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Setup view engine
app.set('view engine', 'ejs');

// Socket.io setup
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('send-location', (data) => {
    console.log('Received location:', data);
    io.emit('receive-location', { id: socket.id, ...data });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    io.emit('user-disconnected', socket.id);
  });
});

// Route handling
app.get('/', (req, res) => {
  res.render('index');
});
// app.get('/in', (req, res) => {
//   res.render('in');
// });


server.listen(3000, "localhost", () => {
  console.log(`Server running at http://localhost:3000/`);
});
//// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

module.exports = (req, res) => {
  if (req.method === 'GET') {
    app(req, res);
  } else {
    res.status(405).send('Method Not Allowed');
  }
};
////

// module.exports = (req, res) => {
//   if (req.method === 'GET') {
//     return app(req, res);
//   } else {
//     return res.status(405).send('Method Not Allowed');
//   }
// };


// const express = require('express');
// const app = express();

// app.get('/', (req, res) => {
//     console.log("hi");
//   res.send('Hello World');
// });

// module.exports = (req, res) => {
//   app(req, res);
// };