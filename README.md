# 🗨️ Full-Stack Chat Application

*A cross-platform real-time chat app using React Native & Node.js*

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,nodejs,express,postgres,sequelize,jwt,bcryptjs,expo,tailwindcss,typescript&perline=6" />
</p>

---

## ✨ Features

* 🔐 **User Authentication** with JWT + bcryptjs
* ⚡ **Real-Time Messaging** using Socket.IO
* 💬 **Private Chats** (1-on-1 conversations)
* 📞 **Voice & Video Calling** with WebRTC signaling
* 💾 **Persistent Data** stored in PostgreSQL via Sequelize
* 📱 **Cross-Platform Frontend** (iOS + Android)
* 🎨 **Tailwind CSS UI** using NativeWind
* 🧭 **Smooth Navigation** with React Navigation

---

## 🧱 Tech Stack

### 🔧 Backend

* Node.js, Express.js
* PostgreSQL + Sequelize
* Socket.IO
* JWT + bcryptjs

### 📱 Frontend

* React Native (Expo)
* NativeWind (Tailwind CSS for RN)
* React Navigation
* Axios + Socket.IO Client
* React Native Paper

---

## 🗂️ Project Structure

```
fullstack_chatapp/
│
├── backend/         # Node.js + Express API
│   ├── models/      # Sequelize models
│   ├── routes/      # API endpoints
│   ├── socket/      # WebSocket logic
│   └── .env
│
└── frontend/        # React Native app (Expo)
    ├── screens/     # Auth + Chat UI
    ├── components/  # UI elements
    └── app.json     # API link config
```

---

## 🚀 Getting Started

### 🔌 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret
IP_ADDRESS_LINK="http://<YOUR_LOCAL_IP>:3000"
```

Start the server:

```bash
npm run dev
```

The backend will run at `http://localhost:5000`.

---

### 📱 Frontend Setup

```bash
cd ../frontend
npm install
```

Edit `app.json` to point to your backend:

```json
{
  "expo": {
    "extra": {
      "API_LINK": "http://<YOUR_LOCAL_IP>:5000"
    }
  }
}
```

Start Expo:

```bash
npx expo start
```

Scan the QR code with the Expo Go app on your device to run the application.

---

## 📡 API Endpoints

### 🔐 Authentication

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/session`

### 💬 Conversations

* `GET /api/conversation/:userId`
* `GET /api/conversation/chat/:conversationId`

---

## 🔌 Socket Events

| Event          | Description                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------- |
| `connection`   | User connects to the socket server                                                                 |
| `chat message` | Client sends a message (`content`, `conversationId`, `receiverId`); server broadcasts to recipient |
| `disconnect`   | User disconnects from the socket                                                                   |

### 📞 WebRTC Signaling

| Event           | Description                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| `offer`         | Caller sends an SDP offer to a specific user                                |
| `answer`        | Receiver responds with an SDP answer                                        |
| `ice-candidate` | Each side sends ICE candidates for network routing                          |
| `end-call`      | Caller/receiver ends a call; server relays `call-ended` to the peer         |
| `reject-call`   | Receiver rejects a call; server relays `call-rejected` to the peer          |

> Note: Calls use 1:1 signaling via Socket.IO, then media flows peer-to-peer.

---

## 🔮 Future Plans

* 👥 **Group Calling** (multi-party WebRTC)
* 📁 **File Sharing** (images, PDFs, documents)
* 📸 **Screenshot Sharing**

---

## 🖼️ Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/05b5eb97-b1af-4446-b548-12a686531e68" width="200" />
  <img src="https://github.com/user-attachments/assets/92274f94-87ba-4f73-bbad-4047551fbf70" width="200" />
  <img src="https://github.com/user-attachments/assets/a39e8917-8a9c-413b-b33d-cd41ce8a3dca" width="200" />
  <img src="https://github.com/user-attachments/assets/933ca7b9-811d-4fe8-86b7-dfd8d46b82c5" width="200" />
  <br/>
  <img src="https://github.com/user-attachments/assets/314b5e56-0a42-4da7-8853-5abbdcb022fd" width="200" />
  <img src="https://github.com/user-attachments/assets/c67ae03d-e37c-4735-98af-2f9c46bd412f" width="200" />
  <img src="https://github.com/user-attachments/assets/afceda71-b466-4465-9582-74c6ec2fc941" width="200" />
  <img src="https://github.com/user-attachments/assets/51b208d4-0972-45b1-8c5b-736b1f9d0f40" width="200" />
</p>

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

