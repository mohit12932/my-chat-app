# 💬 Real-Time Chat Application

A modern, full-stack **real-time messaging platform** built with the power of **Next.js**, **Socket.IO**, and **MongoDB**. This chat system delivers low-latency message exchange, robust user authentication, and a scalable, modular architecture designed for production-level performance.

> 🚀 **Tech Stack**: Next.js, React.js, Tailwind CSS, Node.js, Express.js, Socket.IO, MongoDB

---

## 🔧 Key Features

- 🔁 **Real-Time Messaging** — Leveraged **Socket.IO** for bi-directional WebSocket communication ensuring ultra-low-latency chat experience.
- 🧱 **Modular Full-Stack Architecture** — Built RESTful APIs using **Express.js** and **Node.js**, with **Mongoose** ODM for MongoDB schema validation and data modeling.
- 🔐 **Secure Authentication System** — JWT-based login and route protection, **bcrypt** for encrypted password storage, and role-based access via middleware.
- 📤 **File Upload Support** — Integrated **Multer** for profile picture and media file uploads via multipart/form-data.
- 🧩 **Efficient Form Handling** — Type-safe and scalable form workflows using **React Hook Form**, ensuring validation and minimal re-renders.
- 🌐 **Async State Syncing** — Utilized **Axios** for seamless HTTP communication and real-time data updates across client-server.

---

## 🧠 Tech Stack

| Layer         | Tools & Frameworks                        |
|---------------|--------------------------------------------|
| Frontend      | Next.js, React.js, Tailwind CSS            |
| Real-Time     | Socket.IO (WebSocket protocol)             |
| Backend       | Node.js, Express.js, REST API              |
| Database      | MongoDB (with Mongoose ODM)                |
| Auth & Secure | JWT, bcrypt, dotenv, CORS, body-parser     |
| Uploads       | Multer (multipart form-data handler)       |
| Forms & HTTP  | React Hook Form, Axios                     |

---

## 📸 Screenshots

<img width="1916" height="876" alt="Screenshot 2025-07-08 151351" src="https://github.com/user-attachments/assets/91671127-e182-4587-a78d-b1bd44ef9c01" />
<img width="1919" height="886" alt="image" src="https://github.com/user-attachments/assets/59f1a033-5a91-4e2a-9a96-9da3170dffa1" />


---



## 📁 Project Structure

<pre>
chat-app/
├── backend/                           # Backend logic (Node.js + Express)
│   ├── middlewares/                   # Custom middleware handlers
│   │   └── multerMiddleware.js
│   ├── models/                        # Mongoose data models
│   │   ├── chatModel.js
│   │   ├── messageModel.js
│   │   └── userModel.js
│   ├── routes/                        # RESTful route handlers
│   │   ├── adduser.js
│   │   ├── displaychat.js
│   │   ├── displayuser.js
│   │   ├── signin.js
│   │   ├── signup.js
│   │   └── userRoutes.js
│   ├── server.js                      # Express server and Socket.IO config
│   ├── package.json
│   └── .gitignore
│
├── client/                            # Frontend logic (Next.js + Tailwind)
│   ├── app/                           # Pages and components
│   ├── public/                        # Static assets
│   ├── next.config.mjs                # Next.js config
│   ├── tailwind.config.js             # TailwindCSS config
│   ├── postcss.config.mjs
│   ├── package.json
│   ├── .eslintrc.json
│   └── .gitignore
│
├── .idea/                             # IDE configs (for JetBrains IDEs)
│   ├── inspectionProfiles/
│   ├── chat_app.iml
│   ├── editor.xml
│   └── modules.xml
├── README.md
</pre>

---




## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.x
- MongoDB Atlas or local instance
- Environment file with the following:
  
### 📦 Installation

```bash
git clone https://github.com/mohit12932/my-chat-app
cd my-chat-app

### Backend

cd backend
npm install


### Frontend

cd ../client
npm install



### 🔨 Run the Development Server

### Start backend (Express + Socket.io)

cd backend
npm run server
  

### Start frontend (Next.js)

cd client
npm run dev
