"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FormError } from "@/components/FormError";
import { PageHeader } from "@/components/PageHeader";

const schema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  message: Yup.string().min(10, "Please add more detail").required("Message is required")
});

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact Us" description="Send a message to the StudyHub team for support, partnerships, or platform questions." />
      <section className="container-page py-8">
        <Formik
          initialValues={{ name: "", email: "", message: "" }}
          validationSchema={schema}
          onSubmit={(values, helpers) => {
            helpers.setStatus("Thanks. Your message is ready to send once a contact API endpoint is connected.");
            helpers.resetForm();
            helpers.setSubmitting(false);
          }}
        >
          {({ errors, touched, status, isSubmitting }) => (
            <Form className="card mx-auto grid max-w-2xl gap-4 p-6">
              {status ? <p className="rounded-lg bg-teal-50 p-3 text-sm font-semibold text-teal-800">{status}</p> : null}
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
                <span className="text-sm font-bold text-slate-700">Message</span>
                <Field as="textarea" className="field mt-1 min-h-36" name="message" />
                <FormError touched={touched.message} error={errors.message} />
              </label>
              <button className="btn-primary w-fit" disabled={isSubmitting} type="submit">Send Message</button>
            </Form>
          )}
        </Formik>
      </section>
    </>
  );
}
