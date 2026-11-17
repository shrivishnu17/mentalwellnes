# MindWell CareHub

MindWell CareHub is a full-stack mental-wellness platform that connects patients with therapists and provides role-based dashboards for patients, therapists, and administrators.

## Highlights

- Role-based access for patients, therapists, and administrators
- Secure registration and sign-in with JWT authentication
- Password hashing with bcrypt
- Patient appointment booking and status tracking
- Therapist dashboard for managing assigned sessions
- Admin dashboard with platform statistics
- Therapist discovery, search, and seeded sample profiles
- AI wellness chat with saved chat history for signed-in users

## Tech stack

| Area | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Authentication | JWT, bcryptjs, express-validator |

## Local setup

### Prerequisites

- Node.js 18+
- MongoDB Community Server running locally

### 1. Install dependencies

```bash
npm install
cd server
npm install
```

### 2. Configure environment variables

Copy `server/.env.example` to `server/.env` and set a strong `JWT_SECRET`.

```env
MONGO_URI=mongodb://127.0.0.1:27017/mindwell
JWT_SECRET=replace-with-a-long-random-secret
PORT=5001
```

### 3. Seed therapist profiles

```bash
cd server
npm run seed
```

### 4. Run the app

Start the API in one terminal:

```bash
cd server
npm start
```

Start the frontend in a second terminal:

```bash
npm run dev -- --port 5173
```

Open `http://127.0.0.1:5173` in a browser.

## Project structure

```text
src/              React pages, components, authentication context, and API client
server/           Express API, MongoDB models, routes, and middleware
server/models/    User, Therapist, Appointment, and ChatMessage schemas
server/routes/    Authentication, appointments, therapist, chat, and admin endpoints
```

## Security notes

- Environment files are excluded from version control.
- Passwords are hashed before they are stored.
- JWTs are required for protected API routes.
- Role checks are enforced by backend middleware.
- The sample accounts and weak passwords used for local demonstration must be changed or removed before deployment.

## Future improvements

- Password reset and account verification
- Production-grade AI provider integration
- Therapist availability calendar and scheduling controls
- Automated tests and CI pipeline
- Deployment configuration and HTTPS
