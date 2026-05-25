"use client";

import { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import { DataGrid } from "@mui/x-data-grid";
import * as Yup from "yup";
import { AdminNav } from "@/components/AdminNav";
import { FormError } from "@/components/FormError";
import { PageHeader } from "@/components/PageHeader";
import { apiRequest, fetchList } from "@/lib/api";

export function AdminResourcePage({
  title,
  description,
  endpoint,
  writeEndpoint,
  fallback,
  fields,
  columns,
  eyebrow = "Admin",
  nav
}) {
  const [items, setItems] = useState(fallback);
  const [editingItem, setEditingItem] = useState(null);
  const baseEndpoint = writeEndpoint || endpoint.split("?")[0];
  const initialValues = useMemo(
    () => Object.fromEntries(fields.map((field) => [field.name, field.type === "file" ? null : field.initial || ""])),
    [fields]
  );
  const formValues = useMemo(() => {
    if (!editingItem) return initialValues;

    return Object.fromEntries(
      fields.map((field) => {
        if (field.type === "file") return [field.name, null];

        const sourceKey = field.sourceKey || field.name;
        const value = editingItem[sourceKey];

        if (value && typeof value === "object" && value._id) {
          return [field.name, value._id];
        }

        return [field.name, value ?? field.initial ?? ""];
      })
    );
  }, [editingItem, fields, initialValues]);
  const shape = useMemo(
    () =>
      Object.fromEntries(
        fields.map((field) => [
          field.name,
          field.type === "file"
            ? field.required
              ? Yup.mixed().required(`${field.label} is required`)
              : Yup.mixed().nullable()
            : field.required
              ? Yup.string().required(`${field.label} is required`)
              : Yup.string()
        ])
      ),
    [fields]
  );
  const hasFileUpload = fields.some((field) => field.type === "file");
  const handleDelete = async (row) => {
    const confirmed = window.confirm("Delete this record?");
    if (!confirmed) return;

    await apiRequest(`${baseEndpoint}/${row._id || row.id}`, { method: "DELETE" });
    setItems((current) => current.filter((item) => (item._id || item.id) !== (row._id || row.id)));
  };

  const gridColumns = useMemo(
    () => [
      ...columns.map((column) => ({
        field: column.key,
        headerName: column.label,
        flex: column.flex || 1,
        minWidth: column.minWidth || 150,
        valueGetter: column.valueGetter,
        renderCell: column.renderCell || (column.render ? (params) => column.render(params.row) : undefined)
      })),
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        filterable: false,
        minWidth: 170,
        renderCell: (params) => (
          <div className="flex gap-2">
            <button
              className="rounded-md border border-slate-300 px-2 py-1 text-xs font-bold text-slate-700"
              type="button"
              onClick={() => setEditingItem(params.row)}
            >
              Update
            </button>
            <button
              className="rounded-md border border-red-200 px-2 py-1 text-xs font-bold text-red-700"
              type="button"
              onClick={() => handleDelete(params.row)}
            >
              Delete
            </button>
          </div>
        )
      }
    ],
    [columns, baseEndpoint]
  );
  const rows = useMemo(
    () => items.map((item, index) => ({ id: item._id || item.id || index, ...item })),
    [items]
  );

  useEffect(() => {
    fetchList(endpoint, fallback).then(setItems);
  }, [endpoint, fallback]);

  return (
    <>
      {nav === undefined ? <AdminNav /> : nav}
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <section className="container-page grid gap-6 py-8 lg:grid-cols-[380px_1fr]">
        <Formik
          enableReinitialize
          initialValues={formValues}
          validationSchema={Yup.object(shape)}
          onSubmit={async (values, helpers) => {
            try {
              const body = hasFileUpload ? new FormData() : values;

              if (hasFileUpload) {
                Object.entries(values).forEach(([key, value]) => {
                  if (value !== undefined && value !== null && value !== "") {
                    body.append(key, value);
                  }
                });
              }

              const requestPath = editingItem ? `${baseEndpoint}/${editingItem._id || editingItem.id}` : endpoint;
              const payload = await apiRequest(requestPath, { method: editingItem ? "PATCH" : "POST", body });

              if (editingItem) {
                setItems((current) =>
                  current.map((item) =>
                    (item._id || item.id) === (editingItem._id || editingItem.id) ? payload.data : item
                  )
                );
                setEditingItem(null);
              } else {
                setItems((current) => [payload.data, ...current]);
              }

              helpers.resetForm();
              helpers.setStatus(editingItem ? "Updated successfully" : "Created successfully");
            } catch (error) {
              helpers.setStatus(error.message);
            } finally {
              helpers.setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, status, isSubmitting, setFieldValue }) => (
            <Form className="card grid content-start gap-4 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-black text-slate-950">{editingItem ? "Update" : "Create"}</h2>
                {editingItem ? (
                  <button className="text-sm font-bold text-slate-500" type="button" onClick={() => setEditingItem(null)}>
                    Cancel
                  </button>
                ) : null}
              </div>
              {status ? <p className="rounded-lg bg-teal-50 p-3 text-sm font-semibold text-teal-800">{status}</p> : null}
              {fields.map((field) => (
                <label key={field.name}>
                  <span className="text-sm font-bold text-slate-700">{field.label}</span>
                  {field.type === "file" ? (
                    <input
                      accept={field.accept}
                      className="field mt-1"
                      name={field.name}
                      type="file"
                      onChange={(event) => setFieldValue(field.name, event.currentTarget.files?.[0] || null)}
                    />
                  ) : field.type === "select" ? (
                    <Field
                      as="select"
                      className="field mt-1"
                      name={field.name}
                    >
                      {field.placeholderOption ? <option value="">{field.placeholderOption}</option> : null}
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </Field>
                  ) : field.type === "textarea" ? (
                    <Field as="textarea" className="field mt-1" name={field.name} />
                  ) : (
                    <Field className="field mt-1" name={field.name} type={field.inputType || "text"} />
                  )}
                  {field.help ? <p className="mt-1 text-xs leading-5 text-slate-500">{field.help}</p> : null}
                  <FormError touched={touched[field.name]} error={errors[field.name]} />
                </label>
              ))}
              <button className="btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingItem ? "Update" : "Save"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="card min-h-[520px] overflow-hidden p-2">
          <DataGrid
            rows={rows}
            columns={gridColumns}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            sx={{
              border: 0,
              fontFamily: "Arial, Helvetica, sans-serif",
              "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f8fafc" },
              "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 800 },
              "& .MuiDataGrid-cell": { color: "#334155" }
            }}
          />
        </div>
      </section>
    </>
  );
}
