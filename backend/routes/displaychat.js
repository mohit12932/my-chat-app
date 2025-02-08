import express from 'express';
import { Message } from '../models/messageModel.js';

const router = express.Router();
let io; // WebSocket instance placeholder

// Initialize WebSocket
export const initializeSocket = (socketIO) => {
  io = socketIO;
};

// Fetch messages between two users
router.post('/', async (req, res) => {
  try {
    const user1 = req.body.user;
    const user2 = req.body.chatUser;

    const myChat = await Message.find({ sender: user1, chat: user2 });
    const friendChat = await Message.find({ sender: user2, chat: user1 });

    res.json({ myChat, friendChat });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Add a new message and broadcast it via WebSocket
router.post('/updatemessage', async (req, res) => {
  try {
    const message = {
      sender: req.body.user._id,
      content: req.body.data.Talks,
      chat: req.body.chatUser._id,
      createdAt: new Date(),
    };

    const chat = new Message(message);
    await chat.save();

    // Broadcast the message via WebSocket
    if (io) {
      io.emit('receive-message', message);
    }

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/updatemessage', async (req, res) => {
  console.log(req);
});

export default router;
