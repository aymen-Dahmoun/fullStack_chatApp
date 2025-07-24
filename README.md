# Full-Stack Chat Application
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/aymen-Dahmoun/fullStack_chatApp)

This is a comprehensive, real-time chat application built with a modern stack. It features a React Native frontend for a cross-platform mobile experience and a robust Node.js backend. The application supports user authentication, private conversations, and instant messaging powered by WebSockets.

## Features

-   **Real-time Messaging**: Leverages Socket.IO for instant, bidirectional communication between users.
-   **User Authentication**: Secure user registration and login system using JSON Web Tokens (JWT).
-   **Persistent Conversations**: All conversations and messages are stored in a PostgreSQL database using the Sequelize ORM.
-   **One-on-One Chat**: Users can engage in private, one-on-one conversations.
-   **Cross-Platform Frontend**: Built with React Native and Expo, enabling deployment on both iOS and Android.
-   **Modern UI**: Styled with NativeWind, bringing the power and convenience of Tailwind CSS to React Native.
-   **Intuitive Navigation**: Smooth screen transitions managed by React Navigation.

## Tech Stack

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- Sequelize
- Socket.IO
- JSON Web Token (JWT)
- Bcryptjs

**Frontend:**
- React Native
- Expo
- NativeWind (for Tailwind CSS)
- React Navigation
- Socket.IO Client
- Axios
- React Native Paper

## Project Structure

The repository is organized into a monorepo structure with two main directories:

-   `backend/`: Contains the Node.js/Express server, API routes, database models, and WebSocket logic.
-   `frontend/`: Contains the React Native (Expo) mobile application, including screens, components, and hooks.

---

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm (or yarn)
-   A running PostgreSQL instance

### 1. Clone the Repository

```bash
git clone https://github.com/aymen-dahmoun/fullstack_chatapp.git
cd fullstack_chatapp
```

### 2. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the `backend` root directory. This file will store your environment variables. Add the following, replacing the placeholder values with your PostgreSQL credentials:
    ```env
    DB_NAME=your_db_name
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_HOST=localhost
    DB_PORT=5432
    IP_ADDRESS_LINK="http://<YOUR_LOCAL_IP>:3000" # Frontend URL for CORS
    JWT_SECRET=your_super_secret_jwt_key
    ```

4.  Start the backend server:
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:5000`.

### 3. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  The frontend needs to know the address of the backend server. Create or modify the `app.json` file in the `frontend` root to include your backend server address under the `extra` key.
    
    *Replace `<YOUR_LOCAL_IP>` with your machine's local IP address so your mobile device can reach the server.*

    ```json
    {
      "expo": {
        "name": "frontend",
        "slug": "frontend",
        "version": "1.0.0",
        "extra": {
          "API_LINK": "http://<YOUR_LOCAL_IP>:5000"
        }
      }
    }
    ```

4.  Start the Expo development server:
    ```bash
    npx expo start
    ```
5.  Scan the QR code with the Expo Go app on your iOS or Android device to run the application.

## API Endpoints

The backend exposes the following RESTful endpoints:

-   **Authentication**
    -   `POST /api/auth/register`: Register a new user.
    -   `POST /api/auth/login`: Log in a user and receive a JWT.
    -   `GET /api/session`: Get the current user's session data using a valid JWT.
-   **Conversations**
    -   `GET /api/conversation/:userId`: Fetch all conversations for a specific user.
    -   `GET /api/conversation/chat/:conversationId`: Fetch all messages within a specific conversation.

## Socket Events

The application uses Socket.IO for real-time communication.

-   **`connection`**: A user connects to the socket server upon successful authentication.
-   **`chat message`**: Sent from a client to the server with message data (`content`, `conversationId`, `receiverId`). The server then broadcasts this message to the appropriate recipient.
-   **`disconnect`**: A user disconnects from the server.

🔮 Future Plans
We aim to expand the capabilities of this chat application beyond text-based communication. Planned features include:

Voice and Video Calling:
Integration of WebRTC to enable peer-to-peer voice and video calls for a more immersive communication experience.

File Sharing:
Support for sending and receiving:

Images

Videos

Documents (PDF, DOCX, etc.)
