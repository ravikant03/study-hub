"use client";

import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FormError } from "@/components/FormError";
import { PageHeader } from "@/components/PageHeader";
import { apiRequest } from "@/lib/api";

const schema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required")
});

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <>
      <PageHeader title="Forgot Password" description="Enter your email and we will send a password reset OTP." />
      <section className="container-page py-8">
        <Formik
          initialValues={{ email: "" }}
          validationSchema={schema}
          onSubmit={async (values, helpers) => {
            try {
              await apiRequest("/auth/forgot-password", { method: "POST", body: values });
              router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
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
              <button className="btn-primary" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Sending..." : "Send OTP"}
              </button>
            </Form>
          )}
        </Formik>
      </section>
    </>
  );
}
