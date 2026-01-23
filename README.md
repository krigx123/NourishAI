# 🥗 NourishAI

> Your Personal AI Nutritionist for Healthier Living

NourishAI is a modern, full-stack AI-powered nutrition tracking and diet recommendation web application designed specifically for analyzing Indian meals and helping users achieve their health goals.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

### 🍽️ Meal Analysis
Analyze Indian meals instantly using AI to get detailed nutritional breakdowns including calories, macros, vitamins, and health scores.

### 📊 Nutrition Tracking
Track your daily nutritional intake with intuitive charts and progress indicators.

### 🎯 Personalized Diet Plans
Get customized diet recommendations based on your health goals, dietary preferences, and nutritional needs. Calorie targets are calculated using the Harris-Benedict equation based on your profile.

### 💡 Health Insights
Receive AI-powered insights and suggestions to improve your eating habits and achieve your fitness goals.

### 📈 Progress Tracking
Monitor your health journey with comprehensive analytics and trend visualizations.

### 🔐 User Authentication
Secure JWT-based authentication with personalized onboarding collecting age, weight, height, goals, and dietary preferences.

### 👤 Dynamic User Data
All user data is personalized - your name appears throughout the app, calorie goals are calculated from your profile, and diet plans adapt to your targets.

### 🛠️ Admin Dashboard
Real-time system monitoring with database stats, recent user activity, and API health checks.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (for PostgreSQL database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/krigx123/NourishAI.git
   cd NourishAI
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the `server` folder:
   ```env
   DATABASE_URL=your-supabase-connection-string
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

5. **Start the backend server**
   ```bash
   cd server
   node index.js
   ```

6. **Start the frontend (in a new terminal)**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | Frontend UI library |
| **Vite** | Build tool and dev server |
| **React Router** | Client-side routing |
| **Recharts** | Data visualization |
| **Lucide React** | Modern icon library |
| **CSS3** | Custom styling with modern features |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | REST API server |
| **PostgreSQL (Supabase)** | Cloud database |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |

---

## 📁 Project Structure

```
NourishAI/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── layout/          # Layout components (Navbar, Sidebar, Footer)
│   │   └── ui/              # Reusable UI components (Button, Card, Modal)
│   ├── context/
│   │   └── AuthContext.jsx  # Global auth state management
│   ├── services/
│   │   └── api.js           # API client for backend communication
│   ├── data/                # Mock data and nutrition database
│   ├── pages/               # Application pages
│   ├── styles/              # Global styles
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Application entry point
├── server/
│   ├── routes/
│   │   ├── auth.js          # Authentication endpoints
│   │   ├── meals.js         # Meal logging & favorites
│   │   ├── users.js         # User profile & dashboard
│   │   └── admin.js         # Admin statistics
│   ├── database.js          # PostgreSQL connection & schema
│   ├── index.js             # Express server entry
│   └── .env                 # Environment variables
├── package.json
└── vite.config.js
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user with profile
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user

### Meals
- `POST /api/meals/log` - Log a meal
- `GET /api/meals/today` - Get today's meals
- `GET /api/meals/history` - Get weekly history
- `POST /api/meals/favorites` - Add to favorites
- `POST /api/meals/water` - Log water intake

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/dashboard` - Get personalized dashboard data
- `GET /api/users/export` - Export all user data
- `DELETE /api/users/account` - Delete account

### Admin
- `GET /api/admin/stats` - Get system statistics

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `cd server && node index.js` | Start backend server |

---

## 🎨 Screenshots

*Coming soon*

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Advik** - [GitHub](https://github.com/krigx123)

---

<p align="center">Made with ❤️ for healthier living</p>
