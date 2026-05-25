import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export default function PaymentConfirmationPage() {
  return (
    <>
      <PageHeader title="Payment Confirmation" description="Your payment flow has been created. Complete Razorpay confirmation from your integration callback." />
      <section className="container-page py-8">
        <div className="card mx-auto grid max-w-xl justify-items-center gap-4 p-8 text-center">
          <CheckCircle2 className="h-14 w-14 text-teal-700" />
          <h2 className="text-2xl font-black text-slate-950">Enrollment payment is in progress</h2>
          <p className="text-sm leading-6 text-slate-600">
            After the Razorpay payment is confirmed, the backend verifies the signature and activates the course enrollment.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/enrollments" className="btn-primary">View Enrollments</Link>
            <Link href="/courses" className="btn-secondary">Browse Courses</Link>
          </div>
        </div>
      </section>
    </>
  );
}
