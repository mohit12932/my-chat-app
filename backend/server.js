import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { initializeSocket } from './routes/displaychat.js'; // Import the WebSocket initializer

dotenv.config();

async function startServer() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/user_info`); 

    const app = express();
    const port = process.env.PORT || 8000; // Use environment variable for port

    app.use(cors({
      origin: "*", // Use specific domain(s) for better security instead of '*'
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    }));
    app.use(bodyParser.json());

    const server = createServer(app);

    const io = new Server(server, {
      pingTimeout: 120000,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // Pass WebSocket instance to displaychat
    initializeSocket(io);

    io.on("connection", (socket) => {
      console.log("User connected: " + socket.id);

      socket.on("disconnect", () => {
        console.log("User disconnected: " + socket.id);
      });
    });

    app.use('/', userRoutes);

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
