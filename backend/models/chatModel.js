import mongoose from "mongoose";

const chatModel = mongoose.Schema(
    {
      chatName: { type: String, trim: true},
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
     /* latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
      isGroupChat: { type: Boolean, default: false },
      groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },*/
    },
    { timestamps: true }
  );
  
 export const Chat = mongoose.model("Chat", chatModel);

