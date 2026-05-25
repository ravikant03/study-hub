"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { CreditCard } from "lucide-react";
import { FormError } from "@/components/FormError";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { apiRequest, fetchCourse } from "@/lib/api";
import { fallbackCourses } from "@/lib/mockData";

const schema = Yup.object({
  method: Yup.string().oneOf(["razorpay"]).required("Select a payment method"),
  agree: Yup.boolean().oneOf([true], "Please confirm enrollment terms")
});

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function PaymentPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState(fallbackCourses[0]);

  useEffect(() => {
    fetchCourse(courseId).then(setCourse);
  }, [courseId]);

  return (
    <>
      <PageHeader title="Payment" description="Select Razorpay and complete payment for the selected course." />
      <section className="container-page grid gap-6 py-8 lg:grid-cols-[1fr_340px]">
        <Formik
          initialValues={{ method: "razorpay", agree: false }}
          validationSchema={schema}
          onSubmit={async (values, helpers) => {
            try {
              const isLoaded = await loadRazorpayScript();
              if (!isLoaded) {
                throw new Error("Razorpay checkout could not be loaded. Check your internet connection.");
              }

              const payload = await apiRequest("/payments/orders", {
                method: "POST",
                body: { courseId: course._id, method: values.method }
              });

              const { razorpay, payment } = payload.data;

              const options = {
                key: razorpay.keyId,
                amount: razorpay.amount,
                currency: razorpay.currency,
                name: "StudyHub",
                description: course.title,
                order_id: razorpay.orderId,
                prefill: {
                  name: user?.name || "",
                  email: user?.email || "",
                  contact: user?.phone || ""
                },
                theme: {
                  color: "#0f766e"
                },
                handler: async (response) => {
                  await apiRequest("/payments/confirm", {
                    method: "POST",
                    body: {
                      razorpayOrderId: response.razorpay_order_id,
                      razorpayPaymentId: response.razorpay_payment_id,
                      razorpaySignature: response.razorpay_signature
                    }
                  });

                  router.push(`/payments/confirmation?status=success&payment=${payment._id}`);
                },
                modal: {
                  ondismiss: () => {
                    helpers.setStatus("Payment popup was closed before completion.");
                  }
                }
              };

              const checkout = new window.Razorpay(options);
              checkout.on("payment.failed", (response) => {
                helpers.setStatus(response.error?.description || "Payment failed. Please try again.");
              });
              checkout.open();
            } catch (error) {
              helpers.setStatus(error.message);
            } finally {
              helpers.setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting, status }) => (
            <Form className="card grid gap-5 p-6">
              {status ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{status}</p> : null}
              <label className="card flex cursor-pointer items-center gap-3 p-4 shadow-none">
                <Field type="radio" name="method" value="razorpay" />
                <CreditCard className="h-5 w-5 text-teal-700" />
                <span className="font-bold text-slate-900">Razorpay</span>
              </label>
              <FormError touched={touched.method} error={errors.method} />
              <label className="flex gap-3 text-sm text-slate-700">
                <Field type="checkbox" name="agree" />
                I confirm this enrollment and understand payment will be processed securely.
              </label>
              <FormError touched={touched.agree} error={errors.agree} />
              <button className="btn-primary w-fit" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Opening Razorpay..." : "Proceed to Payment"}
              </button>
            </Form>
          )}
        </Formik>

        <aside className="card p-6">
          <p className="text-sm font-bold text-slate-500">Course</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">{course.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{course.description}</p>
          <p className="mt-5 text-3xl font-black text-slate-950">Rs. {course.price || 0}</p>
        </aside>
      </section>
    </>
  );
}
