import express from 'express';
import { Message } from '../models/messageModel.js';

const router = express.Router();
let io; // WebSocket instance placeholder

// Initialize WebSocket
export const initializeSocket = (socketIO) => {
  io = socketIO;
};

// Utility: Get current UTC timestamp
const getCurrentUTCTimestamp = () => new Date().toISOString();

// Utility: Format UTC date
const formatUTCDate = (date) => {
  if (!date) return getCurrentUTCTimestamp();
  const d = new Date(date);
  return isNaN(d.getTime()) ? getCurrentUTCTimestamp() : d.toISOString();
};

// Detect message type based on content
const detectMessageType = (content) => {
  if (!content) return 'text';
  
  // Check if it's a URL (Cloudinary or common file URL patterns)
  if (content.match(/https?:\/\/.+\.(jpg|jpeg|png|gif|webp|pdf|doc|docx|txt|zip|mp3|mp4)/i)) {
    if (content.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return 'image';
    }
    return 'file';
  }
  
  // Check if it's a Cloudinary URL
  if (content.includes('cloudinary.com') || content.includes('res.cloudinary.com')) {
    if (content.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return 'image';
    }
    return 'file';
  }
  
  // Check if content contains mostly emojis
  const emojiRegex = /[\p{Emoji}\p{Emoji_Component}\s]/gu;
  const emojiMatch = content.match(emojiRegex);
  if (emojiMatch && emojiMatch.join('').trim().length > 0 && emojiMatch.length / content.length > 0.5) {
    return 'emoji';
  }
  
  return 'text';
};

// Fetch messages between two users
router.post('/', async (req, res) => {
  try {
    const user1 = req.body.user;
    const user2 = req.body.chatUser;

    if (!user1 || !user2) {
      return res.status(400).json({ success: false, error: 'Missing user or chatUser' });
    }

    const myChat = await Message.find({ sender: user1._id, chat: user2._id });
    const friendChat = await Message.find({ sender: user2._id, chat: user1._id });

    res.json({ myChat, friendChat });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).send(err);
  }
});

// Add a new message and broadcast it via WebSocket
router.post('/updatemessage', async (req, res) => {
  try {
    const { user, chatUser, data, attachment } = req.body;
    const content = data?.Talks || data?.content || '';

    console.log('Received message request:', { user: user._id, chatUser: chatUser._id, content, hasAttachment: !!attachment });

    // Detect message type
    const messageType = attachment ? (attachment.type?.startsWith('image/') ? 'image' : 'file') : detectMessageType(content);
    const isFileUrl = messageType === 'image' || messageType === 'file';

    const messageData = {
      sender: user._id,
      content: content || '',
      chat: chatUser._id,
      messageType: messageType,
      isFileUrl: isFileUrl,
      attachment: attachment || null,
      createdAt: new Date(),
    };

    // Save to database
    const chat = new Message(messageData);
    const savedMessage = await chat.save();

    console.log('Message saved to database:', savedMessage._id, 'with attachment:', !!attachment);

    // Populate sender info for real-time display
    const populatedMessage = await Message.findById(savedMessage._id).populate('sender', 'Username Profile');

    // Broadcast the message via WebSocket with full details
    if (io) {
      const broadcastData = {
        _id: savedMessage._id,
        sender: user._id,
        senderInfo: {
          _id: user._id,
          Username: user.Username,
          Profile: user.Profile,
        },
        content: content || '',
        attachment: attachment || null,
        chat: chatUser._id,
        messageType: messageType,
        isFileUrl: isFileUrl,
        createdAt: messageData.createdAt,
        downloadedBy: []
      };
      console.log('Broadcasting message via Socket.io with attachment:', !!attachment);
      io.emit('receive-message', broadcastData);
    }

    res.status(201).json({ 
      success: true,
      message: {
        _id: savedMessage._id,
        sender: user._id,
        content: content || '',
        chat: chatUser._id,
        attachment: attachment || null,
        messageType: messageType,
        isFileUrl: isFileUrl,
        createdAt: messageData.createdAt,
      }
    });
  } catch (err) {
    console.error('Error updating message:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete messages
router.post('/deletechat', async (req, res) => {
  try {
    const { messageIds } = req.body;
    
    await Message.deleteMany({ _id: { $in: messageIds } });
    
    res.status(200).json({ success: true, message: 'Messages deleted successfully' });
  } catch (err) {
    console.error('Error deleting messages:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Track file download
router.post('/download/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    if (!messageId || !userId) {
      return res.status(400).json({ success: false, error: 'Missing messageId or userId' });
    }

    // Update message to mark as downloaded by this user
    const message = await Message.findByIdAndUpdate(
      messageId,
      {
        $addToSet: { downloadedBy: userId }
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    // Broadcast download status update to all connected clients
    if (io) {
      io.emit('file-downloaded', {
        messageId: messageId,
        downloadedBy: userId,
        totalDownloads: message.downloadedBy.length
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Download tracked',
      downloadedBy: message.downloadedBy
    });
  } catch (err) {
    console.error('Error tracking download:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// MongoDB Status Check - Get file messages and download statistics
router.get('/status/files', async (req, res) => {
  try {
    // Get all messages with attachments
    const fileMessages = await Message.find({ 
      attachment: { $exists: true, $ne: null }
    }).populate('sender', 'Username _id').populate('downloadedBy', 'Username _id');

    // Statistics
    const totalFileMessages = fileMessages.length;
    const imageMessages = fileMessages.filter(m => m.messageType === 'image').length;
    const documentMessages = fileMessages.filter(m => m.messageType === 'file').length;
    
    // Download tracking stats
    const downloadStats = fileMessages.map(msg => ({
      _id: msg._id,
      filename: msg.attachment.filename,
      type: msg.messageType,
      sender: msg.sender?.Username || 'Unknown',
      size: msg.attachment.size,
      uploadedAt: msg.createdAt,
      downloadedByCount: msg.downloadedBy.length,
      downloadedBy: msg.downloadedBy.map(u => u.Username),
    }));

    // Messages without downloads
    const noDownloads = downloadStats.filter(m => m.downloadedByCount === 0);
    
    res.json({
      success: true,
      summary: {
        totalFileMessages,
        imageMessages,
        documentMessages,
        messagesWithDownloads: totalFileMessages - noDownloads.length,
        messagesWithoutDownloads: noDownloads.length,
      },
      details: downloadStats,
      noDownloadMessages: noDownloads
    });
  } catch (err) {
    console.error('Error fetching file status:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get specific message details with attachment info
router.get('/message/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    
    const message = await Message.findById(messageId)
      .populate('sender', 'Username _id Profile')
      .populate('chat', '_id')
      .populate('downloadedBy', 'Username _id Profile');

    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    res.json({
      success: true,
      message: {
        _id: message._id,
        sender: message.sender,
        content: message.content,
        messageType: message.messageType,
        attachment: message.attachment ? {
          filename: message.attachment.filename,
          type: message.attachment.type,
          size: message.attachment.size,
          url: message.attachment.url,
          thumbnailUrl: message.attachment.thumbnailUrl
        } : null,
        downloadedBy: message.downloadedBy,
        downloadCount: message.downloadedBy.length,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt
      }
    });
  } catch (err) {
    console.error('Error fetching message:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
