export function FormError({ touched, error }) {
  if (!touched || !error) return null;
  return <p className="mt-1 text-sm font-semibold text-red-600">{error}</p>;
}
