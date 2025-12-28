import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { initializeSocket } from './routes/displaychat.js'; // Import the WebSocket initializer
import { timezoneMiddleware } from './middlewares/timezoneMiddleware.js'; // Import timezone middleware

dotenv.config();

async function startServer() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/user_info`); 
    console.log('✓ MongoDB connected successfully');

    const app = express();
    const port = process.env.PORT || 8000; // Use environment variable for port

    app.use(cors({
      origin: "*", // Use specific domain(s) for better security instead of '*'
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    }));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    
    // Apply timezone middleware to all routes
    app.use(timezoneMiddleware);

    const server = createServer(app);

    const io = new Server(server, {
      pingTimeout: 120000,
      maxHttpBufferSize: 1e7, // 10 MB buffer for large file transfers
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    
    initializeSocket(io);

    io.on("connection", (socket) => {
      console.log("User connected: " + socket.id);

      // Handle real-time message sending
      socket.on("message", (data) => {
        console.log("Message received:", data);
        // Broadcast to all connected clients
        io.emit("receive-message", data);
      });

      // Handle typing indicator
      socket.on("typing", (data) => {
        socket.broadcast.emit("user-typing", data);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected: " + socket.id);
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    });

    app.use('/', userRoutes);

    // MongoDB Status Endpoint - Check database integrity
    app.get('/api/status/mongodb', async (req, res) => {
      try {
        const db = mongoose.connection.db;
        const adminDb = db.admin();
        const serverStatus = await adminDb.serverStatus();
        
        // Get connection statistics
        const collections = {
          messages: await db.collection('messages').countDocuments(),
          users: await db.collection('users').countDocuments(),
          chats: await db.collection('chats').countDocuments(),
        };

        res.json({
          success: true,
          mongodb: {
            connected: mongoose.connection.readyState === 1,
            host: mongoose.connection.host,
            database: mongoose.connection.name,
            collections: collections
          },
          serverStatus: {
            uptime: serverStatus.uptime,
            connections: serverStatus.connections.current,
            network: {
              bytesIn: serverStatus.network.bytesIn,
              bytesOut: serverStatus.network.bytesOut
            }
          },
          timestamp: new Date()
        });
      } catch (err) {
        res.status(500).json({ 
          success: false, 
          error: err.message,
          connected: mongoose.connection.readyState === 1
        });
      }
    });

    process.on('unhandledRejection', (error) => {
      console.error('Unhandled Rejection:', error);
    });
  
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
    });
  

    server.listen(port,'0.0.0.0', () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}



startServer();
