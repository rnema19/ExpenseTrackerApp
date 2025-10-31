# 💰 Expense Tracker Application

A full-stack expense tracking application built with React.js frontend and Node.js/Express backend, featuring JWT authentication, data visualization, and comprehensive expense management.

## 🌟 Features

### 🔐 Authentication
- User registration and login with JWT tokens
- Protected routes with automatic redirect to login
- Secure password hashing with bcrypt
- Persistent login sessions with localStorage

### 💼 Expense Management
- **Add Expenses**: Create new expenses with title, amount, category, and date
- **View Expenses**: Display all expenses in a responsive table format
- **Edit Expenses**: Update existing expenses with pre-filled forms
- **Delete Expenses**: Remove expenses with confirmation dialog
- **Search & Filter**: Filter by category, date, or search by title

### 📊 Data Visualization
- **Category-wise Pie Chart**: Visual distribution of expenses by category
- **Title-wise Bar Chart**: Individual expense amounts visualization
- **Summary Statistics**: Total expenses, average expense, and transaction count

### 🎨 User Interface
- Modern, responsive design with Tailwind CSS
- Dark navigation bar with smooth hover effects
- Professional gradient backgrounds
- Mobile-friendly responsive layout
- Real-time data updates

## 🛠️ Tech Stack

### Frontend
- **React.js** - Component-based UI framework
- **React Router DOM** - Client-side routing
- **Chart.js** - Data visualization library
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

## 📁 Project Structure

```
Sidlabs/
├── backend/
│   ├── middleware/
│   │   └── auth.js                 # JWT authentication middleware
│   ├── model/
│   │   ├── expenseSchema.js        # Expense data model
│   │   └── userSchema.js           # User data model
│   ├── routes/
│   │   ├── authRoutes.js           # Authentication endpoints
│   │   └── expenseRoutes.js        # Expense CRUD endpoints
│   ├── app.js                      # Express server setup
│   ├── package.json                # Backend dependencies
│   └── .env                        # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddExpenses.jsx     # Add expense form
│   │   │   ├── Chart.jsx           # Data visualization
│   │   │   ├── EditExpenses.jsx    # Edit expense form
│   │   │   ├── Expenses.jsx        # Expense list & filters
│   │   │   ├── Footer.jsx          # Footer component
│   │   │   ├── Header.jsx          # Navigation header
│   │   │   ├── Login.jsx           # Login/Register form
│   │   │   └── ui/
│   │   │       └── button.jsx      # shadcn button component
│   │   ├── lib/
│   │   │   ├── api.js              # API utility functions
│   │   │   └── utils.js            # Utility functions
│   │   ├── App.jsx                 # Main application component
│   │   └── main.jsx                # Application entry point
│   ├── package.json                # Frontend dependencies
│   └── vite.config.js              # Vite configuration
└── README.md                       # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Configuration

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server runs on `http://localhost:3000`

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

3. **Access the Application**
   Open your browser and navigate to `http://localhost:5173`

## 📝 API Endpoints

### Authentication Routes (`/auth`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/user` - Get user information
- `POST /auth/logout` - User logout

### Expense Routes (`/expenses`) - All Protected
- `GET /expenses/view-expense` - Get all expenses
- `GET /expenses/:id/edit-expense` - Get single expense
- `POST /expenses/add-expense` - Create new expense
- `PUT /expenses/:id/edit-expense` - Update expense
- `DELETE /expenses/:id/delete-expense` - Delete expense

## 💾 Database Schema

### User Schema
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  fullName: String (optional)
}
```

### Expense Schema
```javascript
{
  exp_id: Number (auto-increment),
  title: String (required),
  amount: Number (required),
  category: String (required),
  date: Date (required)
}
```

## 🎯 Usage

1. **Registration/Login**
   - Create a new account or login with existing credentials
   - JWT token automatically stored for persistent sessions

2. **Adding Expenses**
   - Click "Add Expense" button in navigation
   - Fill out the form with title, amount, category, and date
   - Submit to add the expense to your tracker

3. **Viewing Expenses**
   - View all expenses in a responsive table
   - See total expenses summary card
   - Use filters to search by category, date, or title

4. **Managing Expenses**
   - Edit expenses using the blue edit button
   - Delete expenses using the red delete button
   - Confirmation required for deletions

5. **Data Visualization**
   - Click "Charts" to view expense analytics
   - See category-wise distribution pie chart
   - View title-wise expense bar chart

## 🔧 Features in Detail

### Authentication System
- **JWT-based authentication** with secure token storage
- **Protected routes** with automatic redirect
- **Password hashing** using bcrypt
- **Persistent sessions** across browser refreshes

### Expense Management
- **CRUD operations** for expenses
- **Real-time updates** without page refresh
- **Form validation** with error handling
- **Date formatting** in Indian locale (DD/MM/YYYY)

### Search & Filter
- **Text search** through expense titles
- **Category filtering** with dynamic dropdown
- **Date filtering** with date picker
- **Combined filters** with AND logic
- **Clear all filters** functionality

### Data Visualization
- **Interactive charts** using Chart.js
- **Category distribution** pie chart
- **Expense comparison** bar chart
- **Summary statistics** with key metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rishabh**
- GitHub: [@yourgithub](https://github.com/yourgithub)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [React.js](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Chart.js](https://www.chartjs.org/) - Data visualization
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components

---

Made with ❤️ for expense tracking and financial management