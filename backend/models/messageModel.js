import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
      content: { type: String, trim: true },
      chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
      messageType: { type: String, enum: ['text', 'image', 'file', 'emoji'], default: 'text' },
      attachment: {
        type: new mongoose.Schema({
          url: String,
          filename: String,
          type: String,
          size: Number,
          thumbnailUrl: String
        }, { _id: false }),
        default: null
      },
      downloadedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
      isFileUrl: { type: Boolean, default: false },
      senderTimezone: { type: String, default: 'UTC' }, // Store sender's timezone for context
      createdAt: { type: Date, default: () => new Date(Date.now()), index: true },
      updatedAt: { type: Date, default: () => new Date(Date.now()) },
    },
    { timestamps: false } // We manage timestamps manually for UTC
  );

  // Ensure timestamps are always in UTC
  messageSchema.pre('save', function(next) {
    if (!this.createdAt) {
      this.createdAt = new Date(Date.now());
    }
    this.updatedAt = new Date(Date.now());
    
    // Ensure all dates are valid Date objects
    if (typeof this.createdAt === 'string') {
      this.createdAt = new Date(this.createdAt);
    }
    if (typeof this.updatedAt === 'string') {
      this.updatedAt = new Date(this.updatedAt);
    }
    
    next();
  });

  // Index for efficient querying by chat and creation date
  messageSchema.index({ chat: 1, createdAt: -1 });
  
  export const Message = mongoose.model("Message", messageSchema);