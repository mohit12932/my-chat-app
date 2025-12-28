import React, { useEffect, useState, useMemo } from "react";
import axios from 'axios';
import { useForm } from "react-hook-form";
import { io } from 'socket.io-client';
import Image from 'next/image'
import { toUTC, formatTime, getTimeAgo, getTimezoneHeaders } from '@/lib/timezoneUtils';

const Chatbox = ({ chatUser, user }) => {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState({});
  const [downloadedFiles, setDownloadedFiles] = useState({});
  const [doubleTappedMessage, setDoubleTappedMessage] = useState(null);
  const [deletingMessage, setDeletingMessage] = useState(null);
  const fileInputRef = React.useRef(null);
  const imageInputRef = React.useRef(null);
  const emojiPickerRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const doubleTabTimeout = React.useRef(null);
  const socket = useMemo(() => io(`${process.env.NEXT_PUBLIC_SERVER_URL}`), []);

  useEffect(() => {
    const handleMessage = (data) => {
      console.log('Received message from Socket.io:', data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    const handleFileDownloaded = (data) => {
      console.log('File downloaded event:', data);
      setDownloadedFiles((prev) => ({
        ...prev,
        [data.messageId]: data.totalDownloads
      }));
    };

    const handleConnect = () => {
      console.log('Socket.io connected:', socket.id);
    };

    const handleDisconnect = () => {
      console.log('Socket.io disconnected');
    };

    socket.on("receive-message", handleMessage);
    socket.on("file-downloaded", handleFileDownloaded);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    const fetchMessages = async () => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/displaychat`, { user, chatUser }, {
          headers: getTimezoneHeaders()
        });
        const chat = response.data;
        console.log('Fetched messages:', chat);
        const allMessages = [...chat.myChat, ...chat.friendChat];
        setMessages(allMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    return () => {
      socket.off("receive-message");
      socket.off("file-downloaded");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [chatUser, socket]);

  const onSubmit = async (data) => {
    try {
      const messageContent = data.Talks?.trim() || '';
      
      if (!messageContent) return;

      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/displaychat/updatemessage`, {
        data: { Talks: messageContent },
        user,
        chatUser,
      }, {
        headers: getTimezoneHeaders()
      });

      // Backend broadcasts the message via Socket.io 'receive-message' event
      
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
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/displaychat/deletechat`, {
        messageIds: selectedMessages,
      }, {
        headers: getTimezoneHeaders()
      });

      setMessages((prevMessages) =>
        prevMessages.filter((message) => !selectedMessages.includes(message._id))
      );

      setSelectedMessages([]);
    } catch (error) {
      console.error('Error deleting messages:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      setDeletingMessage(messageId);
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/displaychat/deletechat`, {
        messageIds: [messageId],
      }, {
        headers: getTimezoneHeaders()
      });

      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId)
      );

      setDoubleTappedMessage(null);
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setDeletingMessage(null);
    }
  };

  const handleMessageDoubleTab = (messageId) => {
    console.log('Double tap detected on message:', messageId);
    setDoubleTappedMessage(messageId);
  };

  const closeDeleteMenu = () => {
    setDoubleTappedMessage(null);
  };

  const inputValue = watch("Talks", "");

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowUploadMenu(false);
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
      console.log("File selected:", file.name);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowUploadMenu(false);
      // Create preview for images
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
      console.log("Image selected:", file.name);
    }
  };

  const handleEmojiClick = (emoji) => {
    const currentValue = inputRef.current?.value || '';
    const newValue = currentValue + emoji;
    
    // Update both the DOM and React Hook Form state
    if (inputRef.current) {
      inputRef.current.value = newValue;
    }
    
    // Update React Hook Form's internal state
    setValue('Talks', newValue);
    
    setShowEmojiPicker(false);
  };

  const uploadFileToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'chat-app');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/deiyquzr6/auto/upload',
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );
      
      return {
        url: response.data.secure_url,
        filename: file.name,
        type: file.type,
        size: file.size,
        thumbnailUrl: response.data.secure_url // Cloudinary handles thumb generation
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleSendWithAttachment = async () => {
    if (!selectedFile && !inputRef.current?.value.trim()) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      let messageContent = inputRef.current?.value?.trim() || '';
      let attachmentData = null;

      if (selectedFile) {
        console.log('Uploading file:', selectedFile.name);
        const uploadedData = await uploadFileToCloudinary(selectedFile);
        console.log('File uploaded to Cloudinary:', uploadedData);
        attachmentData = {
          url: uploadedData.url,
          filename: uploadedData.filename,
          type: uploadedData.type,
          size: uploadedData.size,
          thumbnailUrl: uploadedData.thumbnailUrl
        };
      }

      console.log('Sending message with attachment:', { messageContent, attachmentData });
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/displaychat/updatemessage`, {
        data: { Talks: messageContent },
        attachment: attachmentData,
        user,
        chatUser,
      }, {
        headers: getTimezoneHeaders()
      });

      console.log('Message sent successfully:', response.data);
      // Backend broadcasts the message via Socket.io 'receive-message' event

      reset();
      if (inputRef.current) inputRef.current.value = '';
      setSelectedFile(null);
      setFilePreview(null);
      setUploading(false);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error sending message with attachment:', error);
      setUploading(false);
      setUploadProgress(0);
      alert('Error sending message: ' + error.message);
    }
  };

  const parseMessageContent = (content) => {
    if (!content) return { text: '', file: null };
    
    // Check if message contains file data
    if (content.includes('FILE:')) {
      const parts = content.split('||FILE:');
      const textPart = parts[0];
      const fileDataStr = parts[1];
      
      try {
        const fileData = JSON.parse(fileDataStr);
        return {
          text: textPart || '',
          file: fileData
        };
      } catch (e) {
        return { text: content, file: null };
      }
    }
    
    return { text: content, file: null };
  };

  const handleFileDownload = async (messageId, attachment) => {
    try {
      setDownloadProgress((prev) => ({
        ...prev,
        [messageId]: 0
      }));

      // Simulate download progress
      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          const current = prev[messageId] || 0;
          const newProgress = Math.min(current + Math.random() * 30, 90);
          return { ...prev, [messageId]: newProgress };
        });
      }, 200);

      // Track download on server
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/displaychat/download/${messageId}`,
        { userId: user._id },
        { headers: getTimezoneHeaders() }
      );

      // Trigger the actual download
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      clearInterval(progressInterval);
      setDownloadProgress((prev) => ({
        ...prev,
        [messageId]: 100
      }));

      // Mark as downloaded
      setDownloadedFiles((prev) => ({
        ...prev,
        [messageId]: true
      }));

      // Clear progress after 1 second
      setTimeout(() => {
        setDownloadProgress((prev) => {
          const newState = { ...prev };
          delete newState[messageId];
          return newState;
        });
      }, 1000);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) return '🖼️';
    if (fileType?.startsWith('video/')) return '🎥';
    if (fileType?.startsWith('audio/')) return '🎵';
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('word') || fileType?.includes('document')) return '📝';
    if (fileType?.includes('sheet') || fileType?.includes('excel')) return '📊';
    return '📎';
  };

  const renderMessageContent = (message) => {
    const { text, file } = parseMessageContent(message.content);
    const attachment = message.attachment;
    const displayFile = attachment || file;
    const isDownloaded = downloadedFiles[message._id];
    const progress = downloadProgress[message._id];
    
    console.log('Rendering message:', { 
      messageId: message._id, 
      text, 
      file, 
      attachment, 
      displayFile,
      messageContent: message.content 
    });
    
    if (!displayFile) {
      console.warn('No displayFile for message:', message._id);
    }
    
    return (
      <div className="flex flex-col gap-2">
        {text && <p className="break-words">{text}</p>}
        {displayFile && displayFile.url && (
          <div className="mt-1">
            {displayFile.type?.startsWith('image/') ? (
              // Render as image with preview
              <div className="group relative">
                <img 
                  src={displayFile.thumbnailUrl || displayFile.url} 
                  alt={displayFile.filename}
                  className="max-w-xs max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(displayFile.url, '_blank')}
                  title="Click to view full size"
                />
                <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-6l6 6m0 0l-6 6m6-6H4" />
                  </svg>
                </div>
              </div>
            ) : (
              // Render as downloadable file with professional UI
              <div className="mt-1">
                {progress !== undefined && progress < 100 ? (
                  // Download in progress
                  <div className="bg-gray-700 rounded-lg p-4 max-w-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getFileIcon(displayFile.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-100 truncate">{displayFile.filename}</p>
                        <p className="text-xs text-gray-400">
                          {(displayFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 text-right">{Math.round(progress)}%</p>
                    </div>
                  </div>
                ) : (
                  // Download button or downloaded state
                  <button
                    onClick={() => handleFileDownload(message._id, displayFile)}
                    className={`flex items-center gap-3 rounded-lg p-4 max-w-sm transition-all group ${
                      isDownloaded
                        ? 'bg-green-600/20 border border-green-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <span className="text-2xl">{getFileIcon(displayFile.type)}</span>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-gray-100 truncate">{displayFile.filename}</p>
                      <p className="text-xs text-gray-400">
                        {(displayFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-center">
                      {isDownloaded && (
                        <svg className="w-5 h-5 text-green-500 mb-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      <svg className={`w-6 h-6 transition-transform ${!isDownloaded && 'group-hover:translate-y-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {chatUser != null && (
        <div className="w-full">
          {/* Header */}
          <div className="flex items-center px-5 pt-4 pb-6 w-full h-[8%] border-b mb-4 gap-x-2">
            <Image width={500} height={300}
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
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .map((message) => (
                  <div
                    key={message._id}
                    className={`flex items-center mt-2 mb-1 rounded-2xl group relative z-10 ${
                      selectedMessages.includes(message._id) ? 'bg-[#e05a5a] bg-opacity-30 backdrop-blur-sm' : ''
                    }`}
                  >
                    {/* Message Content */}
                    <div
                      onDoubleClick={() => handleMessageDoubleTab(message._id)}
                      onClick={() => {
                        if (doubleTappedMessage === message._id) closeDeleteMenu();
                      }}
                      className={`relative break-all p-3 rounded-2xl cursor-pointer transition-all ${
                        message.sender === user._id
                          ? 'w-max ml-auto bg-blue-500 text-white text-left rounded-br-none mr-5'
                          : 'ml-5 bg-[#e1b5aa] text-gray-900 rounded-bl-none float-none mr-auto'
                      } ${doubleTappedMessage === message._id ? 'ring-2 ring-yellow-400' : ''}`}
                    >
                      {renderMessageContent(message)}
                    </div>

                    {/* Delete Icon on Double Tap - Positioned Absolutely */}
                    {doubleTappedMessage === message._id && (
                      <div className="absolute -top-12 right-0 flex gap-2 bg-white rounded-lg shadow-2xl p-2 z-50 border border-gray-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMessage(message._id);
                          }}
                          disabled={deletingMessage === message._id}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-all disabled:opacity-50 flex items-center gap-1"
                          title="Delete message"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                          </svg>
                          <span className="text-xs font-semibold">Delete</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            closeDeleteMenu();
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all flex items-center gap-1"
                          title="Cancel"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-xs font-semibold">Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>


          {/* Input */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex items-center px-5 pt-4 pb-6 w-full h-[10%]">
            <div className="relative">
              <button 
                type="button"
                onClick={() => setShowUploadMenu(!showUploadMenu)}
                className="flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              {/* Upload Menu Dropdown */}
              {showUploadMenu && (
                <div className="absolute bottom-full left-0 mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-2 w-48 z-10">
                  {/* File Upload */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-3 w-full px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>File</span>
                  </button>

                  {/* Image Upload */}
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center gap-3 w-full px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Image</span>
                  </button>
                </div>
              )}

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept="*/*"
              />

              {/* Hidden Image Input */}
              <input
                ref={imageInputRef}
                type="file"
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </div>
            <div className="flex-grow ml-4">
              <div className="relative w-full">
                {/* File Preview */}
                {selectedFile && (
                  <div className="mb-2 p-3 bg-gray-700 rounded-lg flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {filePreview ? (
                        <img src={filePreview} alt="preview" className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <div className="text-2xl">{getFileIcon(selectedFile.type)}</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-100 truncate">{selectedFile.name}</p>
                        <p className="text-xs text-gray-400">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreview(null);
                      }}
                      className="text-gray-400 hover:text-gray-200 flex-shrink-0"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Upload Progress */}
                {uploading && (
                  <div className="mb-2 p-2 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-300">Uploading...</span>
                      <span className="text-xs font-medium text-blue-400">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <input 
                  ref={inputRef}
                  type="text" 
                  {...register("Talks")} 
                  className="flex w-full border rounded-xl bg-gray-800 hover:bg-gray-700 pl-4 h-10" 
                  placeholder="Type a message..."
                />
                
                {/* Emoji Picker Button */}
                <button 
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                </button>

                {/* Emoji Picker Grid - Professional style */}
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 w-80 z-20">
                    <div className="p-3">
                      <input
                        type="text"
                        placeholder="Search emoji..."
                        className="w-full bg-gray-700 text-white text-sm rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                      <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                        {['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', 
                          '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
                          '👍', '👎', '👏', '🙌', '👋', '✋', '🤚', '🖐️',
                          '🎉', '🎊', '🎈', '🎁', '🔥', '✨', '⭐', '🌟',
                          '😎', '🤔', '🤨', '😍', '🥰', '😘', '😗', '😚',
                          '😢', '😭', '😠', '😡', '🤬', '😤', '😖', '😣',
                          '🚀', '💯', '🙈', '🙉', '🙊', '🐶', '🐱', '🐭',
                          '🍕', '🍔', '🍟', '🌮', '🌯', '🥗', '🍜', '🍝'].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              handleEmojiClick(emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="text-xl hover:bg-gray-700 p-2 rounded transition-all hover:scale-125 cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="ml-4">
              <button 
                type="button"
                onClick={() => {
                  if (selectedFile) {
                    handleSendWithAttachment();
                  } else {
                    handleSubmit(onSubmit)();
                  }
                }}
                disabled={uploading || (inputValue.trim() === "" && !selectedFile)}
                className={`flex items-center justify-center rounded-xl text-white px-4 py-1 flex-shrink-0 ${
                  uploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#e5b989] hover:bg-[#ECCEAE]'
                }`}
              >
                <span className="text-[#441c11]">{uploading ? 'Sending...' : 'Send'}</span>
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
