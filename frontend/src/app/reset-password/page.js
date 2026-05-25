"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FormError } from "@/components/FormError";
import { PageHeader } from "@/components/PageHeader";
import { apiRequest } from "@/lib/api";

const schema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  otp: Yup.string().length(6, "OTP must be 6 digits").required("OTP is required"),
  password: Yup.string().min(8, "Use at least 8 characters").required("Password is required")
});

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <>
      <PageHeader title="Reset Password" description="Use the OTP sent to your email and choose a new password." />
      <section className="container-page py-8">
        <Formik
          initialValues={{ email: searchParams.get("email") || "", otp: "", password: "" }}
          validationSchema={schema}
          onSubmit={async (values, helpers) => {
            try {
              await apiRequest("/auth/reset-password", { method: "POST", body: values });
              router.push("/login");
            } catch (error) {
              helpers.setStatus(error.message);
            } finally {
              helpers.setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, status, isSubmitting }) => (
            <Form className="card mx-auto grid max-w-md gap-4 p-6">
              {status ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{status}</p> : null}
              <label>
                <span className="text-sm font-bold text-slate-700">Email</span>
                <Field className="field mt-1" name="email" type="email" />
                <FormError touched={touched.email} error={errors.email} />
              </label>
              <label>
                <span className="text-sm font-bold text-slate-700">OTP</span>
                <Field className="field mt-1" name="otp" />
                <FormError touched={touched.otp} error={errors.otp} />
              </label>
              <label>
                <span className="text-sm font-bold text-slate-700">New Password</span>
                <Field className="field mt-1" name="password" type="password" />
                <FormError touched={touched.password} error={errors.password} />
              </label>
              <button className="btn-primary" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </Form>
          )}
        </Formik>
      </section>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageHeader title="Reset Password" description="Loading reset form..." />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
