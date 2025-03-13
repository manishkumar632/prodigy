# Real-Time Chat Application

A full-stack real-time chat application built with React, Node.js, Socket.IO, and MongoDB.

![Chat App](https://github.com/manishkumar632/prodigy/blob/main/chatapp/images/Screenshot1.png)

## Features

- **Real-time messaging** using Socket.IO
- **User authentication** with JWT
- **Contact management** system
- **Group chat** functionality
- **File sharing** capabilities using Cloudinary
- **Message status** (read/unread)
- **Typing indicators**
- **User presence** (online/offline status)
- **Responsive design** using Tailwind CSS

## Tech Stack

### Frontend

- React (v19)
- React Router DOM (v7)
- Socket.IO Client
- Tailwind CSS
- Heroicons
- Date-fns
- Emoji Picker React
- Vite build tool

### Backend

- Node.js with Express
- MongoDB with Mongoose
- Socket.IO
- JWT Authentication
- Bcrypt for password hashing
- Multer and Cloudinary for file uploads
- CORS support

## Key Features Explained

### Authentication

- Secure user registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes

### Real-time Communication

- Instant message delivery
- Typing indicators
- Online/offline status updates
- Real-time contact updates

### Chat Features

- One-on-one messaging
- Group chat creation and management
- File sharing support
- Emoji picker
- Message timestamps
- Read receipts

### Contact Management

- Add/remove contacts
- Search users
- Custom contact names
- Contact list organization

### User Interface

- Clean and modern design
- Responsive layout
- Intuitive navigation
- Message history with scroll support

## Screenshots

### Login Page

![Login Page](https://github.com/manishkumar632/prodigy/blob/main/chatapp/images/Screenshot1.png)

### Sign Up Page

![Sign Up Page](https://github.com/manishkumar632/prodigy/blob/main/chatapp/images/Screenshot2.png)

### Chat Interface

![Chat Interface](https://github.com/manishkumar632/prodigy/blob/main/chatapp/images/Screenshot3.png)

### Add Contact

![Add Contact](https://github.com/manishkumar632/prodigy/blob/main/chatapp/images/Screenshot4.png)

### Real-Time Chat

![Real-Time Chat](https://github.com/manishkumar632/prodigy/blob/main/chatapp/images/Screenshot5.png)

## Getting Started

1. Clone the repository

```bash
git clone <repository-url>
```

2. Install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend/chatapp
npm install
```

3. Configure environment variables

- Create `.env` file in backend directory
- Set up MongoDB connection string
- Configure JWT secret
- Set up Cloudinary credentials

4. Start the application

```bash
# Start backend server
cd backend
npm run dev

# Start frontend development server
cd ../frontend/chatapp
npm run dev
```

## Project Structure

```
chatapp/
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   └── server.js      # Entry point
└── frontend/
    └── chatapp/
        ├── src/
        │   ├── components/  # React components
        │   ├── contexts/    # Context providers
        │   ├── pages/      # Page components
        │   └── utils/      # Utility functions
        └── vite.config.js  # Vite configuration
```

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is licensed under the ISC License.
