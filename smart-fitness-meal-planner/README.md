# 💪 Smart Fitness Routine & Meal Planner

A full-stack web application that provides personalized fitness routines and meal plans based on user goals. Built with **Angular 18**, **Node.js (TypeScript)**, **Express**, and **MySQL**.

![Tech Stack](https://img.shields.io/badge/Angular-18-red)
![Node.js](https://img.shields.io/badge/Node.js-TypeScript-green)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue)

## ✨ Features

### Core Features
- ✅ **User Authentication** - Secure JWT-based authentication with role-based access control
- ✅ **Profile Management** - Create and update user profiles with fitness goals
- ✅ **Personalized Workouts** - Auto-generated weekly workout routines based on goals (weight loss, muscle gain, maintenance)
- ✅ **Meal Planning** - Customized meal plans with calorie and macro tracking
- ✅ **Progress Tracking** - Track weight progress with visual charts
- ✅ **Workout History** - View past completed exercises
- ✅ **Admin Dashboard** - User management and analytics for trainers/admins

### Enhanced Features
- 📊 **Progress Charts** - Visual weight tracking using Chart.js
- 📝 **Workout Completion Tracking** - Mark exercises as completed
- 🍽️ **Meal Adherence Tracking** - Track consumed meals
- 👥 **Role-Based Access** - User, Trainer, and Admin roles with different permissions

## 🏗️ Project Structure

```
smart-fitness-meal-planner/
├── backend/                    # Node.js + TypeScript + Express
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Auth, role, error middleware
│   │   ├── models/            # Data models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helper functions
│   │   ├── validators/        # Input validation
│   │   └── server.ts          # Express app entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
└── frontend/                   # Angular 18
    ├── src/
    │   ├── app/
    │   │   ├── core/          # Models, services, guards
    │   │   ├── features/      # Feature modules (auth, dashboard, etc.)
    │   │   ├── shared/        # Shared components
    │   │   ├── app.component.ts
    │   │   ├── app.routes.ts
    │   │   └── app.config.ts
    │   ├── index.html
    │   ├── main.ts
    │   └── styles.scss
    ├── angular.json
    ├── package.json
    └── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MySQL** (v8 or higher)
- **Angular CLI** (v18)

### Installation

#### 1. Clone the Repository

```bash
cd smart-fitness-meal-planner
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your MySQL credentials
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=fitness_planner

# Run database migrations
npm run build
node dist/config/migrate.js

# Start the backend server
npm run dev
```

The backend server will start on **http://localhost:3000**

#### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend application will start on **http://localhost:4200**

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  gender ENUM('male', 'female', 'other') NOT NULL,
  height DECIMAL(5,2) NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  goal ENUM('weight_loss', 'muscle_gain', 'maintenance') NOT NULL,
  role ENUM('user', 'trainer', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Workout_Meal_Plans Table
```sql
CREATE TABLE workout_meal_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  week_start_date DATE NOT NULL,
  day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
  exercises JSON NOT NULL,
  meals JSON NOT NULL,
  completed_exercises JSON DEFAULT ('[]'),
  completed_meals JSON DEFAULT ('[]'),
  weight_log DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password

### Workouts
- `GET /api/workouts/weekly` - Get weekly workout plan
- `POST /api/workouts/generate` - Generate new workout plan
- `PUT /api/workouts/complete` - Mark exercise as completed
- `GET /api/workouts/history` - Get workout history

### Meals
- `GET /api/meals/daily` - Get daily meal plan
- `POST /api/meals/generate` - Generate new meal plan
- `PUT /api/meals/complete` - Mark meal as consumed

### Progress
- `GET /api/progress` - Get progress data
- `POST /api/progress` - Add progress entry
- `GET /api/progress/charts` - Get chart data

### Admin (Trainer/Admin only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/analytics` - Get system analytics
- `PUT /api/admin/users/:userId` - Update user details
- `DELETE /api/admin/users/:userId` - Delete user

## 🎨 Frontend Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/login` | LoginComponent | User login page |
| `/register` | RegisterComponent | User registration page |
| `/dashboard` | DashboardComponent | Main dashboard |
| `/profile` | ProfileComponent | User profile management |
| `/workouts` | WorkoutRoutineComponent | Weekly workout routine |
| `/meals` | MealPlannerComponent | Daily meal planner |
| `/progress` | ProgressTrackerComponent | Progress tracking & charts |
| `/admin` | AdminDashboardComponent | Admin dashboard (admin/trainer only) |

## 🔐 Authentication & Security

- **JWT Tokens** - Secure authentication with access and refresh tokens
- **Password Hashing** - bcrypt for secure password storage
- **HTTP-Only Cookies** - Tokens stored in HTTP-only cookies
- **Role-Based Access Control** - User, Trainer, and Admin roles
- **Route Guards** - Angular guards protect frontend routes
- **Input Validation** - express-validator for backend validation
- **CORS Configuration** - Configured for frontend-backend communication

## 🎯 User Roles

### User
- Create and manage profile
- View personalized workout and meal plans
- Track progress
- Mark exercises and meals as completed

### Trainer/Admin
- All user permissions
- View all users
- Access analytics dashboard
- Manage user accounts
- Update user roles and goals

## 📝 Usage Guide

### 1. Register a New Account
1. Navigate to `/register`
2. Fill in all required fields:
   - Full Name, Email, Password
   - Age, Gender
   - Height (cm), Weight (kg)
   - Fitness Goal (Weight Loss, Muscle Gain, or Maintenance)
3. Click "Register"

### 2. Generate Workout Plan
1. Login to your account
2. Navigate to "Workouts"
3. Click "Generate Workout Plan"
4. View your personalized weekly workout routine

### 3. Generate Meal Plan
1. Navigate to "Meals"
2. Click "Generate Meal Plan"
3. View daily meals with calorie and macro information

### 4. Track Progress
1. Navigate to "Progress"
2. Log your current weight
3. View progress charts and statistics

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev        # Start development server with nodemon
npm run build      # Compile TypeScript
npm start          # Start production server
```

### Frontend Development
```bash
cd frontend
npm start          # Start development server
npm run build      # Build for production
npm run watch      # Build and watch for changes
```

## 🧪 Testing

### Test User Credentials
After setting up the database, you can create a test user via the registration page or manually insert into the database.

### API Testing
Use tools like Postman or curl to test API endpoints:

```bash
# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "name": "Test User",
    "age": 25,
    "gender": "male",
    "height": 175,
    "weight": 70,
    "goal": "muscle_gain"
  }'
```

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Check `.env` file credentials
- Verify database exists: `CREATE DATABASE fitness_planner;`

### Frontend Not Loading
- Clear browser cache
- Check if backend is running on port 3000
- Verify CORS configuration in backend

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Use `ng serve --port 4201`

## 📦 Dependencies

### Backend
- express - Web framework
- mysql2 - MySQL client
- bcrypt - Password hashing
- jsonwebtoken - JWT authentication
- dotenv - Environment variables
- cors - CORS middleware
- express-validator - Input validation
- cookie-parser - Cookie parsing

### Frontend
- @angular/core - Angular framework
- @angular/router - Routing
- @angular/forms - Forms
- @angular/material - UI components
- chart.js - Charts
- ng2-charts - Angular chart wrapper

## 🤝 Contributing

This is a project template. Feel free to customize and extend it based on your needs.

## 📄 License

MIT License

## 👨‍💻 Author

Created as a full-stack fitness and meal planning application.

---

**Happy Coding! 💪🏋️‍♂️🍽️**
