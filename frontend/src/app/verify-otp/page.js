"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FormError } from "@/components/FormError";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

const schema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  otp: Yup.string().length(6, "OTP must be 6 digits").required("OTP is required")
});

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp } = useAuth();
  const email = searchParams.get("email") || "";

  return (
    <>
      <PageHeader title="Verify OTP" description="Enter the 6 digit code sent to your email to activate your account." />
      <section className="container-page py-8">
        <Formik
          initialValues={{ email, otp: "" }}
          validationSchema={schema}
          onSubmit={async (values, helpers) => {
            try {
              await verifyOtp(values);
              router.push("/profile");
            } catch (error) {
              helpers.setStatus(error.message);
            } finally {
              helpers.setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, status, isSubmitting, values, setStatus }) => (
            <Form className="card mx-auto grid max-w-md gap-4 p-6">
              {status ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{status}</p> : null}
              <label>
                <span className="text-sm font-bold text-slate-700">Email</span>
                <Field className="field mt-1" name="email" type="email" />
                <FormError touched={touched.email} error={errors.email} />
              </label>
              <label>
                <span className="text-sm font-bold text-slate-700">6 digit OTP</span>
                <Field className="field mt-1" name="otp" />
                <FormError touched={touched.otp} error={errors.otp} />
              </label>
              <button className="btn-primary" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Verifying..." : "Verify Account"}
              </button>
              <button
                className="btn-secondary"
                type="button"
                onClick={async () => {
                  try {
                    await apiRequest("/auth/resend-verification-otp", { method: "POST", body: { email: values.email } });
                    setStatus("A new OTP has been sent.");
                  } catch (error) {
                    setStatus(error.message);
                  }
                }}
              >
                Resend OTP
              </button>
            </Form>
          )}
        </Formik>
      </section>
    </>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<PageHeader title="Verify OTP" description="Loading verification form..." />}>
      <VerifyOtpForm />
    </Suspense>
  );
}
