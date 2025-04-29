Task Tracker Application
A full-stack Task Tracker application built with MERN stack (MongoDB, Express, React, Node.js).
Features

User Authentication (Login/Register)
Project Management
Task Management with status tracking
Task Comments
User Profile Management

Tech Stack
Frontend

React
React Router for navigation
Context API for state management
Axios for API requests
Tailwind CSS for styling

Backend

Node.js with Express
MongoDB for database
JWT for authentication

Getting Started
Prerequisites

Node.js
MongoDB

Installation

Clone the repository
Install dependencies for frontend and backend

bash# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

Set up environment variables:

Create a .env file in the backend folder with the following variables:
```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```

Create a .env file in the frontend folder with the following variables:
VITE_API_URL=http://localhost:5000



Run the application:

# Run backend -
cd backend
npm start

# Run frontend in a separate terminal
cd frontend
npm run dev

Access the application at http://localhost:5173

Usage

Register a new account
Create projects and tasks
Manage tasks and track progress
Update your profile information