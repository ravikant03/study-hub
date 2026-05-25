import {
  fallbackCategories,
  fallbackContent,
  fallbackCourses,
  fallbackEnrollments,
  fallbackInstructors,
  fallbackPayments,
  fallbackUsers
} from "./mockData";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const fallbackMap = {
  "/categories": fallbackCategories,
  "/courses": fallbackCourses,
  "/instructors": fallbackInstructors,
  "/enrollments/me": fallbackEnrollments,
  "/payments/me": fallbackPayments,
  "/users": fallbackUsers
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("studyhub_token");
};

export const setToken = (token) => {
  if (typeof window !== "undefined") localStorage.setItem("studyhub_token", token);
};

export const clearToken = () => {
  if (typeof window !== "undefined") localStorage.removeItem("studyhub_token");
};

export const apiRequest = async (path, options = {}) => {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body:
      options.body && !(options.body instanceof FormData) && typeof options.body !== "string"
        ? JSON.stringify(options.body)
        : options.body
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }

  return payload;
};

export const fetchList = async (path, fallback = []) => {
  try {
    const payload = await apiRequest(path);
    return payload.data || fallback;
  } catch {
    return fallbackMap[path] || fallback;
  }
};

export const fetchCourse = async (id) => {
  try {
    const payload = await apiRequest(`/courses/${id}`);
    return payload.data;
  } catch {
    return fallbackCourses.find((course) => course._id === id || course.slug === id) || fallbackCourses[0];
  }
};

export const fetchInstructor = async (id) => {
  try {
    const payload = await apiRequest(`/instructors/${id}`);
    return payload.data;
  } catch {
    const instructor = fallbackInstructors.find((item) => item._id === id) || fallbackInstructors[0];
    return {
      ...instructor,
      courses: fallbackCourses.filter((course) => course.instructor._id === instructor._id)
    };
  }
};

export const fetchCourseContent = async (courseId) => {
  try {
    const payload = await apiRequest(`/courses/${courseId}/content`);
    return payload.data || [];
  } catch {
    return fallbackContent;
  }
};
