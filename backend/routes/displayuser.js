import express from 'express';
import { Chat } from '../models/chatModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const chat = await Chat.find({users:req.body._id}).populate('users', '-Password -__v');
        const secondUsers = chat.map(chat => {  return chat.users.find(user => user._id.toString() !== req.body._id);});
       res.json(secondUsers);
      } catch (err) {
        res.status(500).send(err);
      }
});

export default router;