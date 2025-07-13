# Frontend Setup Guide

This guide explains how to set up the frontend to work with your Go backend and JWT authentication.

## Prerequisites

1. **Backend Setup**: Make sure your backend is running on `http://localhost:8080`
2. **JWT Secret**: Ensure your backend has the `SECRET` environment variable set

## Environment Configuration

Create a `.env` file in the frontend root directory:

```bash
# API Configuration
VITE_API_URL=http://localhost:8080
```

## Backend JWT Configuration

Your backend requires a `SECRET` environment variable for JWT token generation. In your backend directory, create a `.env` file:

```bash
# Required for JWT token generation
SECRET=your-secure-secret-key-here

# Optional: Database configuration
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=placementlog
# DB_USER=postgres
# DB_PASSWORD=password
```

**Important**: The `SECRET` environment variable is **required** for JWT token generation. Without it, the server will generate malformed tokens that cause authentication errors.

## Running the Application

1. **Start the Backend**:
   ```bash
   cd ../Backend
   make runServer
   # or manually
   go build -o server ./cmd/main.go
   ./server
   ```

2. **Start the Frontend**:
   ```bash
   npm run dev
   ```

3. **Access the Application**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8080`

## Features

### User Features
- **Authentication**: Login/Register with username and password
- **Post Creation**: Create placement posts with company details, role, CTC, CGPA, rounds, and experience
- **Post Viewing**: View all approved posts on the dashboard
- **Post Management**: Users can view their own posts

### Admin Features
- **Admin Dashboard**: Access via `/admin` route
- **Post Review**: Approve or reject pending posts
- **Post Management**: Delete any post as admin
- **Post Overview**: View all posts (approved and pending)

## API Integration

The frontend is now fully integrated with your backend API:

- **Authentication**: Uses JWT tokens stored in localStorage
- **Post Management**: CRUD operations for posts
- **Admin Functions**: Review and manage posts
- **Error Handling**: Proper error messages and loading states

## JWT Token Handling

The frontend automatically:
1. Sends JWT tokens in the `Authorization: Bearer <token>` header
2. Includes user ID in the `X-User-ID` header for authenticated requests
3. Handles token expiration and logout
4. Stores tokens securely in localStorage

## Troubleshooting

### "unauthorized: invalid token: token is malformed"
This error occurs when the `SECRET` environment variable is not set in your backend.

**Solution**: Set the `SECRET` environment variable in your backend:
```bash
export SECRET=your-secure-secret-key-here
```

### CORS Issues
The backend is configured to allow requests from any origin. If you encounter CORS issues, check that your backend is running and accessible.

### Authentication Issues
1. Ensure the backend is running
2. Check that the `SECRET` environment variable is set
3. Verify the API URL in your frontend `.env` file
4. Clear localStorage and try logging in again

## Security Notes

- **Never commit the actual SECRET value** to version control
- Use a strong, random secret in production
- Consider using environment-specific secrets
- Rotate secrets periodically in production 