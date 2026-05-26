"use client";

import { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { AdminNav } from "@/components/AdminNav";
import { PageHeader } from "@/components/PageHeader";
import { fetchList } from "@/lib/api";
import { fallbackPayments } from "@/lib/mockData";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState(fallbackPayments);

  useEffect(() => {
    fetchList("/payments", fallbackPayments).then(setPayments);
  }, []);

  const rows = useMemo(
    () =>
      payments.map((payment, index) => ({
        id: payment._id || index,
        student: payment.user?.name || payment.user?.email || "-",
        course: payment.course?.title || "-",
        amount: `Rs. ${payment.amount || 0}`,
        method: payment.method || "razorpay",
        status: payment.status || "created",
        orderId: payment.razorpayOrderId || "-"
      })),
    [payments]
  );

  const columns = [
    { field: "student", headerName: "Student", flex: 1, minWidth: 160 },
    { field: "course", headerName: "Course", flex: 1, minWidth: 180 },
    { field: "amount", headerName: "Amount", flex: 0.6, minWidth: 120 },
    { field: "method", headerName: "Method", flex: 0.6, minWidth: 120 },
    { field: "status", headerName: "Status", flex: 0.6, minWidth: 120 },
    { field: "orderId", headerName: "Razorpay Order", flex: 1, minWidth: 180 }
  ];

  return (
    <>
      <AdminNav />
      <PageHeader eyebrow="Admin" title="Payment Management" description="Review all Razorpay payment records across the platform." />
      <section className="container-page py-8">
        <div className="card min-h-[560px] p-2">
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            sx={{
              border: 0,
              fontFamily: "Arial, Helvetica, sans-serif",
              "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 800 },
              "& .MuiDataGrid-cell": { color: "#334155" }
            }}
          />
        </div>
      </section>
    </>
  );
}
