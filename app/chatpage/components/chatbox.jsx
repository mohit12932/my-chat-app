import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";
import Image from "next/image";

const Chatbox = ({ chatUser, user }) => {
  const { register, handleSubmit, reset, watch } = useForm();
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize socket only after mounting
  useEffect(() => {
    if (mounted) {
      const newSocket = io("http://localhost:8000");
      setSocket(newSocket);

      const handleMessage = (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      };

      newSocket.on("receive-message", handleMessage);

      const fetchMessages = async () => {
        try {
          const response = await axios.post("http://localhost:8000/displaychat", { user, chatUser });
          const chat = response.data;
          setMessages([...chat.myChat, ...chat.friendChat]);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();

      return () => newSocket.off("receive-message");
    }
  }, [mounted, chatUser]);

  const onSubmit = async (data) => {
    try {
      const timestamp = Date.now();
      await axios.post("http://localhost:8000/displaychat/updatemessage", {
        data,
        user,
        chatUser,
      });

      if (socket) {
        socket.emit("message", { ...data.Talks, chat: chatUser._id, sender: user._id, createdAt: timestamp });
      }
      reset();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    chatUser && (
      <div className="flex flex-col h-screen bg-gray-900 text-white">
        {/* 🔹 Header */}
        <div className="flex items-center p-4 bg-gray-800 border-b border-gray-700 shadow-md">
          <Image src={chatUser.Profile} alt="" width={40} height={40} className="rounded-full" />
          <h1 className="ml-3 text-lg font-semibold">{chatUser.Username}</h1>
        </div>

        {/* 🔹 Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages
            .sort((a, b) => a.createdAt - b.createdAt)
            .map((message) => (
              <div
                key={message._id}
                className={`p-3 max-w-[75%] rounded-lg ${
                  message.sender === user._id ? "ml-auto bg-blue-500" : "mr-auto bg-gray-700"
                }`}
              >
                {message.content}
              </div>
            ))}
        </div>

        {/* 🔹 Input Box */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center p-3 bg-gray-800 border-t border-gray-700">
          <input
            type="text"
            {...register("Talks")}
            placeholder="Type a message..."
            className="flex-1 p-2 text-white bg-gray-700 border-none rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={!watch("Talks")?.trim()}
            className="ml-3 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
          >
            Send
          </button>
        </form>
      </div>
    )
  );
};

export default Chatbox;
