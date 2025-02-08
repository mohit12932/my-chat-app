import express from 'express';
import upload from '../middlewares/multerMiddleware.js';
import signupRoute from './signup.js';
import signinRoute from './signin.js';
import adduserRoute from './adduser.js';
import displayusersRoute from './displayuser.js';
import displaychatRoute from './displaychat.js';

const router = express.Router();

router.use('/signup', upload.single("Profile"), signupRoute);
router.use('/signin', signinRoute);
router.use('/adduser', adduserRoute);
router.use('/displayusers',displayusersRoute);
router.use('/displaychat',displaychatRoute);


export default router;