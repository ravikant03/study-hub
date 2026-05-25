"use client";

import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FormError } from "@/components/FormError";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";

const schema = Yup.object({
  name: Yup.string().min(2, "Name is too short").required("Name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().min(8, "Use at least 8 characters").required("Password is required"),
  role: Yup.string().oneOf(["student", "instructor"]).required("Role is required")
});

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  return (
    <>
      <PageHeader title="Create Account" description="Register as a student or instructor and start using StudyHub." />
      <section className="container-page py-8">
        <Formik
          initialValues={{ name: "", email: "", password: "", role: "student", avatar: null }}
          validationSchema={schema}
          onSubmit={async (values, helpers) => {
            try {
              await register(values);
              router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`);
            } catch (error) {
              helpers.setStatus(error.message);
            } finally {
              helpers.setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting, status, setFieldValue }) => (
            <Form className="card mx-auto grid max-w-md gap-4 p-6">
              {status ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{status}</p> : null}
              <label>
                <span className="text-sm font-bold text-slate-700">Name</span>
                <Field className="field mt-1" name="name" />
                <FormError touched={touched.name} error={errors.name} />
              </label>
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
              <label>
                <span className="text-sm font-bold text-slate-700">Account type</span>
                <Field as="select" className="field mt-1" name="role">
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </Field>
                <FormError touched={touched.role} error={errors.role} />
              </label>
              <label>
                <span className="text-sm font-bold text-slate-700">Profile image</span>
                <input
                  accept="image/png,image/jpeg,image/webp"
                  className="field mt-1"
                  type="file"
                  onChange={(event) => setFieldValue("avatar", event.currentTarget.files?.[0] || null)}
                />
              </label>
              <button className="btn-primary" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Creating..." : "Create Account"}
              </button>
            </Form>
          )}
        </Formik>
      </section>
    </>
  );
}
