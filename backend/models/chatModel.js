import mongoose from "mongoose";

/**
 * Chat Model with UTC timestamp handling
 * Ensures all timestamps are stored in UTC in the database
 */
const chatModel = mongoose.Schema(
    {
      chatName: { type: String, trim: true},
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }],
      createdAt: { type: Date, default: () => new Date(Date.now()), index: true },
      updatedAt: { type: Date, default: () => new Date(Date.now()) },
    },
    { timestamps: false } // Manage timestamps manually for UTC
  );

/**
 * Pre-save hook to ensure all timestamps are in UTC
 */
chatModel.pre('save', function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date(Date.now());
  }
  this.updatedAt = new Date(Date.now());
  
  // Ensure dates are Date objects, not strings
  if (typeof this.createdAt === 'string') {
    this.createdAt = new Date(this.createdAt);
  }
  if (typeof this.updatedAt === 'string') {
    this.updatedAt = new Date(this.updatedAt);
  }
  
  next();
});

// Index for efficient sorting by creation date
chatModel.index({ createdAt: -1 });
  
export const Chat = mongoose.model("Chat", chatModel);

