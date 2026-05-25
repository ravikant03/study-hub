# StudyHub Frontend

Next.js 16 frontend for the StudyHub backend.

## Stack

- Next.js `16.2.6` with App Router
- React `19`
- Tailwind CSS `4`
- Formik forms
- Yup client-side validation
- React Context for authentication state

## Setup

```bash
npm install
```

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Run the frontend:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Pages

User-facing:

- `/`
- `/categories`
- `/courses`
- `/courses/[id]`
- `/instructors`
- `/instructors/[id]`
- `/profile`
- `/enrollments`
- `/courses/[id]/content`
- `/payments/[courseId]`
- `/payments/confirmation`
- `/contact`
- `/about`
- `/login`
- `/register`

Admin-facing:

- `/admin/dashboard`
- `/admin/users`
- `/admin/categories`
- `/admin/courses`
- `/admin/instructors`
- `/admin/enrollments`
- `/admin/course-content`
- `/admin/payments`

The frontend fetches from the Express API and falls back to sample data when the backend or database has no records yet.
