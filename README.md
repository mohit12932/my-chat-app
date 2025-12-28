# 💬 Chat Application - Full Stack Real-Time Messaging

A production-ready, full-stack chat application built with **Next.js**, **Node.js**, **MongoDB**, and **Socket.io**, featuring real-time messaging, file sharing, timezone handling, and a modern responsive UI.

---

## 🌟 Key Features

### **Core Functionality**
- 🔐 **User Authentication** - Secure signup/signin with JWT
- 💬 **Real-Time Messaging** - Instant message delivery via Socket.io
- 📎 **File Sharing** - Images and documents with Cloudinary integration
- 👥 **Friend Management** - Add friends and manage chat lists
- 🕐 **Timezone Support** - UTC storage with local display (70+ timezones)
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Modern UI** - Tailwind CSS with dark theme
- 🔔 **Message Status** - Delivered and read indicators
- 🗑️ **Message Management** - Delete individual or batch messages
- 📥 **File Downloads** - Track download counts

### **Technical Highlights**
- ⚡ **Real-time Updates** - WebSocket connections with Socket.io
- 🌐 **Timezone Aware** - All timestamps in UTC, displayed in user's local time
- 📊 **Scalable Architecture** - Modular backend with middleware
- 🔒 **Secure** - Password hashing, JWT tokens, input validation
- 🎯 **Type Detection** - Automatic message type identification
- 📦 **File Management** - Progress tracking, previews, and metadata

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Next.js)                        │
├─────────────────────────────────────────────────────────────┤
│  Pages                Components             Libraries      │
│  - SignUp            - ChatBox              - timezoneUtils │
│  - SignIn            - DisplayFriends       - axios config  │
│  - ChatPage          - AddFriend                            │
│                      - Account                              │
└─────────────────────────────────────────────────────────────┘
                              ↕
         ┌─────────────────────────────────────────┐
         │    Socket.io WebSocket Connection       │
         └─────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js/Express)                  │
├─────────────────────────────────────────────────────────────┤
│  Routes              Middleware          Models             │
│  - /signup          - timezone           - User             │
│  - /signin          - multer             - Message          │
│  - /displaychat     - error handler      - Chat             │
│  - /adduser                                                 │
│  - /displayusers                                            │
└─────────────────────────────────────────────────────────────┘
                              ↕
         ┌─────────────────────────────────────────┐
         │         MongoDB Database                │
         │  - users    - messages    - chats       │
         └─────────────────────────────────────────┘
```

---

##  Screenshots
```
<img width="1835" height="837" alt="Screenshot 2025-12-28 201413" src="https://github.com/user-attachments/assets/f5cd18b7-2706-471a-ac99-ac3f42cb8bd8" />
<img width="1918" height="878" alt="Screenshot 2025-12-28 201509" src="https://github.com/user-attachments/assets/43c69319-413e-42ee-ab8b-9b9cdabc5358" />
<img width="1919" height="875" alt="Screenshot 2025-12-28 201755" src="https://github.com/user-attachments/assets/5df6b387-ce19-4265-98e3-20ce3a2ed56b" />
<img width="642" height="511" alt="Screenshot 2025-12-28 201615" src="https://github.com/user-attachments/assets/cb0c7ca2-6e82-4e3b-8468-e4240eebe661" />
<img width="437" height="562" alt="Screenshot 2025-12-28 201811" src="https://github.com/user-attachments/assets/258aea4d-74e6-4632-be22-d230ed047e63" />
<img width="433" height="548" alt="Screenshot 2025-12-28 201823" src="https://github.com/user-attachments/assets/cc6cda2f-c3a3-4d65-b34e-9339cb109ada" />

