# Academic Planner

A comprehensive web application for students to manage their academic life, including course management, task tracking, and AI-powered insights.

## Features

- **User Authentication**: Secure login and registration system
- **Dashboard**: Overview of academic progress and upcoming tasks
- **Course Management**: Organize and track your courses
- **Task Tracking**: Never miss a deadline with comprehensive task management
- **Calendar Integration**: Visualize your schedule
- **AI Insights**: Get personalized recommendations
- **Progress Tracking**: Monitor your academic performance

## Tech Stack

### Frontend
- React 18 with TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Vite for build tooling
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
```

4. Start the backend server:
```bash
node server.js
```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

## Usage

1. **Home Page**: Visit the application to see the landing page
2. **Registration**: Click "Get Started Free" or "Sign Up" to create an account
3. **Login**: Use your credentials to sign in
4. **Dashboard**: After login, you'll be redirected to your personalized dashboard
5. **Navigation**: Use the sidebar to navigate between different sections
6. **Logout**: Click the logout button in the header to sign out

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Other Endpoints
- `GET /api/health` - Health check endpoint

## Project Structure

```
academic_planner/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Layout/
│   │   │   └── Home/
│   │   ├── store/
│   │   ├── types/
│   │   └── App.tsx
│   └── package.json
└── README.md
```
