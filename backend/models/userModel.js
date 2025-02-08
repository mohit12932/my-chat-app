import mongoose from "mongoose";

const info = new mongoose.Schema({
    Username: {type: String, required: true, unique: true  },
    Profile: {  type: String , default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"  },
    emailadress: {type: String, required: true, unique: true },
    Password: String,
   // isAdmin: {type: Boolean,  required: true, default: false}
},
    { timestamps: true }
);

export const Users = mongoose.model('Users', info);