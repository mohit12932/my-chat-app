import express from 'express';
import bcrypt from 'bcryptjs';
import { Users } from '../models/userModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const existingUsername = await Users.findOne({ Username: req.body.Username });
    const existingEmail = await Users.findOne({ emailadress: req.body.emailadress });
    if (existingUsername) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    if (existingEmail) {
      return res.status(409).json({ error: 'Email address already exists' });
    }

    req.body.Password = req.body.ConfirmPassword = await bcrypt.hash(req.body.Password, 10);

    const users = new Users(req.body);
    await users.save();
    res.status(201).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
