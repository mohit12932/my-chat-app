import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Users } from '../models/userModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const user = await Users.findOne({ emailadress: req.body.emailaddress });

    if (user && await bcrypt.compare(req.body.Password, user.Password)) {
      const my_jwt_secret = process.env.JWT_SECRET;
      const token = jwt.sign({ userId: user._id }, my_jwt_secret,{expiresIn: "20d"});
      return res.status(201).json({ token, user});
    }

    res.status(409).json({ error: "Invalid username or password" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
