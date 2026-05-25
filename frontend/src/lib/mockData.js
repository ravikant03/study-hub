export const fallbackCategories = [
  {
    _id: "cat-web",
    name: "Web Development",
    slug: "web-development",
    description: "Frontend, backend, and full-stack development paths.",
    image: { url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop" }
  },
  {
    _id: "cat-data",
    name: "Data Science",
    slug: "data-science",
    description: "Analytics, machine learning, and practical data workflows.",
    image: { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop" }
  },
  {
    _id: "cat-design",
    name: "Design",
    slug: "design",
    description: "UX research, product design, and visual systems.",
    image: { url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop" }
  }
];

export const fallbackInstructors = [
  {
    _id: "ins-a",
    bio: "Full-stack engineer and mentor focused on production-grade learning.",
    expertise: ["Node.js", "React", "System Design"],
    user: {
      name: "Aarav Mehta",
      email: "aarav@studyhub.local",
      avatar: { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop" }
    }
  },
  {
    _id: "ins-b",
    bio: "Data scientist helping students turn statistics into decisions.",
    expertise: ["Python", "ML", "Dashboards"],
    user: {
      name: "Nisha Rao",
      email: "nisha@studyhub.local",
      avatar: { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop" }
    }
  }
];

export const fallbackUsers = [
  {
    _id: "user-student",
    name: "Demo Student",
    email: "student@studyhub.local",
    role: "student",
    isActive: true
  },
  {
    _id: "user-instructor",
    name: "Demo Instructor",
    email: "instructor@studyhub.local",
    role: "instructor",
    isActive: true
  },
  {
    _id: "user-admin",
    name: "Demo Admin",
    email: "admin@studyhub.local",
    role: "admin",
    isActive: true
  }
];

export const fallbackCourses = [
  {
    _id: "course-node",
    title: "Backend Engineering with Node.js",
    slug: "backend-engineering-nodejs",
    description: "Build secure APIs, authentication flows, payments, and production-ready services.",
    price: 3999,
    level: "intermediate",
    durationMinutes: 720,
    category: fallbackCategories[0],
    instructor: fallbackInstructors[0],
    thumbnail: { url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop" },
    syllabus: [
      { title: "Express foundations", description: "Routing, middleware, errors, and validation." },
      { title: "Data and auth", description: "MongoDB schemas, JWTs, and role guards." },
      { title: "Payments and uploads", description: "Razorpay, Cloudinary, and deployment readiness." }
    ]
  },
  {
    _id: "course-react",
    title: "Modern Frontend with Next.js",
    slug: "modern-frontend-nextjs",
    description: "Create responsive, data-driven applications using the App Router and robust forms.",
    price: 2999,
    level: "beginner",
    durationMinutes: 540,
    category: fallbackCategories[0],
    instructor: fallbackInstructors[0],
    thumbnail: { url: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=900&auto=format&fit=crop" },
    syllabus: [
      { title: "App architecture", description: "Layouts, routes, and state." },
      { title: "Forms", description: "Formik and Yup validation." }
    ]
  },
  {
    _id: "course-data",
    title: "Applied Data Analytics",
    slug: "applied-data-analytics",
    description: "Analyze business data, build reports, and communicate insights clearly.",
    price: 2499,
    level: "beginner",
    durationMinutes: 480,
    category: fallbackCategories[1],
    instructor: fallbackInstructors[1],
    thumbnail: { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop" },
    syllabus: [
      { title: "Data cleaning", description: "Prepare messy data for analysis." },
      { title: "Visualization", description: "Build reports that drive action." }
    ]
  }
];

export const fallbackEnrollments = [
  {
    _id: "enroll-1",
    status: "active",
    progressPercent: 42,
    enrolledAt: "2026-04-21T10:00:00.000Z",
    course: fallbackCourses[0]
  },
  {
    _id: "enroll-2",
    status: "completed",
    progressPercent: 100,
    enrolledAt: "2026-03-10T10:00:00.000Z",
    course: fallbackCourses[2]
  }
];

export const fallbackContent = [
  {
    _id: "content-1",
    title: "Welcome and course roadmap",
    type: "video",
    order: 1,
    isPreview: true,
    description: "Start here for the course structure and project expectations."
  },
  {
    _id: "content-2",
    title: "API design notes",
    type: "pdf",
    order: 2,
    description: "Reference material for endpoint design and data modeling."
  },
  {
    _id: "content-3",
    title: "Build the first module",
    type: "assignment",
    order: 3,
    description: "Submit your first authenticated route implementation."
  }
];

export const fallbackPayments = [
  {
    _id: "pay-1",
    amount: 3999,
    currency: "INR",
    status: "captured",
    method: "razorpay",
    createdAt: "2026-04-21T10:00:00.000Z",
    course: fallbackCourses[0]
  }
];
