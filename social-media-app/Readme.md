# Msocio - Social Media Application

A full-stack social media platform built with Django REST Framework and React that allows users to connect, share posts, and interact with content.

## Features

- **User Authentication**

  - Sign up with email, name, date of birth, and gender
  - Secure login system
  - Protected routes requiring authentication

- **User Profiles**

  - Customizable user profiles
  - Profile image upload using Cloudinary
  - View other users' profiles

- **Posts**
  - Create posts with text content
  - Upload multiple images with posts
  - View posts in chronological order
  - Like and interact with posts

## Tech Stack

### Backend

- Django
- Django REST Framework
- Cloudinary for image storage
- Token-based authentication
- CORS enabled for frontend communication

### Frontend

- React
- React Router for navigation
- Context API for state management
- Vite as build tool

## Project Structure

```
social-media-app/
├── backend/
│   ├── msocio/          # Django project settings
│   └── api/             # Django app with models and views
├── frontend/
│   └── msocio/         # React application
└── Safe/               # Security implementations
```

## Security Features

- CSRF protection
- Secure password hashing
- JSON validation
- Protected API endpoints
- Token-based authentication

## Screenshots

# Msocio Login page

![Msocio](https://github.com/manishkumar632/prodigy/blob/main/social-media-app/images/Screenshot1.png)

# Sign Up Page

![Msocio](https://github.com/manishkumar632/prodigy/blob/main/social-media-app/images/Screenshot2.png)

# Home page

![Msocio](https://github.com/manishkumar632/prodigy/blob/main/social-media-app/images/Screenshot3.png)

# User Profile

![Msocio](https://github.com/manishkumar632/prodigy/blob/main/social-media-app/images/Screenshot4.png)

# Create Post

![Msocio](https://github.com/manishkumar632/prodigy/blob/main/social-media-app/images/Screenshot5.png)

# User can Like post.

![Msocio](https://github.com/manishkumar632/prodigy/blob/main/social-media-app/images/Screenshot6.png)

## Getting Started

### Prerequisites

- Python 3.x
- Node.js
- npm/yarn

### Backend Setup

1. Navigate to backend directory
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Set up environment variables:

   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_CLOUD_API
   - CLOUDINARY_CLOUD_API_SECRET

4. Run migrations:

   ```
   python manage.py migrate
   ```

5. Start server:
   ```
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to frontend/msocio directory
2. Install dependencies:
   ```
   npm install
   ```
3. Start development server:
   ```
   npm run dev
   ```

## API Endpoints

- POST `/signup/` - User registration
- POST `/login/` - User authentication
- GET `/posts/` - Fetch all posts
- POST `/posts/` - Create new post
- GET `/profile/:id/` - Fetch user profile

## Contributing

Feel free to fork the repository and submit pull requests.

