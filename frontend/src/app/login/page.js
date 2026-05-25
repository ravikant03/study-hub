"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FormError } from "@/components/FormError";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";

const schema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().required("Password is required")
});

function LoginFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const nextPath = searchParams.get("next") || "/profile";

  return (
    <>
      <PageHeader title="Login" description="Access your courses, profile, enrollment history, and admin tools." />
      <section className="container-page py-8">
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={schema}
          onSubmit={async (values, helpers) => {
            try {
              await login(values);
              router.push(nextPath);
            } catch (error) {
              helpers.setStatus(error.message);
            } finally {
              helpers.setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting, status }) => (
            <Form className="card mx-auto grid max-w-md gap-4 p-6">
              {status ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{status}</p> : null}
              <label>
                <span className="text-sm font-bold text-slate-700">Email</span>
                <Field className="field mt-1" name="email" type="email" />
                <FormError touched={touched.email} error={errors.email} />
              </label>
              <label>
                <span className="text-sm font-bold text-slate-700">Password</span>
                <Field className="field mt-1" name="password" type="password" />
                <FormError touched={touched.password} error={errors.password} />
              </label>
              <button className="btn-primary" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
              <Link className="text-center text-sm font-bold text-teal-700" href="/forgot-password">
                Forgot password?
              </Link>
              <p className="text-center text-sm text-slate-600">
                New to StudyHub? <Link className="font-bold text-teal-700" href="/register">Create an account</Link>
              </p>
            </Form>
          )}
        </Formik>
      </section>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<PageHeader title="Login" description="Loading login form..." />}>
      <LoginFormPage />
    </Suspense>
  );
}
