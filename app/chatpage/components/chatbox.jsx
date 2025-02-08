import React, { useEffect, useState, useMemo } from "react";
import axios from 'axios';
import { useForm } from "react-hook-form";
import { io } from 'socket.io-client';

const Chatbox = ({ chatUser, user }) => {
  const { register, handleSubmit, reset, watch } = useForm();
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const socket = useMemo(() => io("http://localhost:8000"), []);

  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on("receive-message", handleMessage);

    const fetchMessages = async () => {
      try {
        const response = await axios.post("http://localhost:8000/displaychat", { user, chatUser });
        const chat = response.data;
        setMessages([...chat.myChat, ...chat.friendChat]);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    return () => socket.off("receive-message");
  }, [chatUser, socket]);

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:8000/displaychat/updatemessage", {
        data,
        user,
        chatUser,
      });

      socket.emit("message", { ...data.Talks, chat: chatUser._id, sender: user._id, createdAt: new Date() });
      reset();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const toggleMessageSelection = (messageId) => {
    setSelectedMessages((prevSelected) =>
      prevSelected.includes(messageId)
        ? prevSelected.filter((id) => id !== messageId)
        : [...prevSelected, messageId]
    );
  };

  const handleDeleteSelectedMessages = async () => {
    try {
      await axios.post("http://localhost:8000/displaychat/deletechat", {
        messageIds: selectedMessages,
      });

      setMessages((prevMessages) =>
        prevMessages.filter((message) => !selectedMessages.includes(message._id))
      );

      setSelectedMessages([]);
    } catch (error) {
      console.error('Error deleting messages:', error);
    }
  };

  const inputValue = watch("Talks", "");

  return (
    <>
      {chatUser != null && (
        <div className="w-full">
          {/* Header */}
          <div className="flex items-center px-5 pt-4 pb-6 w-full h-[8%] border-b mb-4 gap-x-2">
            <img
              className="object-cover w-8 h-8 rounded-full"
              src={chatUser.Profile}
              alt=""
            />
            <h1 className="text-sm font-medium text-white">{chatUser.Username}</h1>

            {/* Delete Icon */}
            {selectedMessages.length > 0 && (
              <button
                onClick={handleDeleteSelectedMessages}
                className="ml-auto bg-red-600 hover:bg-red-800 rounded-full p-1 "
              >
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#FFFFFF" fill="none">
    <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    <path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    <path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex flex-col-reverse overflow-y-scroll space-y-3 pb-3 h-[80%]">
  <div className="flex flex-col">
    {messages
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((message) => (
        <div
          key={message._id}
          className={`flex items-center mt-2 mb-1 rounded-2xl ${
            selectedMessages.includes(message._id) ? 'bg-[#e05a5a] bg-opacity-30 backdrop-blur-sm' : ''
          }`} // Conditional background color for selected rows
        > 
              
          {/* Message Content */}
          <div
            onClick={() => toggleMessageSelection(message._id)}
            className={`relative break-all p-2 rounded-2xl ${
              message.sender === user._id
                ? 'w-max ml-auto bg-blue-500 text-white text-left rounded-br-none mr-5'
                : 'ml-5 bg-[#e1b5aa] text-gray-900 rounded-bl-none float-none mr-auto'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
  </div>
</div>


          {/* Input */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex items-center px-5 pt-4 pb-6 w-full h-[10%]">
            <div>
              <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
            </div>
            <div className="flex-grow ml-4">
              <div className="relative w-full">
                <input type="text" {...register("Talks")} className="flex w-full border rounded-xl bg-gray-800 hover:bg-gray-700 pl-4 h-10" />
                <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="ml-4">
              <button disabled={inputValue.trim() === ""} className="flex items-center justify-center bg-[#e5b989] hover:bg-[#ECCEAE] rounded-xl text-white px-4 py-1 flex-shrink-0">
                <span className="text-[#441c11]">Send</span>
                <span className="ml-2">
                  <svg className="w-4 h-4 transform rotate-45 -mt-px" fill="none" stroke="#441c11" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbox;
