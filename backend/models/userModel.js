import mongoose from "mongoose";

const info = new mongoose.Schema({
    Username: {type: String, required: true, unique: true  },
    Profile: {  type: String , default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"  },
    emailadress: {type: String, required: true, unique: true },
    Password: String,
    timezone: { type: String, default: 'UTC' },
   // isAdmin: {type: Boolean,  required: true, default: false}
},
    { timestamps: true }
);

// Ensure timestamps are always in UTC
info.pre('save', function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date(Date.now());
  }
  this.updatedAt = new Date(Date.now());
  next();
});

export const Users = mongoose.model('Users', info);