# StudyHub Backend

Node.js Express backend for the StudyHub education platform.

## Stack

- Express.js
- MongoDB / Mongoose
- JWT authentication
- Cloudinary uploads
- Nodemailer OTP emails
- Razorpay payments

## Setup

```bash
cd backend
npm install
npm run dev
```

The API runs at:

```txt
http://localhost:5000
```

Create `backend/.env` from `backend/.env.example` and fill MongoDB, JWT, Cloudinary, SMTP, and Razorpay values.

## Main API Groups

- `/api/auth`
- `/api/users`
- `/api/categories`
- `/api/courses`
- `/api/instructors`
- `/api/enrollments`
- `/api/payments`
- `/api/course-content`

## Upload Fields

- User avatar: `avatar`
- Category image: `image`
- Course thumbnail: `thumbnail`
- Course preview video: `previewVideo`
- Course content media: `media`
