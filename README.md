# RentOso Frontend MVP

A React-based frontend application for property management with session-based authentication.

## Session Management

This application implements a session cookie pattern for authentication:

### Architecture

1. **Firebase Auth**: Handles initial user authentication and provides ID tokens
2. **Session Cookies**: Backend validates Firebase ID tokens and creates session cookies
3. **Frontend Session Validation**: Uses session cookies to maintain user sessions

### Key Components

- **AuthContext**: Manages authentication state and session validation
- **UserStore**: Zustand store for user data (profile, agent, session state)
- **AuthService**: Service layer for login/logout operations
- **SignIn**: Handles user authentication and session creation
- **CustomAdminLayout**: Protected layout that validates sessions

### Session Flow

1. User enters credentials in SignIn component
2. Firebase Auth validates credentials and returns ID token
3. ID token is sent to backend via `authLogin()` function
4. Backend validates token and creates session cookie
5. Frontend clears Firebase auth state and relies on session cookies
6. Subsequent requests use session cookies for authentication
7. Session validation happens on app load and route changes

### User Data Management

- User profile and agent data are stored in Zustand store
- Data is retrieved using Firebase UID from session
- Store provides utility functions for easy access to user state

### Environment Variables

Required environment variables:

- `VITE_API_URL`: Backend API URL
- `VITE_WORKSPACE_CHAT`: AI chat webhook URL

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
