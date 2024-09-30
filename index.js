const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(require('cors')());

const { createServer } = require('http');
const server = createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL },
  connectionStateRecovery: {},
});

const prisma = require('./configs/prisma');

io.on('connection', (socket) => {
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('sendMessage', async (data) => {
    const message = {
      message: data.message,
      authorid: data.author.id,
      roomId: data.roomId,
      timestamp: new Date(),
    };
    try {
      const chat = await prisma.chat.create({
        data: message,
      });
      if (!chat) {
        throw new Error('Failed to add chat message to db');
      }
    } catch (e) {
      throw new Error(e);
    }
    socket.to(data.roomId).emit('getMessage', {
      message: data.message,
      author: data.author,
      timestamp: message.timestamp,
    });
  });

  socket.on('disconnect', () => {});
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

require('./configs/passport');

app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/post', require('./routes/post'));
app.use('/chat', require('./routes/chat'));
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

// app.listen(3000) socket io will not work
server.listen(3000);
