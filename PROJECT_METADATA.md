# Project Metadata: fileUpload

## Purpose

A beginner-friendly Node.js file upload application. Users can register and log in, upload one file to Cloudinary, and save the file URL and metadata in MongoDB. Users can view their own uploaded files. Admins can view all files.

## Project Structure

```text
fileUpload/
├── server.js                 # Loads environment variables and starts MongoDB/server
├── package.json              # Scripts and dependencies
├── .env.example              # Required environment variable template
├── .gitignore                # Ignored local/generated files
├── PROJECT_METADATA.md       # This project guide
├── Public/                   # Browser frontend
│   ├── index.html            # Login and registration page
│   ├── dashboard.html        # Authenticated upload dashboard
│   ├── styles.css            # Shared frontend styles
│   ├── login.js              # Login and registration behavior
│   └── dashboard.js          # Upload, listing, and logout behavior
├── src/                      # Backend source code
│   ├── app.js                # Express app, static files, routes, and errors
│   ├── config/
│   │   └── cloudinary.js     # Cloudinary configuration
│   ├── controllers/
│   │   ├── authController.js # Register and login logic
│   │   └── fileController.js # Upload and file-list logic
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication and admin authorization
│   │   └── multer.js         # In-memory upload handling and 5 MiB limit
│   ├── models/
│   │   ├── User.js           # User MongoDB schema
│   │   └── File.js           # File MongoDB schema
│   └── routes/
│       ├── auth.js           # Authentication route mappings
│       └── fileRoutes.js     # File route mappings
└── Uploads/                  # Legacy/local folder; current files use Cloudinary
```

## Application Flow

1. `server.js` loads `.env`, connects to MongoDB, and starts the Express app.
2. `src/app.js` serves the `Public/` frontend and mounts the routers.
3. `/auth/register` creates a normal user after validating and hashing the password.
4. `/auth/login` checks the password and returns a JWT.
5. `/upload` requires a JWT, receives the `myFile` multipart field, and buffers the file with Multer.
6. The file buffer is uploaded to Cloudinary.
7. Cloudinary URL and file metadata are saved in MongoDB with the logged-in user's ID.
8. `/files` returns the current user's files. `/admin/files` requires the `admin` role and returns all files.

## Routes

- `GET /login` - Login page
- `GET /dashboard` - Dashboard page
- `POST /auth/register` - Create a user
- `POST /auth/login` - Log in and receive a JWT
- `POST /upload` - Upload one file with `Authorization: Bearer <token>` and field name `myFile`
- `GET /files` - List the logged-in user's files
- `GET /admin/files` - List all files for admins

## Setup

1. Copy `.env.example` to `.env`.
2. Add MongoDB, JWT, and Cloudinary values.
3. Install packages with `npm install`.
4. Start the app with `npm start`.
5. Open `http://localhost:3000/login`.

## Coding Rules

- Keep backend code inside `src/`.
- Keep route files simple: define URLs, middleware, and controller functions only.
- Keep database and business logic inside controllers and models.
- Preserve the upload field name `myFile` unless the API contract is intentionally changed.
- Never commit `.env`, `node_modules/`, logs, or generated upload files.
- Registration must not accept an admin role from the client.
- Use small, clear changes that are easy for a beginner to follow.
