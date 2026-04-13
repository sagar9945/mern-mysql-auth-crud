# MERN Stack Authentication System with MySQL

A full-stack web application built with **MySQL, Express.js, React.js, and Node.js** featuring secure user authentication and a dashboard with complete CRUD operations.

---

## 📸 Screenshots

> See the `/screenshots` folder for all required screenshots.

---

## 🛠 Tech Stack

**Frontend:** React.js, React Router, Axios, Tailwind CSS, React Context API  
**Backend:** Node.js, Express.js, MySQL, mysql2, bcryptjs, jsonwebtoken, Nodemailer

---

## 📁 Project Structure

```
mern-mysql-auth-crud/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── itemController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── itemRoutes.js
│   ├── .env.example
│   ├── .gitignore
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js
│   │   │   ├── authApi.js
│   │   │   └── itemApi.js
│   │   ├── context/AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── PublicRoute.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .gitignore
│   └── package.json
├── database.sql
├── screenshots/
└── README.md
```

---

## 🗄 MySQL Database Setup

### 1. Install MySQL
Download from: https://dev.mysql.com/downloads/ or use XAMPP/WAMP

### 2. Create Database and Tables
**Option A — Using terminal:**
```bash
mysql -u root -p < database.sql
```

**Option B — Using MySQL Workbench or phpMyAdmin:**
- Open MySQL Workbench
- Connect to your local MySQL server
- Open and run the `database.sql` file

### 3. Verify Setup
```sql
USE mern_auth_db;
SHOW TABLES;
DESCRIBE users;
DESCRIBE items;
```

---

## ⚙️ Backend Setup

### 1. Navigate to backend folder
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment file
Copy `.env.example` to `.env` and fill in your values:
```bash
copy .env.example .env
```

Edit `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mern_auth_db
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
CLIENT_URL=http://localhost:5173
```

### 4. Start the backend server
```bash
npm run dev
```
Backend runs at: `http://localhost:5000`

---

## 💻 Frontend Setup

### 1. Navigate to frontend folder
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Start the frontend
```bash
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 🚀 Running Both Projects

Open **two separate terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Then open your browser at: **http://localhost:5173**

---

## 📡 API Endpoint Documentation

### Base URL: `http://localhost:5000/api`

---

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and get JWT token | No |
| POST | `/auth/forgot-password` | Send password reset email | No |
| POST | `/auth/reset-password` | Reset password with token | No |
| GET | `/auth/me` | Get current logged-in user | ✅ Yes |

#### POST `/auth/register`
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com" }
}
```

#### POST `/auth/login`
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/auth/forgot-password`
**Request Body:**
```json
{ "email": "john@example.com" }
```

#### POST `/auth/reset-password`
**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "newpassword123"
}
```

---

### 📋 Items / Dashboard Endpoints
> All endpoints require `Authorization: Bearer <token>` header

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/items` | Get all items for logged-in user |
| GET | `/items/:id` | Get single item by ID |
| POST | `/items` | Create new item |
| PUT | `/items/:id` | Update item |
| DELETE | `/items/:id` | Delete item |
| GET | `/items/stats` | Get dashboard statistics |

#### POST `/items`
**Request Body:**
```json
{
  "title": "My Task",
  "description": "Task description here",
  "status": "active"
}
```
Status options: `active` | `pending` | `completed`

#### GET `/items/stats`
**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 5,
    "active": 2,
    "pending": 2,
    "completed": 1
  }
}
```

---

## 🔒 Security Features

- Passwords hashed with **bcryptjs** (salt rounds: 10)
- **JWT tokens** with expiry for session management
- **Parameterized queries** to prevent SQL injection
- Auto **logout on 401** responses
- `.env` file excluded from Git
- CORS configured for frontend origin only

---

## 👤 Author

**Sagar M D**  
Institution: CampusPe  
Mentor: Jacob Dennis  
Assignment: MERN Stack Authentication & CRUD with MySQL
