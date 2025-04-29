# Task Tracker API

A RESTful API for a task tracking application built with Express.js and MongoDB.

## Features

- User authentication with JWT
- User profile management
- Project management (Create, Read, Update, Delete)
- Task management (Create, Read, Update, Delete)
- Project collaboration
- Task commenting
- Task prioritization and status tracking

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```


## Authentication

The API uses JWT (JSON Web Token) for authentication. To access protected routes, include the token in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN
```

## Limitations

- Each user can have a maximum of 4 projects
- Only project owners can delete projects and tasks
- Both project owners and collaborators can create and update tasks
- Future development - Project collaboration