```

----

## 📂 Project Structure

```
my-chat-app/
├── backend/
│   ├── models/
│   │   ├── userModel.js           # User schema with timezone
│   │   ├── messageModel.js        # Message schema with UTC timestamps
│   │   └── chatModel.js           # Chat/conversation schema
│   ├── routes/
│   │   ├── signup.js              # User registration
│   │   ├── signin.js              # User authentication
│   │   ├── displaychat.js         # Message CRUD & WebSocket
│   │   ├── adduser.js             # Friend management
│   │   ├── displayuser.js         # User list
│   │   └── userRoutes.js          # Route aggregator
│   ├── middlewares/
│   │   ├── timezoneMiddleware.js  # Timezone validation & handling
│   │   └── multerMiddleware.js    # File upload handling
│   ├── server.js                  # Express & Socket.io server
│   └── package.json
│
├── client/
│   ├── app/
│   │   ├── Homepage/
│   │   │   ├── SignUp/page.jsx    # Registration page
│   │   │   └── SignIn/page.jsx    # Login page
│   │   ├── chatpage/
│   │   │   ├── page.jsx           # Main chat interface
│   │   │   └── components/
│   │   │       ├── chatbox.jsx    # Message display & input
│   │   │       ├── displayfriends.jsx  # Friend list
│   │   │       ├── addfriend.jsx  # Add friend component
│   │   │       └── Account.jsx    # User profile
│   │   ├── globals.css            # Global styles
│   │   └── layout.js              # Root layout
│   ├── lib/
│   │   └── timezoneUtils.js       # Timezone utilities (15+ functions)
│   ├── public/
│   │   └── images/                # Static assets
│   └── package.json
│
└── README.md                       # This file
```

---

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** 16+ and npm/yarn
- **MongoDB** (local or Atlas)
- **Cloudinary Account** (for file uploads)

### **1. Clone the Repository**

```bash
git clone <repository-url>
cd my-chat-app
```

### **2. Backend Setup**

```bash
cd backend
npm install
```

Create `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017
PORT=8000
JWT_SECRET=your_jwt_secret_key_here
```

Start backend:

```bash
npm start
```

Backend will run on `http://localhost:8000`

### **3. Frontend Setup**

```bash
cd client
npm install
```

Create `.env` file:

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:8000
```

Start frontend:

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 🔧 Configuration

### **Environment Variables**

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017      # MongoDB connection string
PORT=8000                                   # Server port
JWT_SECRET=your_secret_key                 # JWT signing key
```

#### Frontend (.env)
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:8000  # Backend API URL
```

### **Cloudinary Setup**

1. Create account at [Cloudinary](https://cloudinary.com)
2. Update upload preset in:
   - `client/app/Homepage/SignUp/page.jsx` (line 42)
   - `client/app/chatpage/components/chatbox.jsx` (line 213)

Replace:
```javascript
formData.append('upload_preset', 'chat-app');  // Your preset name
```

---

## 🎯 Core Features Guide

### **1. User Authentication**

**Registration:**
- Navigate to `/Homepage/SignUp`
- Provide username, email, password
- Optional profile photo upload
- Automatic timezone detection
- Server-side validation

**Login:**
- Navigate to `/Homepage/SignIn`
- Email and password required
- JWT token stored in localStorage
- Timezone headers included

**Code Example:**
```javascript
// SignUp with timezone
const response = await axios.post(`${SERVER_URL}/signup`, data, {
  headers: getTimezoneHeaders()  // Auto-includes user timezone
});
```

### **2. Real-Time Messaging**

**Features:**
- Instant delivery via WebSocket
- Message type detection (text, emoji, image, file)
- Typing indicators
- Read receipts
- UTC timestamps with local display

**Code Example:**
```javascript
// Send message
await axios.post(`${SERVER_URL}/displaychat/updatemessage`, {
  data: { Talks: messageContent },
  user,
  chatUser,
}, {
  headers: getTimezoneHeaders()
});

// Socket.io broadcasts to all clients
socket.on("receive-message", (message) => {
  setMessages((prev) => [...prev, message]);
});
```

### **3. File Sharing**

**Supported Types:**
- Images: JPG, PNG, GIF, WEBP
- Documents: PDF, DOC, DOCX, TXT
- Archives: ZIP
- Media: MP3, MP4

**Features:**
- Upload progress tracking
- Thumbnail generation
- Download tracking
- File metadata storage

**Code Example:**
```javascript
// Upload file
const formData = new FormData();
formData.append('file', file);
formData.append('upload_preset', 'chat-app');

const response = await axios.post(
  'https://api.cloudinary.com/v1_1/deiyquzr6/auto/upload',
  formData,
  {
    onUploadProgress: (progressEvent) => {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setUploadProgress(percent);
    }
  }
);
```

### **4. Timezone Handling**

**How It Works:**
1. Client auto-detects user's timezone
2. All API requests include `X-Timezone` header
3. Backend validates timezone (70+ supported)
4. Messages stored in UTC
5. Display converts to user's local time

**Utility Functions:**
```javascript
import { 
  formatTime,           // "14:30"
  formatUTCDate,        // "Dec 28, 2025, 2:30 PM EST"
  getTimeAgo,          // "5m ago"
  getCurrentUTCTimestamp,
  getTimezoneHeaders
} from '@/lib/timezoneUtils';

