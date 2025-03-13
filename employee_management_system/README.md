# Employee Management System

A full-stack web application for managing employees with authentication, responsive design, and MongoDB integration.

## Features

- **User Authentication**: Admin and regular user roles with secure login/signup
- **Employee Management**: Create, read, update, and delete employee records
- **Advanced Filtering**: Search and filter employees by various criteria
- **Responsive Design**: Works on all devices (desktop, tablet, mobile)
- **MongoDB Integration**: Real-time database connection
- **Modern UI**: Clean, intuitive interface with animations

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Styled Components for styling
- Framer Motion for animations
- Formik & Yup for form validation
- Axios for API requests
- React Toastify for notifications

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/employee-management-system.git
cd employee-management-system
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
   - Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://pythoncourse053:qdq1mILORAr7J7zX@cluster0.txfgp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Demo Credentials

### Admin User
- Email: admin@example.com
- Password: admin123

### Regular User
- Create a new account using the signup page

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create a new employee
- `PUT /api/employees/:id` - Update an employee
- `DELETE /api/employees/:id` - Delete an employee

## License

This project is licensed under the MIT License.

## Acknowledgements

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Styled Components](https://styled-components.com/) 