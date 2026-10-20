const express = sb_publishable_qjceaT7ISr1G3iiFT3HMHQ_-gulYwA2

const app = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5enpjd2Z3dGhyeHdndHd1d2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1MTQ5MjAsImV4cCI6MjEwODA5MDkyMH0.a596YBmxUGG74uKQ3dqD8yU0Ye73hhvQ-VzVnNmG1aE

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: { origin: "*" },
  transports: ['polling'] // Crucial for bypassing school firewall blocks
});
const path = require('path');

const PORT = 3000;

// Serve all static website files from the current folder
app.use(express.static(__dirname));

// Route for the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Manage real-time chat connections, rooms, and messaging
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join public or private rooms
  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    console.log(`User ${socket.id} joined room: ${roomName}`);
  });

  // Handle incoming messages (text, images, gifs, videos)
  socket.on('sendMessage', (data) => {
    // data structure: { room: 'chat1', user: 'name', text: '...', file: '...', fileType: '...' }
    io.to(data.room).emit('receiveMessage', data);
  });

  // Handle private friend requests and invites
  socket.on('sendNotification', (data) => {
    // Target specific users or rooms for invites/friend requests
    socket.broadcast.to(data.target).emit('notification', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

http.listen(PORT, () => {
  console.log(`🚀 Success! Mathcalc server is actively running on port ${PORT}`);
});
