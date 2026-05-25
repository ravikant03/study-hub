"use client";

import Link from "next/link";
import Image from "next/image";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FormError } from "@/components/FormError";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

const schema = Yup.object({
  name: Yup.string().min(2, "Name is too short").required("Name is required"),
  phone: Yup.string().max(20, "Phone number is too long")
});

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();

  if (loading) return <PageHeader title="Profile" description="Loading your profile..." />;

  if (!user) {
    return (
      <>
        <PageHeader title="Profile" description="Login to manage your personal information and learning activity." />
        <section className="container-page py-8">
          <Link className="btn-primary" href="/login">Login</Link>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader title="User Profile" description="Manage your account details and jump back into your learning history." />
      <section className="container-page grid gap-6 py-8 lg:grid-cols-[1fr_320px]">
        <Formik
          enableReinitialize
          initialValues={{ name: user.name || "", phone: user.phone || "", avatar: null }}
          validationSchema={schema}
          onSubmit={async (values, helpers) => {
            try {
              const body = new FormData();
              body.append("name", values.name);
              if (values.phone) body.append("phone", values.phone);
              if (values.avatar) body.append("avatar", values.avatar);

              await apiRequest("/users/me", { method: "PATCH", body });
              await refreshUser();
              helpers.setStatus("Profile updated successfully");
            } catch (error) {
              helpers.setStatus(error.message);
            } finally {
              helpers.setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting, status, setFieldValue }) => (
            <Form className="card grid gap-4 p-6">
              {status ? <p className="rounded-lg bg-teal-50 p-3 text-sm font-semibold text-teal-800">{status}</p> : null}
              <label>
                <span className="text-sm font-bold text-slate-700">Name</span>
                <Field className="field mt-1" name="name" />
                <FormError touched={touched.name} error={errors.name} />
              </label>
              <label>
                <span className="text-sm font-bold text-slate-700">Phone</span>
                <Field className="field mt-1" name="phone" />
                <FormError touched={touched.phone} error={errors.phone} />
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
              <button className="btn-primary w-fit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Profile"}
              </button>
            </Form>
          )}
        </Formik>

        <aside className="card grid content-start gap-3 p-6">
          <div className="relative h-24 w-24 overflow-hidden rounded-full bg-slate-100">
            {user.avatar?.url ? (
              <Image src={user.avatar.url} alt={user.name || "Profile"} fill className="object-cover" sizes="96px" />
            ) : null}
          </div>
          <p className="text-sm font-bold text-slate-500">Signed in as</p>
          <p className="text-xl font-black text-slate-950">{user.name}</p>
          <p className="text-sm text-slate-600">{user.email}</p>
          <p className="rounded-md bg-amber-100 px-2 py-1 text-sm font-bold text-amber-900">{user.role}</p>
          <Link href="/enrollments" className="btn-secondary mt-2">Enrollment History</Link>
        </aside>
      </section>
    </>
  );
}
