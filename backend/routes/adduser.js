import express from 'express';
import { Users } from '../models/userModel.js';
import { Chat } from '../models/chatModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try{ const accountholder = req.body.user;
        const user = await Users.findOne({ Username: req.body.Friends });
        const messages = await Chat.findOne({ chatName: req.body.Friends });

        if (user && req.body.Friends!=accountholder) { 
          if (messages && messages.users.some(userEntry =>userEntry._id.toString() === user._id.toString()&&
          messages.users.some(profileEntry => profileEntry._id.toString() === accountholder))){
            console.log(messages)
            res.status(409).json({ error: "User already exist" })
            return;
             }
            res.status(201).json(user)
            return;
           }
         res.status(409).json({ error: "No user Found" }); 
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
})
router.post('/add', async (req, res) => {
     try{ const chat={
        chatName: req.body.Friend.Username,
         users: [req.body.user._id,req.body.Friend._id]
      }
      const messages =new Chat(chat);
      await messages.save();
      res.status(201).json(messages);
      }catch (error) {6+
        res.status(500).json({ error: 'Internal Server Error' });
      }
})
export default router;