// Display message time
<time>{formatTime(message.createdAt)}</time>
<span>{getTimeAgo(message.createdAt)}</span>
```

**Supported Timezones:**
- Americas (North & South America)
- Europe (Western, Central, Eastern)
- Asia (East, South, Southeast, Middle East)
- Africa (Major cities)
- Australia & Pacific

---

## 📡 API Reference

### **Authentication**

#### POST `/signup`
Register new user

**Request:**
```json
{
  "Username": "john_doe",
  "emailadress": "john@example.com",
  "Password": "securepass123",
  "Profile": "https://cloudinary.com/image.jpg"
}
```

**Headers:**
```
X-Timezone: America/New_York
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": { "_id": "...", "Username": "john_doe", ... }
}
```

#### POST `/signin`
Authenticate user

**Request:**
```json
{
  "emailadress": "john@example.com",
  "Password": "securepass123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": { "_id": "...", "Username": "john_doe", ... },
  "friends": ["friend_id_1", "friend_id_2"]
}
```

### **Messaging**

#### POST `/displaychat`
Fetch conversation messages

**Request:**
```json
{
  "user": { "_id": "user1_id", ... },
  "chatUser": { "_id": "user2_id", ... }
}
```

**Response:**
```json
{
  "myChat": [{ "content": "Hello", "createdAt": "2025-12-28T10:30:00Z", ... }],
  "friendChat": [{ "content": "Hi!", "createdAt": "2025-12-28T10:31:00Z", ... }]
}
```

#### POST `/displaychat/updatemessage`
Send new message

**Request:**
```json
{
  "user": { "_id": "user1_id", ... },
  "chatUser": { "_id": "user2_id", ... },
  "data": { "Talks": "Hello World" },
  "attachment": {
    "url": "https://...",
    "filename": "image.jpg",
    "type": "image/jpeg",
    "size": 1024000
  }
}
```

**WebSocket Broadcast:**
```javascript
socket.on("receive-message", (message) => {
  // Message delivered to all connected clients
});
```

#### POST `/displaychat/deletechat`
Delete messages

**Request:**
```json
{
  "messageIds": ["msg_id_1", "msg_id_2"]
}
```

### **Friends**

#### POST `/adduser`
Search for user

**Request:**
```json
{
  "Friends": "username_to_search",
  "user": "current_username"
}
```

#### POST `/adduser/add`
Add friend

**Request:**
```json
{
  "user": { "_id": "user1_id", ... },
  "Friend": { "_id": "user2_id", ... }
}
```

#### POST `/displayusers`
Get user's friend list

**Request:**
```json
{
  "_id": "user_id"
}
```

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js 14.2.28 (React 18)
- **Styling:** Tailwind CSS 3.4.1
- **State Management:** React Hooks
- **Forms:** React Hook Form 7.54.2
- **HTTP Client:** Axios 1.7.9
- **Real-time:** Socket.io Client 4.8.1
- **Image Handling:** Next/Image optimization

### **Backend**
- **Runtime:** Node.js with Express 4.21.2
- **Database:** MongoDB with Mongoose 8.9.3
- **Authentication:** JWT (jsonwebtoken 9.0.2)
- **Password Security:** bcrypt 5.1.1
- **Real-time:** Socket.io 4.8.1
- **File Upload:** Multer 1.4.5-lts.1
- **Environment:** dotenv 16.4.7
- **CORS:** cors 2.8.5

### **Storage & CDN**
- **Database:** MongoDB (local or Atlas)
- **File Storage:** Cloudinary
- **Image CDN:** Cloudinary CDN

---

## 🎨 UI Components

### **ChatBox Component**
Main messaging interface with:
- Message list with infinite scroll
- Text input with emoji picker
- File upload with preview
- Message selection & deletion
- Typing indicators
- Time display with timezone

### **DisplayFriends Component**
Friend list sidebar with:
- Active friend highlighting
- Profile pictures
- Online status indicators
- Quick navigation

### **AddFriend Component**
Search and add friends:
- Real-time search
- User profile display
- One-click add

### **Account Component**
User profile display:
- Profile picture
- Username and email
- Logout functionality

---

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop:** Full sidebar layout (1280px+)
- **Tablet:** Collapsible sidebar (768px - 1279px)
- **Mobile:** Stack layout with navigation (320px - 767px)

**Breakpoints:**
```css
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
```

---

## 🔐 Security Features

1. **Password Security**
   - bcrypt hashing (10 rounds)
   - Password validation (min 6 characters)
   - No plain text storage

2. **Authentication**
   - JWT tokens with expiration
   - Secure token storage
   - Protected routes

3. **Input Validation**
   - Email format validation
   - Username requirements
   - File size limits (2MB for profiles)
   - XSS prevention

4. **API Security**
   - CORS configured
   - Rate limiting ready
   - Error handling middleware
   - Timezone validation

---

## 🧪 Testing

### **Backend Testing**

```bash
# Start backend
cd backend
npm start

