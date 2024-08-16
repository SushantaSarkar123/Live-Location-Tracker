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
  console.log("Getting into Index.ejs")
  res.render('index');
});

app.get('/in', (req, res) => {
  console.log("Getting into Index.ejs")
  res.render('index');
});


app.get('/intro', (req, res) => {
  console.log("Getting into Index.ejs")
  res.send("hi");
});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});


module.exports = (req, res) => {
  if (req.method === 'GET') {
    app(req, res);
  } else {
    res.status(405).send('Method Not Allowed');
  }
};
