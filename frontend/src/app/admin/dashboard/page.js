"use client";

import { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { BookOpen, CreditCard, GraduationCap, Layers, Users } from "lucide-react";
import { AdminNav } from "@/components/AdminNav";
import { fetchList } from "@/lib/api";
import {
  fallbackCategories,
  fallbackCourses,
  fallbackEnrollments,
  fallbackInstructors,
  fallbackPayments
} from "@/lib/mockData";

const statStyles = [
  { label: "Total Courses", key: "courses", icon: BookOpen, bg: "#ecfdf5", color: "#047857" },
  { label: "Categories", key: "categories", icon: Layers, bg: "#eff6ff", color: "#2563eb" },
  { label: "Instructors", key: "instructors", icon: GraduationCap, bg: "#fff7ed", color: "#c2410c" },
  { label: "Enrollments", key: "enrollments", icon: Users, bg: "#f5f3ff", color: "#7c3aed" },
  { label: "Payments", key: "payments", icon: CreditCard, bg: "#fef2f2", color: "#dc2626" }
];

export default function AdminDashboardPage() {
  const [courses, setCourses] = useState(fallbackCourses);
  const [categories, setCategories] = useState(fallbackCategories);
  const [instructors, setInstructors] = useState(fallbackInstructors);
  const [enrollments, setEnrollments] = useState(fallbackEnrollments);
  const [payments, setPayments] = useState(fallbackPayments);

  useEffect(() => {
    Promise.all([
      fetchList("/courses?status=all", fallbackCourses),
      fetchList("/categories", fallbackCategories),
      fetchList("/instructors", fallbackInstructors),
      fetchList("/enrollments/me", fallbackEnrollments),
      fetchList("/payments/me", fallbackPayments)
    ]).then(([courseData, categoryData, instructorData, enrollmentData, paymentData]) => {
      setCourses(courseData);
      setCategories(categoryData);
      setInstructors(instructorData);
      setEnrollments(enrollmentData);
      setPayments(paymentData);
    });
  }, []);

  const metrics = {
    courses: courses.length,
    categories: categories.length,
    instructors: instructors.length,
    enrollments: enrollments.length,
    payments: payments.length
  };

  const paymentRows = useMemo(
    () =>
      payments.map((payment, index) => ({
        id: payment._id || index,
        course: payment.course?.title || "Course",
        amount: `Rs. ${payment.amount || 0}`,
        method: payment.method || "razorpay",
        status: payment.status || "created"
      })),
    [payments]
  );

  const paymentColumns = [
    { field: "course", headerName: "Course", flex: 1, minWidth: 220 },
    { field: "amount", headerName: "Amount", flex: 0.6, minWidth: 120 },
    { field: "method", headerName: "Method", flex: 0.6, minWidth: 120 },
    { field: "status", headerName: "Status", flex: 0.6, minWidth: 120 }
  ];

  return (
    <>
      <AdminNav />
      <section className="bg-[#f8fafc]">
        <div className="container-page py-8">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Admin</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Simple overview of courses, users, enrollments, and payments.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="card overflow-hidden bg-slate-900 p-6 text-white">
              <p className="text-sm font-bold text-teal-200">Welcome back</p>
              <h2 className="mt-2 max-w-xl text-2xl font-black">Manage StudyHub from one clean workspace.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Create categories, publish courses, add instructors, upload content, and track enrollments.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-2xl font-black">{metrics.courses}</p>
                  <p className="text-xs font-bold text-slate-300">Courses</p>
                </div>
                <div>
                  <p className="text-2xl font-black">{metrics.enrollments}</p>
                  <p className="text-xs font-bold text-slate-300">Enrollments</p>
                </div>
                <div>
                  <p className="text-2xl font-black">{metrics.payments}</p>
                  <p className="text-xs font-bold text-slate-300">Payments</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <p className="text-sm font-black text-slate-950">Course Status</p>
              <div className="mt-5 grid gap-4">
                {courses.slice(0, 4).map((course, index) => {
                  const value = Math.min(100, 35 + index * 18);
                  return (
                    <div key={course._id || course.title}>
                      <div className="flex justify-between gap-3 text-sm">
                        <span className="font-bold text-slate-700">{course.title}</span>
                        <span className="text-slate-500">{value}%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-teal-600" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {statStyles.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.key} className="card p-5">
                  <div className="grid h-11 w-11 place-items-center rounded-lg" style={{ background: stat.bg, color: stat.color }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-2xl font-black text-slate-950">{metrics[stat.key]}</p>
                  <p className="mt-1 text-sm font-bold text-slate-500">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="card p-6">
              <p className="text-sm font-black text-slate-950">Quick Summary</p>
              <div className="mt-5 grid gap-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-600">Categories ready</span><strong>{metrics.categories}</strong></div>
                <div className="flex justify-between"><span className="text-slate-600">Instructor profiles</span><strong>{metrics.instructors}</strong></div>
                <div className="flex justify-between"><span className="text-slate-600">Active records</span><strong>{metrics.courses + metrics.enrollments}</strong></div>
              </div>
            </div>

            <div className="card min-h-[360px] p-2">
              <DataGrid
                rows={paymentRows}
                columns={paymentColumns}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10]}
                initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                sx={{
                  border: 0,
                  fontFamily: "Arial, Helvetica, sans-serif",
                  "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 800 },
                  "& .MuiDataGrid-cell": { color: "#334155" }
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