# Test endpoints
curl -X POST http://localhost:8000/signup \
  -H "Content-Type: application/json" \
  -H "X-Timezone: America/New_York" \
  -d '{"Username":"test","emailadress":"test@test.com","Password":"test123"}'
```

### **Frontend Testing**

```bash
# Start frontend
cd client
npm run dev

# Navigate to http://localhost:3000
# Test user flows:
# 1. Sign up new user
# 2. Sign in
# 3. Add friend
# 4. Send messages
# 5. Upload file
# 6. Delete messages
```

### **WebSocket Testing**

Open browser console:
```javascript
// Check socket connection
const socket = io('http://localhost:8000');
socket.on('connect', () => console.log('Connected:', socket.id));
socket.on('receive-message', (msg) => console.log('Message:', msg));
```

---

## 🐛 Troubleshooting

### **Common Issues**

**1. Module not found errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. MongoDB connection failed**
```bash
# Check MongoDB is running
mongod --version
# or
mongosh

# Verify connection string in .env
MONGODB_URI=mongodb://localhost:27017
```

**3. Socket.io not connecting**
- Check CORS configuration in `backend/server.js`
- Verify `NEXT_PUBLIC_SERVER_URL` in client `.env`
- Check firewall settings

**4. Images not uploading**
- Verify Cloudinary credentials
- Check file size (max 2MB for profiles)
- Ensure `upload_preset` is correct

**5. Timezone not working**
- Verify `X-Timezone` header is sent
- Check browser timezone: `Intl.DateTimeFormat().resolvedOptions().timeZone`
- Ensure middleware is applied

### **Debug Mode**

Enable detailed logging:

**Backend:**
```javascript
// server.js
console.log('Request timezone:', req.timezone);
console.log('UTC timestamp:', req.utcTimestamp);
```

**Frontend:**
```javascript
// Check timezone headers
console.log(getTimezoneHeaders());
// Output: { 'X-Timezone': 'America/New_York' }
```

---

## 📈 Performance Optimization

### **Implemented**
- ✅ Image optimization with Next/Image
- ✅ Lazy loading for messages
- ✅ WebSocket connection pooling
- ✅ MongoDB indexing
- ✅ Gzip compression ready
- ✅ CDN for file storage

### **Recommended**
- [ ] Implement pagination for messages
- [ ] Add Redis for session management
- [ ] Enable compression middleware
- [ ] Implement rate limiting
- [ ] Add database read replicas
- [ ] Set up CDN for static assets

---

## 🚀 Deployment

### **Backend Deployment (Heroku/Railway)**

1. Set environment variables
2. Update CORS origins
3. Deploy:

```bash
# Heroku
git push heroku main

# Railway
railway up
```

### **Frontend Deployment (Vercel)**

1. Connect GitHub repository
2. Set environment variables
3. Deploy:

```bash
vercel --prod
```

### **MongoDB Atlas**

1. Create cluster
2. Whitelist IPs
3. Update connection string
4. Test connection

---

## 📝 Future Enhancements

### **Planned Features**
- [ ] Group chats
- [ ] Video/audio calls
- [ ] Message reactions
- [ ] Voice messages
- [ ] Read receipts
- [ ] Push notifications
- [ ] Message search
- [ ] Chat themes
- [ ] User blocking
- [ ] Admin panel

### **Technical Improvements**
- [ ] Microservices architecture
- [ ] GraphQL API
- [ ] Redis caching
- [ ] Message encryption
- [ ] Analytics dashboard
- [ ] Automated testing
- [ ] CI/CD pipeline
- [ ] Docker containers
- [ ] Kubernetes deployment
- [ ] Load balancing

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Authors

- **Your Name** - Initial work - [GitHub Profile](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Socket.io for real-time capabilities
- MongoDB for flexible database
- Tailwind CSS for utility-first styling
- Cloudinary for media management

---

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

## 🔗 Links

- **Documentation:** This README
- **Live Demo:** [Coming Soon]
- **API Docs:** See API Reference section above
- **Bug Reports:** GitHub Issues
- **Feature Requests:** GitHub Issues

---

**Built with ❤️ using Next.js, Node.js, MongoDB, and Socket.io**
