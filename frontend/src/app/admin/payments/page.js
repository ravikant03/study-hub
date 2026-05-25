"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { PageHeader } from "@/components/PageHeader";
import { fetchList } from "@/lib/api";
import { fallbackPayments } from "@/lib/mockData";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState(fallbackPayments);

  useEffect(() => {
    fetchList("/payments/me", fallbackPayments).then(setPayments);
  }, []);

  return (
    <>
      <AdminNav />
      <PageHeader eyebrow="Admin" title="Payment Management" description="Review Razorpay payment records, statuses, and course references." />
      <section className="container-page py-8">
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="border-b border-slate-200 px-4 py-3 font-black">Course</th>
                <th className="border-b border-slate-200 px-4 py-3 font-black">Amount</th>
                <th className="border-b border-slate-200 px-4 py-3 font-black">Method</th>
                <th className="border-b border-slate-200 px-4 py-3 font-black">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-b border-slate-100">
                  <td className="px-4 py-3">{payment.course?.title || "-"}</td>
                  <td className="px-4 py-3">₹{payment.amount || 0}</td>
                  <td className="px-4 py-3">{payment.method || "razorpay"}</td>
                  <td className="px-4 py-3">{payment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
