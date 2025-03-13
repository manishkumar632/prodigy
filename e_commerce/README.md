# StyleHub E-commerce Platform

A modern e-commerce platform for men's and women's clothing built with Next.js, TypeScript, Tailwind CSS, and MongoDB.

## Features

- **User Authentication**: Secure login and registration with NextAuth.js
- **Product Catalog**: Browse products by category, filter, and search
- **Shopping Cart**: Add products to cart, update quantities, and checkout
- **User Dashboard**: View order history and manage account details
- **Admin Dashboard**: Manage products, orders, and users
- **Responsive Design**: Fully responsive UI for all devices
- **Animations**: Smooth animations with Framer Motion
- **Favorites/Wishlist**: Add products to favorites or wishlist

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, React Icons
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Form Handling**: React Hook Form
- **API Requests**: Axios
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stylehub-ecommerce.git
   cd stylehub-ecommerce
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-change-this-in-production
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=password123
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### MongoDB Setup

#### Local MongoDB

1. Install MongoDB:
   - Windows: Download and install from [MongoDB website](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Linux: Follow [MongoDB installation guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. Start MongoDB service:
   - Windows: `net start MongoDB` (Run as Administrator)
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

3. Verify MongoDB is running:
   ```bash
   node scripts/check-mongodb.js
   ```

#### MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string from the Atlas dashboard
4. Update your `.env.local` file with the connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

## Admin Access

Access the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin)

Default admin credentials:
- Email: admin@example.com
- Password: password123

## Project Structure

```
stylehub-ecommerce/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API Routes
│   │   ├── admin/            # Admin pages
│   │   ├── cart/             # Cart page
│   │   ├── login/            # Login page
│   │   ├── register/         # Register page
│   │   ├── profile/          # User profile page
│   │   ├── men/              # Men's category page
│   │   ├── women/            # Women's category page
│   │   └── ...
│   ├── components/           # React components
│   │   ├── admin/            # Admin components
│   │   ├── layout/           # Layout components
│   │   ├── home/             # Home page components
│   │   └── ...
│   ├── lib/                  # Utility functions
│   ├── models/               # Mongoose models
│   ├── providers/            # Context providers
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
└── ...
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)

## Troubleshooting

### MongoDB Connection Issues

If you encounter MongoDB connection issues:

1. Check if MongoDB is running:
   ```bash
   node scripts/check-mongodb.js
   ```

2. Verify your connection string in `.env.local`

3. If using MongoDB Atlas, ensure your IP address is whitelisted in the Atlas dashboard

### Authentication Issues

If you encounter authentication issues:

1. Make sure your `.env.local` file has the correct `NEXTAUTH_SECRET` and `NEXTAUTH_URL`

2. Try clearing your browser cookies and local storage

3. Check the server logs for any error messages
